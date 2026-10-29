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

/**
 * Computes a standardized numerical push timestamp for ranking events.
 * Ranks strictly by the most recent push (updatedAt, createdAt, or ID timestamp).
 */
export function getEventPushTimestamp(event: EventItem): number {
  if (!event) return 0;
  
  // 1. If an event was updated/re-pushed, check updatedAt
  let updateTime = 0;
  if (event.updatedAt) {
    const parsed = new Date(event.updatedAt).getTime();
    if (!isNaN(parsed)) updateTime = parsed;
  }

  // 2. Check createdAt
  let createTime = 0;
  if (event.createdAt) {
    const parsed = new Date(event.createdAt).getTime();
    if (!isNaN(parsed)) createTime = parsed;
  }

  // 3. Check evt-<timestamp> format generated at creation time
  let idTime = 0;
  if (event.id && event.id.startsWith('evt-')) {
    const parsed = parseInt(event.id.replace('evt-', ''), 10);
    if (!isNaN(parsed) && parsed > 1000000000000) {
      idTime = parsed;
    }
  }

  // 4. Return the latest push timestamp among update, creation, or id
  const highest = Math.max(updateTime, createTime, idTime);
  if (highest > 0) return highest;

  // 5. Fallback to event date
  if (event.date) {
    const parsed = Date.parse(event.date);
    if (!isNaN(parsed)) return parsed;
  }

  return 0;
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

        // Rank strictly according to latest pushed first
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

    // Optimistically update local cache and sort by latest pushed
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

  // Update event in Firebase Firestore (stamps updatedAt and re-ranks to latest pushed)
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
