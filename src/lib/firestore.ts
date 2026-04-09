import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, writeBatch, limit, startAfter, QueryDocumentSnapshot, getCountFromServer, QueryConstraint } from "firebase/firestore";
import { db } from "./firebase/config";
import { Investor } from "./investor-data";

export interface CRMInvestor extends Investor {
    status: "To be contacted" | "Reached out" | "In progress" | "Committed" | "Not happening";
    userId: string;
    updatedAt: any;
    notes?: string;
}

export interface UserWatchlist {
    tickers: string[];
}

export async function getWatchlist(userId: string): Promise<string[]> {
    try {
        const ref = doc(db, "watchlists", userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return (snap.data() as UserWatchlist).tickers || [];
        }
        return [];
    } catch (err) {
        console.error("Failed to get watchlist", err);
        return [];
    }
}

export async function toggleWatchlist(userId: string, ticker: string, isAdding: boolean): Promise<void> {
    try {
        const ref = doc(db, "watchlists", userId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            if (isAdding) {
                await setDoc(ref, { tickers: [ticker] });
            }
        } else {
            if (isAdding) {
                await updateDoc(ref, { tickers: arrayUnion(ticker) });
            } else {
                await updateDoc(ref, { tickers: arrayRemove(ticker) });
            }
        }
    } catch (err) {
        console.error("Failed to update watchlist", err);
        throw err;
    }
}

