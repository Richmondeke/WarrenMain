import fs from 'fs';

const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const PROJECT_ID = "warrenintel-c53a2";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function fetchWithRetry(url, options = {}, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            if (response.status === 429) {
                const wait = Math.pow(2, i) * 1000;
                console.warn(`Rate limited. Waiting ${wait}ms...`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const wait = Math.pow(2, i) * 1000;
            console.warn(`Attempt ${i + 1} failed. Retrying in ${wait}ms... ${error.message}`);
            await new Promise(r => setTimeout(r, wait));
        }
    }
    throw new Error("Failed to fetch after max retries");
}

async function getAllInvestors() {
    console.log("Fetching all investors...");
    const url = `${BASE_URL}:runQuery?key=${API_KEY}`;
    const query = {
        structuredQuery: {
            from: [{ collectionId: 'investors' }],
            select: {
                fields: [
                    { fieldPath: 'name' }
                ]
            }
        }
    };

    const response = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    });

    const results = await response.json();
    return results.map(r => r.document).filter(Boolean);
}

async function batchDelete(docPaths) {
    if (docPaths.length === 0) return;

    // Firestore batchWrite supports up to 500 operations
    const url = `${BASE_URL}:commit?key=${API_KEY}`;
    const writes = docPaths.map(path => ({
        delete: path
    }));

    await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes })
    });
}

async function main() {
    try {
        const investors = await getAllInvestors();
        console.log(`Total documents found: ${investors.length}`);

        const groups = {};
        investors.forEach(inv => {
            const name = (inv.fields.name?.stringValue || "").trim();
            if (!groups[name]) groups[name] = [];
            groups[name].push(inv);
        });

        const duplicates = Object.entries(groups).filter(([name, list]) => list.length > 1).slice(0, 20); // Process only 20 at a time
        console.log(`Found ${duplicates.length} names with duplicates to process in this batch.`);

        const allDocsToDelete = [];

        for (const [name, list] of duplicates) {
            console.log(`\nAnalyzing duplicates for: "${name}" (${list.length} copies)`);

            // Fetch full documents to compare fields
            const fullDocs = [];
            for (const summary of list) {
                const url = `https://firestore.googleapis.com/v1/${summary.name}?key=${API_KEY}`;
                const response = await fetchWithRetry(url);
                if (response) {
                    fullDocs.push(await response.json());
                } else {
                    console.error(`Failed to fetch full doc for ${summary.name}`);
                }
            }

            if (fullDocs.length < 2) continue;

            // Sort by field count (descending)
            fullDocs.sort((a, b) => Object.keys(b.fields || {}).length - Object.keys(a.fields || {}).length);

            const toKeep = fullDocs[0];
            const toDelete = fullDocs.slice(1);

            console.log(`Keeping: ${toKeep.name} (fields: ${Object.keys(toKeep.fields || {}).length})`);
            toDelete.forEach(doc => {
                console.log(`Marking for deletion: ${doc.name} (fields: ${Object.keys(doc.fields || {}).length})`);
                allDocsToDelete.push(doc.name);
            });
        }

        console.log(`\nStarting batch deletion of ${allDocsToDelete.length} documents...`);

        // Delete in chunks of 100 (well within 500 limit)
        for (let i = 0; i < allDocsToDelete.length; i += 100) {
            const chunk = allDocsToDelete.slice(i, i + 100);
            console.log(`Deleting chunk ${i / 100 + 1}...`);
            await batchDelete(chunk);
        }

        console.log(`\nDeduplication complete!`);
        console.log(`Total deleted: ${allDocsToDelete.length}`);

    } catch (error) {
        console.error("Deduplication failed:", error.message);
    }
}

main();
