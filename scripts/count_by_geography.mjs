import fs from 'fs';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getAllGeography() {
    console.log("Fetching all geography values...");
    const url = `${BASE_URL}:runQuery?key=${API_KEY}`;
    const query = {
        structuredQuery: {
            from: [{ collectionId: 'investors' }],
            select: {
                fields: [
                    { fieldPath: 'geography' }
                ]
            }
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    });

    const results = await response.json();
    return results.map(r => r.document).filter(Boolean);
}

async function main() {
    try {
        const investors = await getAllGeography();
        const counts = {};

        investors.forEach(inv => {
            if (!inv.fields) return;
            const geo = inv.fields.geography?.stringValue || "Unknown";
            counts[geo] = (counts[geo] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        console.log("\nTop Geographies:");
        sorted.slice(0, 20).forEach(([geo, count]) => {
            console.log(`${geo}: ${count}`);
        });

        console.log(`\nTotal Documents: ${investors.length}`);
    } catch (err) {
        console.error(err);
    }
}

main();
