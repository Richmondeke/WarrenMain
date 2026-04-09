// Using global fetch (available in Node.js 18+)

const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const PROJECT_ID = "warrenintel-c53a2";
// Correct REST URL for listing documents in a collection
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/investors?key=${API_KEY}`;

async function cleanupInvestors() {
    console.log("Starting Firestore cleanup via REST API...");

    let nextPageToken = "";
    let deletedCount = 0;
    let checkedCount = 0;

    do {
        const url = `${FIRESTORE_URL}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}&pageSize=300`;
        console.log(`Fetching: ${url.replace(API_KEY, 'HIDDEN')}`);

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("Firestore Error:", JSON.stringify(data.error, null, 2));
            break;
        }

        if (!data.documents || data.documents.length === 0) {
            console.log("No more documents found.");
            break;
        }

        for (const doc of data.documents) {
            checkedCount++;
            const fields = doc.fields;
            if (!fields) continue;

            const name = fields.name?.stringValue || "";
            const type = fields.type?.stringValue || "";
            const thesis = fields.thesis?.stringValue || "";

            // Heuristics for corrupted CSV rows
            const isCorrupted =
                (name.includes(',') && (name.includes('http') || name.includes('www.'))) ||
                (name.length > 200) ||
                (name.startsWith('Occasionally')) ||
                (name.includes('pre-seed')) && name.includes('Seed II') ||
                (type.includes(',') && (type.includes('http') || type.includes('www.')));

            if (isCorrupted) {
                const docPath = doc.name; // This is the full path projects/.../investors/ID
                console.log(`Deleting corrupted [${checkedCount}]: ${name.substring(0, 50)}...`);

                const delRes = await fetch(`https://firestore.googleapis.com/v1/${docPath}?key=${API_KEY}`, {
                    method: 'DELETE'
                });

                if (delRes.ok) {
                    deletedCount++;
                } else {
                    console.error(`Failed to delete ${docPath}: ${delRes.status}`);
                }
            }
        }

        console.log(`Progress: Checked ${checkedCount}, Deleted ${deletedCount}`);
        nextPageToken = data.nextPageToken;

        // Safety break if it's looping too much or we hit a lot of records
        if (checkedCount > 20000) {
            console.warn("Reached 20k records, stopping for safety.");
            break;
        }

    } while (nextPageToken);

    console.log(`\nCleanup complete!`);
    console.log(`Total Checked: ${checkedCount}`);
    console.log(`Total Deleted: ${deletedCount}`);
}

cleanupInvestors().catch(console.error);
