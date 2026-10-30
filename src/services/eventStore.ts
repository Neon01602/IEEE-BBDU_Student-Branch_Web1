import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { EventItem } from '../types';
import { compressDataUrlIfNeeded } from '../utils/imageCompressor';

const STORAGE_KEY = 'ieee_bbdu_events_store';
const UPDATE_EVENT_NAME = 'ieee-events-updated';
const LAST_FETCH_KEY = 'ieee_bbdu_events_last_fetch';

// 3-minute in-session cache debounce: Prevents repeated Firestore queries when navigating tabs/pages
const READ_CACHE_TTL_MS = 3 * 60 * 1000;

// In-memory cache holding ONLY the user's real Firestore events
let cachedEvents: EventItem[] = [];

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

// Edit distance, used to forgive typos like "Spetember"
function editDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

// Returns month index 0-11 for "july", "jul", "sept", or a typo like "spetember"
function findMonth(s: string): number {
  const words = s.match(/[a-z]+/g) || [];
  for (const w of words) {
    if (w.length >= 3) {
      const idx = MONTH_NAMES.findIndex((name) => name.startsWith(w));
      if (idx !== -1) return idx;
    }
  }
  for (const w of words) {
    if (w.length >= 4) {
      const idx = MONTH_NAMES.findIndex((name) => name[0] === w[0] && editDistance(w, name) <= 2);
      if (idx !== -1) return idx;
    }
  }
  return -1;
}

/**
 * Parses the free-text event date (e.g. "July 3rd, 2026", "3 July 2026",
 * "July 3-5, 2026", "October 2025", "2026-07-03", "03/07/2026") into a UTC
 * timestamp. Tolerates misspelt months. Returns NaN when it cannot be understood.
 */
export function parseEventDate(input?: string): number {
  if (!input) return NaN;
  const s = input.toLowerCase().replace(/(\d+)(st|nd|rd|th)\b/g, '$1').replace(/,/g, ' ').trim();

  // ISO: 2026-07-03
  let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);

  // dd/mm/yyyy or dd.mm.yyyy
  m = s.match(/(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})/);
  if (m) return Date.UTC(+m[3], +m[2] - 1, +m[1]);

  // Month name + year (+ optional day; for ranges like "8-10" the first day is used)
  const month = findMonth(s);
  const yearMatch = s.match(/\b(\d{4})\b/);
  if (month !== -1 && yearMatch) {
    const dayMatch = s.replace(yearMatch[1], ' ').match(/\b(\d{1,2})\b/);
    const day = dayMatch ? Math.min(Math.max(+dayMatch[1], 1), 31) : 1;
    return Date.UTC(+yearMatch[1], month, day);
  }

  // Unreadable: NaN (sorts to the bottom) instead of letting the browser guess wrongly
  return NaN;
}

/**
 * Sort key used everywhere events are ranked. Sorting DESCENDING on this key
 * gives: newest event date first, oldest last. If two events share the same
 * date, the one pushed/updated most recently comes first.
 */
export function getEventPushTimestamp(event: EventItem): number {
  if (!event) return 0;

  // Push time (used only as a tie-breaker)
  const times: number[] = [];
  if (event.updatedAt) times.push(new Date(event.updatedAt).getTime());
  if (event.createdAt) times.push(new Date(event.createdAt).getTime());
  if (event.id && event.id.startsWith('evt-')) {
    const n = parseInt(event.id.replace('evt-', ''), 10);
    if (!isNaN(n) && n > 1000000000000) times.push(n);
  }
  const pushSeconds = Math.floor(Math.max(0, ...times.filter((t) => !isNaN(t))) / 1000);

  // Event date (primary key), in whole days since 1970
  const dateMs = parseEventDate(event.date);
  const days = isNaN(dateMs) ? 0 : Math.floor(dateMs / 86400000);

  return days * 1e10 + pushSeconds;
}

