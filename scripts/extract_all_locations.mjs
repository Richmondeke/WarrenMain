import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    projectId: "warrenintel-c53a2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function extractLocations() {
    console.log("Extracting all unique locations...");
    const snap = await getDocs(collection(db, "investors"));
    const locations = new Set();
    snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.location) {
            // Split by comma if multi-location
            data.location.split(',').forEach(loc => locations.add(loc.trim()));
        }
    });
    console.log(JSON.stringify(Array.from(locations).sort()));
}

extractLocations();
