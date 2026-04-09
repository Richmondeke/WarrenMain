import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getCountFromServer } from "firebase/firestore";

const firebaseConfig = {
    projectId: "warrenintel-c53a2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function repro() {
    console.log("Attempting combined query: location == 'USA' AND stage array-contains '2. Prototype'");
    try {
        const q = query(
            collection(db, "investors"),
            where("location", "==", "USA"),
            where("stage", "array-contains", "2. Prototype")
        );
        const snap = await getCountFromServer(q);
        console.log("Success! Count:", snap.data().count);
    } catch (err) {
        console.error("FAILED to count:", err.message);
    }

    console.log("\nAttempting combined query: name prefix AND location == 'USA'");
    try {
        const q = query(
            collection(db, "investors"),
            where("name", ">=", "A"),
            where("name", "<=", "A\uf8ff"),
            where("location", "==", "USA")
        );
        const snap = await getCountFromServer(q);
        console.log("Success! Count:", snap.data().count);
    } catch (err) {
        console.error("FAILED to count:", err.message);
    }
}

repro();
