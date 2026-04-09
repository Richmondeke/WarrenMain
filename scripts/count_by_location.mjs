import fs from 'fs';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function getAllLocations() {
    console.log("Fetching all location values...");
    const url = `${BASE_URL}:runQuery?key=${API_KEY}`;
    const query = {
        structuredQuery: {
            from: [{ collectionId: 'investors' }],
            select: {
                fields: [
                    { fieldPath: 'location' }
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
        const investors = await getAllLocations();
        const counts = {};

        investors.forEach(inv => {
            if (!inv.fields) return;
            const loc = inv.fields.location?.stringValue || "Unknown";
            counts[loc] = (counts[loc] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        console.log("\nTop Locations:");
        sorted.slice(0, 30).forEach(([loc, count]) => {
            console.log(`${loc}: ${count}`);
        });

        console.log(`\nTotal Documents: ${investors.length}`);

        // Save to a file for later use
        fs.writeFileSync('scripts/location_audit.json', JSON.stringify(sorted, null, 2));
        console.log("Saved location audit to scripts/location_audit.json");
    } catch (err) {
        console.error(err);
    }
}

main();