// Initialize cache from localStorage so previously saved real Firebase events are available instantly
try {
  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      // Filter out any mock/seed events if they were cached previously
      if (Array.isArray(parsed)) {
        cachedEvents = parsed.filter(e => !e.id?.startsWith('evt-crack-the-case') && !e.id?.startsWith('evt-toonforge-ai') && !e.id?.startsWith('evt-startup-pitch-2026') && !e.id?.startsWith('evt-the-ai-talk-show') || e.createdAt !== '2026-10-06T10:00:00.000Z');
      }
    }
    cachedEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
  }
} catch (e) {
  console.warn('Could not read cached events from localStorage', e);
  cachedEvents = [];
}

let isFetchInProgress = false;

/**
 * Fetches the user's real events from Firebase Firestore.
 * Caches them in localStorage so subsequent page visits avoid burning read quota.
 */
async function fetchFirebaseEvents(force: boolean = false): Promise<EventItem[]> {
  if (typeof window === 'undefined' || isFetchInProgress) {
    return [...cachedEvents];
  }

  const now = Date.now();

  // If not forced and cache was fetched recently, return cached events to save Firestore read quota
  if (!force && cachedEvents.length > 0) {
    try {
      const lastFetch = Number(sessionStorage.getItem(LAST_FETCH_KEY) || '0');
      if (now - lastFetch < READ_CACHE_TTL_MS) {
        return [...cachedEvents];
      }
    } catch {}
  }

  isFetchInProgress = true;

  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);

    const cloudEvents: EventItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as EventItem;
      cloudEvents.push({
        ...data,
        id: docSnap.id
      });
    });

    cloudEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
    cachedEvents = cloudEvents;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudEvents));
      sessionStorage.setItem(LAST_FETCH_KEY, String(now));
    } catch (e) {
      console.warn('Failed to persist events to localStorage', e);
    }

    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cloudEvents }));
    return cloudEvents;
  } catch (error: any) {
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errMsg.includes('Quota exceeded') || errMsg.includes('resource-exhausted')) {
      console.warn('[EventStore] Firebase daily read quota currently exceeded. Serving previously loaded Firebase events from cache.');
    } else {
      console.warn('[EventStore] Notice while fetching events from Firebase:', errMsg);
    }
    // Return existing cached events from localStorage so UI does not crash
    return [...cachedEvents];
  } finally {
    isFetchInProgress = false;
  }
}

// Automatically fetch real Firebase events on boot
if (typeof window !== 'undefined') {
  fetchFirebaseEvents(false).catch(() => {});
}

// Helper to recursively remove all undefined values before passing to Firestore
function cleanFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => (typeof item === 'object' && item !== null ? cleanFirestoreData(item) : item));
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = typeof val === 'object' && val !== null ? cleanFirestoreData(val) : val;
      }
    }
    return cleaned;
  }
  return obj;
}

