import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

const firebaseConfig = {
    projectId: "warrenintel-c53a2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function extractValues() {
    console.log("Extracting unique values from first 500 records...");
    const q = query(collection(db, "investors"), limit(500));
    const snap = await getDocs(q);

    const locations = new Set();
    const stages = new Set();
    const checks = new Set();

    snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.location) locations.add(data.location);
        if (data.stage && Array.isArray(data.stage)) {
            data.stage.forEach(s => stages.add(s));
        } else if (data.stage) {
            stages.add(data.stage);
        }
        if (data.checks) checks.add(data.checks);
    });

    console.log("\n--- Unique Locations (Top) ---");
    console.log(Array.from(locations).sort().slice(0, 50));

    console.log("\n--- Unique Stages ---");
    console.log(Array.from(stages).sort());

    console.log("\n--- Unique Checks ---");
    console.log(Array.from(checks).sort());
}

extractValues();
