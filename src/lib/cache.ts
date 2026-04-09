/**
 * Firestore-backed platform-wide cache with TTL support.
 * All API data is stored here so one fetch serves all users.
 */
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

interface CacheDocument {
    data: unknown;
    fetchedAt: Timestamp;
}

/**
 * Retrieve cached data if it exists and is still fresh.
 * @param key  - Unique cache key (e.g. "enrich-AAPL")
 * @param ttlSeconds - How long the cache is valid (e.g. 86400 = 24h)
 * @returns Cached data or null if missing/stale
 */
export async function getCached<T>(key: string, ttlSeconds: number): Promise<T | null> {
    try {
        const ref = doc(db, "cache", key);
        const snap = await getDoc(ref);

        if (!snap.exists()) return null;

        const cached = snap.data() as CacheDocument;
        const fetchedAt = cached.fetchedAt?.toDate?.();

        if (!fetchedAt) return null;

        const ageSeconds = (Date.now() - fetchedAt.getTime()) / 1000;
        if (ageSeconds > ttlSeconds) return null; // stale

        return cached.data as T;
    } catch (err) {
        console.error(`[cache] getCached error for key "${key}":`, err);
        return null;
    }
}

/**
 * Store data in the Firestore cache.
 * @param key  - Unique cache key
 * @param data - Any JSON-serializable data
 */
export async function setCached(key: string, data: unknown): Promise<void> {
    try {
        const ref = doc(db, "cache", key);
        await setDoc(ref, {
            data,
            fetchedAt: serverTimestamp(),
        });
    } catch (err) {
        console.error(`[cache] setCached error for key "${key}":`, err);
    }
}