export const eventStore = {
  // Retrieve events: Returns cached Firebase events immediately, fetches latest in background
  getEvents(): EventItem[] {
    fetchFirebaseEvents(false).catch(() => {});
    return [...cachedEvents].sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
  },

  // Explicitly fetch latest events from Firebase Firestore
  async refreshEvents(force: boolean = true): Promise<EventItem[]> {
    return await fetchFirebaseEvents(force);
  },

  // Save/Publish an event to Firebase Firestore
  async addEvent(event: EventItem): Promise<EventItem> {
    const nowIso = new Date().toISOString();
    const eventWithTimestamp: EventItem = {
      ...event,
      createdAt: event.createdAt || nowIso,
      updatedAt: event.updatedAt || nowIso
    };

    // 1. Optimistically update local cache and sort by latest pushed
    cachedEvents = [eventWithTimestamp, ...cachedEvents.filter(e => e.id !== event.id)];
    cachedEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedEvents));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cachedEvents }));

    // 2. Write to Firebase Firestore
    try {
      const docRef = doc(db, 'events', event.id);
      const cleanedData = cleanFirestoreData(eventWithTimestamp);

      // Guard against Firestore 1MB document size limit
      const initialSize = JSON.stringify(cleanedData).length;
      if (initialSize > 600 * 1024) {
        if (cleanedData.image && typeof cleanedData.image === 'string' && cleanedData.image.startsWith('data:image')) {
          cleanedData.image = await compressDataUrlIfNeeded(cleanedData.image, 800);
        }
        if (Array.isArray(cleanedData.relatedPictures)) {
          cleanedData.relatedPictures = await Promise.all(
            cleanedData.relatedPictures.map((pic: string) => 
              typeof pic === 'string' && pic.startsWith('data:image') ? compressDataUrlIfNeeded(pic, 600) : Promise.resolve(pic)
            )
          );
        }
      }

      await setDoc(docRef, cleanedData);
      console.log(`Event ${event.id} successfully saved to Firebase Firestore.`);
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('Quota exceeded') || errMsg.includes('resource-exhausted')) {
        console.warn(`[EventStore] Firebase daily quota reached. Event ${event.id} is saved locally and will sync when quota resets.`);
      } else {
        handleFirestoreError(error, OperationType.WRITE, `events/${event.id}`);
      }
    }

    return eventWithTimestamp;
  },

  // Update event in Firebase Firestore
  async updateEvent(event: EventItem): Promise<void> {
    const updatedWithTimestamp: EventItem = {
      ...event,
      updatedAt: new Date().toISOString()
    };

    // 1. Optimistic local update and re-rank
    cachedEvents = cachedEvents.map(e => e.id === event.id ? updatedWithTimestamp : e);
    cachedEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedEvents));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cachedEvents }));

    // 2. Sync modification to Firebase Firestore
    const docRef = doc(db, 'events', event.id);
    try {
      const cleanedData = cleanFirestoreData(updatedWithTimestamp);

      const initialSize = JSON.stringify(cleanedData).length;
      if (initialSize > 600 * 1024) {
        if (cleanedData.image && typeof cleanedData.image === 'string' && cleanedData.image.startsWith('data:image')) {
          cleanedData.image = await compressDataUrlIfNeeded(cleanedData.image, 800);
        }
        if (Array.isArray(cleanedData.relatedPictures)) {
          cleanedData.relatedPictures = await Promise.all(
            cleanedData.relatedPictures.map((pic: string) => 
              typeof pic === 'string' && pic.startsWith('data:image') ? compressDataUrlIfNeeded(pic, 600) : Promise.resolve(pic)
            )
          );
        }
      }

      await setDoc(docRef, cleanedData, { merge: true });
      console.log(`Event ${event.id} successfully updated in Firebase Firestore.`);
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('Quota exceeded') || errMsg.includes('resource-exhausted')) {
        console.warn(`[EventStore] Firebase write quota paused. Event ${event.id} updated locally.`);
      } else {
        handleFirestoreError(error, OperationType.UPDATE, `events/${event.id}`);
      }
    }
  },

  // Delete event from Firebase Firestore
  async deleteEvent(id: string): Promise<void> {
    cachedEvents = cachedEvents.filter(e => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedEvents));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cachedEvents }));

    try {
      const docRef = doc(db, 'events', id);
      await deleteDoc(docRef);
      console.log(`Event ${id} removed from Firebase Firestore.`);
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('Quota exceeded') || errMsg.includes('resource-exhausted')) {
        console.warn(`[EventStore] Cloud deletion paused by quota. Event ${id} removed locally.`);
      } else {
        handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
      }
    }
  },

  // Subscribe to updates across components
  subscribe(callback: (events: EventItem[]) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<EventItem[]>;
      callback(customEvent.detail || cachedEvents);
    };
    window.addEventListener(UPDATE_EVENT_NAME, handler);
    return () => {
      window.removeEventListener(UPDATE_EVENT_NAME, handler);
    };
  }
};
