import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { EventItem } from '../types';
import { compressDataUrlIfNeeded } from '../utils/imageCompressor';

const STORAGE_KEY = 'ieee_bbdu_events_store';
const UPDATE_EVENT_NAME = 'ieee-events-updated';

// In-memory cache
let cachedEvents: EventItem[] = [];

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Parses the free-text event date (e.g. "July 3rd, 2026", "3 July 2026",
 * "July 3-5, 2026", "October 2025", "2026-07-03", "03/07/2026") into a UTC
 * timestamp. Returns NaN when it cannot be understood.
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

  // Month name + year (+ optional day, first number found is used for ranges)
  const monthMatch = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/);
  const yearMatch = s.match(/\b(\d{4})\b/);
  if (monthMatch && yearMatch) {
    const dayMatch = s.replace(yearMatch[1], ' ').match(/\b(\d{1,2})\b/);
    const day = dayMatch ? Math.min(Math.max(+dayMatch[1], 1), 31) : 1;
    return Date.UTC(+yearMatch[1], MONTHS[monthMatch[1]], day);
  }

  const fallback = Date.parse(input);
  return isNaN(fallback) ? NaN : fallback;
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

// Initialize cache from localStorage if available
try {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    cachedEvents = JSON.parse(localData);
    cachedEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
  }
} catch (e) {
  console.warn('Could not read cached events from localStorage', e);
}

// Global Firestore Real-Time Listener
let isListenerAttached = false;

function initRealtimeListener() {
  if (isListenerAttached || typeof window === 'undefined') return;
  isListenerAttached = true;

  try {
    const eventsRef = collection(db, 'events');
    onSnapshot(
      eventsRef,
      (snapshot) => {
        const liveEvents: EventItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as EventItem;
          liveEvents.push({
            ...data,
            id: docSnap.id
          });
        });

        // Rank by event date, newest first
        liveEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));

        cachedEvents = liveEvents;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(liveEvents));
        } catch (e) {
          console.warn('Failed to cache events in localStorage', e);
        }

        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: liveEvents }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'events');
      }
    );
  } catch (err) {
    console.error('Error attaching Firestore listener for events', err);
  }
}

// Attach listener immediately
initRealtimeListener();

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
  // Retrieve events (from cache synchronously, updated automatically via real-time Firestore)
  getEvents(): EventItem[] {
    initRealtimeListener();
    return [...cachedEvents].sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
  },

  // Save/Publish an event to Firebase Firestore
  async addEvent(event: EventItem): Promise<EventItem> {
    const nowIso = new Date().toISOString();
    const eventWithTimestamp: EventItem = {
      ...event,
      createdAt: event.createdAt || nowIso,
      updatedAt: event.updatedAt || nowIso
    };

    // Optimistically update local cache and sort by event date
    cachedEvents = [eventWithTimestamp, ...cachedEvents.filter(e => e.id !== event.id)];
    cachedEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedEvents));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cachedEvents }));

    // Write to Firebase Firestore (cleaned of any undefined values and guarded against >800KB size)
    try {
      const docRef = doc(db, 'events', event.id);
      const cleanedData = cleanFirestoreData(eventWithTimestamp);

      // Guard against Firestore 1MB document size limit (1,048,576 bytes)
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
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `events/${event.id}`);
    }

    return eventWithTimestamp;
  },

  // Update event in Firebase Firestore (stamps updatedAt and re-ranks by event date)
  async updateEvent(event: EventItem): Promise<void> {
    const updatedWithTimestamp: EventItem = {
      ...event,
      updatedAt: new Date().toISOString()
    };

    // Optimistic local update and re-rank
    cachedEvents = cachedEvents.map(e => e.id === event.id ? updatedWithTimestamp : e);
    cachedEvents.sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedEvents));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cachedEvents }));

    const docRef = doc(db, 'events', event.id);
    try {
      const cleanedData = cleanFirestoreData(updatedWithTimestamp);

      // Guard against Firestore 1MB document size limit (1,048,576 bytes)
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
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${event.id}`);
    }
  },

  // Delete event from Firebase Firestore
  async deleteEvent(id: string): Promise<void> {
    // Optimistic local update
    cachedEvents = cachedEvents.filter(e => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedEvents));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: cachedEvents }));

    // Remove from Firestore
    try {
      const docRef = doc(db, 'events', id);
      await deleteDoc(docRef);
      console.log(`Event ${id} removed from Firebase Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  },

  // Subscribe to real-time updates
  subscribe(callback: (events: EventItem[]) => void): () => void {
    initRealtimeListener();
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
