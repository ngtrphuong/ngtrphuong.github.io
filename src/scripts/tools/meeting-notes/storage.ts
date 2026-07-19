import { IDB_NAME, IDB_STORE, SESSION_ID } from './constants.ts';
import type { TranscriptSegment } from './types.ts';

export type StoredSession = {
  id: string;
  updatedAt: number;
  segments: TranscriptSegment[];
  language: string;
  /** User-renamed speaker labels, keyed by the heuristic default label (e.g. "Speaker 1"). */
  speakerLabelOverrides?: Record<string, string>;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(SESSION_ID);
      req.onsuccess = () => resolve((req.result as StoredSession) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function saveSession(
  segments: TranscriptSegment[],
  language: string,
  speakerLabelOverrides?: Record<string, string>,
): Promise<void> {
  try {
    const db = await openDb();
    const payload: StoredSession = {
      id: SESSION_ID,
      updatedAt: Date.now(),
      segments,
      language,
      speakerLabelOverrides,
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const req = tx.objectStore(IDB_STORE).put(payload, SESSION_ID);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* fail silently — persistence is optional enhancement */
  }
}

export async function clearSession(): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const req = tx.objectStore(IDB_STORE).delete(SESSION_ID);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* ignore */
  }
}