export async function addToCRM(userId: string, investor: Investor): Promise<void> {
    try {
        const ref = doc(db, "crm", `${userId}_${investor.id}`);
        await setDoc(ref, {
            ...investor,
            userId,
            status: "To be contacted",
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Failed to add to CRM", err);
        throw err;
    }
}

export async function getCRMInvestors(userId: string): Promise<CRMInvestor[]> {
    try {
        const q = query(collection(db, "crm"), where("userId", "==", userId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CRMInvestor));
    } catch (err) {
        console.error("Failed to get CRM investors", err);
        return [];
    }
}

export async function updateCRMStatus(userId: string, investorId: string, status: CRMInvestor["status"]): Promise<void> {
    try {
        const ref = doc(db, "crm", investorId);
        await updateDoc(ref, {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Failed to update CRM status", err);
        throw err;
    }
}

export async function removeFromCRM(userId: string, investorId: string): Promise<void> {
    try {
        const ref = doc(db, "crm", investorId);
        await deleteDoc(ref);
    } catch (err) {
        console.error("Failed to remove from CRM", err);
        throw err;
    }
}

// Global Investor Database Functions
export async function saveInvestors(investors: Investor[]): Promise<void> {
    try {
        const CHUNK_SIZE = 500;
        for (let i = 0; i < investors.length; i += CHUNK_SIZE) {
            const chunk = investors.slice(i, i + CHUNK_SIZE);
            const batch = writeBatch(db);

            chunk.forEach(investor => {
                const ref = doc(db, "investors", investor.id);
                batch.set(ref, {
                    ...investor,
                    updatedAt: serverTimestamp()
                });
            });

            await batch.commit();
            console.log(`Uploaded batch ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(investors.length / CHUNK_SIZE)}`);
        }
    } catch (err) {
        console.error("Failed to save investors to Firestore", err);
        throw err;
    }

    // Expose for bulk upload tool
    if (typeof window !== 'undefined') {
        (window as any)._bulkSaveInvestors = saveInvestors;
        console.log('Warrenintel: _bulkSaveInvestors exposed to window');
    }
}

export async function getGlobalInvestors(
    lastDoc?: QueryDocumentSnapshot,
    pageSize: number = 50,
    searchQuery?: string,
    filters?: { location?: string; stage?: string; checks?: string }
): Promise<{ investors: Investor[], lastDoc: QueryDocumentSnapshot | null }> {
    try {
        console.log('Fetching investors with:', { searchQuery, filters });
        let q = query(collection(db, "investors"));

        if (searchQuery) {
            // Basic prefix search
            q = query(q,
                where("name", ">=", searchQuery),
                where("name", "<=", searchQuery + "\uf8ff")
            );
        }

        if (filters?.location) {
            q = query(q, where("location", "==", filters.location));
        }

        if (filters?.stage) {
            q = query(q, where("stage", "array-contains", filters.stage));
        }

        if (filters?.checks) {
            q = query(q, where("checks", "==", filters.checks));
        }

        const constraints: QueryConstraint[] = [limit(pageSize)];
        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        // Apply pagination constraints to the existing query
        const paginatedQ = query(q, ...constraints);
        const snap = await getDocs(paginatedQ);

        const investors = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Investor));
        const newLastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
        return { investors, lastDoc: newLastDoc };
    } catch (err) {
        console.error("Failed to get global investors", err);
        return { investors: [], lastDoc: null };
    }
}

export async function updateInvestor(investorId: string, data: Partial<Investor>): Promise<void> {
    try {
        const ref = doc(db, "investors", investorId);
        await updateDoc(ref, {
            ...data,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Failed to update investor", err);
        throw err;
    }
}
export async function getGlobalInvestorsCount(
    searchQuery?: string,
    filters?: { location?: string; stage?: string; checks?: string }
): Promise<number> {
    try {
        console.log('Counting investors with:', { searchQuery, filters });
        let q = query(collection(db, "investors"));

        if (searchQuery) {
            q = query(q,
                where("name", ">=", searchQuery),
                where("name", "<=", searchQuery + "\uf8ff")
            );
        }

        if (filters?.location) {
            q = query(q, where("location", "==", filters.location));
        }

        if (filters?.stage) {
            q = query(q, where("stage", "array-contains", filters.stage));
        }

        if (filters?.checks) {
            q = query(q, where("checks", "==", filters.checks));
        }

        const snap = await getCountFromServer(q);
        return snap.data().count;
    } catch (err) {
        console.error("Failed to get investor count", err);
        return 0;
    }
}

export interface PlatformStats {
    totalFounders: number;
    totalRaised: string;
    activeProSeats: number;
    telemetryUptime: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    img: string;
    quote: string;
}

export interface UserTask {
    id: string;
    title: string;
    subtitle: string;
    completed: boolean;
    priority: "High" | "Routine" | "Low";
    dueDate?: any;
}

export interface UserActivity {
    id: string;
    icon: string;
    text: string;
    time: string;
    tag?: string;
    type: "view" | "download" | "comment" | "system";
}

export interface IntelItem {
    id: string;
    title: string;
    category: string;
    description: string;
    content?: string;
    author?: string;
    authorRole?: string;
    img?: string;
    icon?: string;
    color?: string;
    date?: string;
    readTime?: string;
    publishedAt?: any;
}

export async function getPlatformStats(): Promise<PlatformStats> {
    try {
        const ref = doc(db, "metadata", "platform_stats");
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return snap.data() as PlatformStats;
        }
        // Fallback for new projects
        return {
            totalFounders: 450,
            totalRaised: "$2.4B",
            activeProSeats: 1240,
            telemetryUptime: "99.9%"
        };
    } catch (err) {
        console.error("Failed to get platform stats", err);
        return { totalFounders: 450, totalRaised: "$2.4B", activeProSeats: 1240, telemetryUptime: "99.9%" };
    }
}

export async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const q = query(collection(db, "testimonials"), limit(3));
        const snap = await getDocs(q);
        if (snap.empty) return [];
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    } catch (err) {
        console.error("Failed to get testimonials", err);
        return [];
    }
}

export async function getUserTasks(userId: string): Promise<UserTask[]> {
    try {
        const q = query(collection(db, `users/${userId}/tasks`), limit(10));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserTask));
    } catch (err) {
        console.error("Failed to get user tasks", err);
        return [];
    }
}

export async function getUserActivity(userId: string): Promise<UserActivity[]> {
    try {
        const q = query(collection(db, `users/${userId}/activity`), limit(5));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserActivity));
    } catch (err) {
        console.error("Failed to get user activity", err);
        return [];
    }
}

export async function getIntelItems(count: number = 4): Promise<IntelItem[]> {
    try {
        const q = query(collection(db, "intel"), limit(count));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as IntelItem));
    } catch (err) {
        console.error("Failed to get recent intel", err);
        return [];
    }
}

export async function getIntelById(id: string): Promise<IntelItem | null> {
    try {
        const ref = doc(db, "intel", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return { id: snap.id, ...snap.data() } as IntelItem;
        }
        return null;
    } catch (err) {
        console.error("Failed to get intel by id", err);
        return null;
    }
}
export async function getUserProfile(userId: string): Promise<any> {
    try {
        const ref = doc(db, "users", userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    } catch (err) {
        console.error("Failed to get user profile", err);
        return null;
    }
}

export async function updateUserProfile(userId: string, data: any): Promise<void> {
    try {
        const ref = doc(db, "users", userId);
        await setDoc(ref, data, { merge: true });
    } catch (err) {
        console.error("Failed to update user profile", err);
        throw err;
    }
}
