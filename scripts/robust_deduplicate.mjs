import fs from 'fs';

const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const PROJECT_ID = "warrenintel-c53a2";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Normalizes an investor name for better matching.
 */
function normalizeName(name) {
    if (!name) return "";
    return name.toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s+(inc|ltd|llc|vc|partners|capital|ventures|group|africa|ghana|nigeria|global|international)$/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

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
    console.log("Fetching all investor names...");
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

async function batchCommit(writes) {
    if (writes.length === 0) return;
    const url = `${BASE_URL}:commit?key=${API_KEY}`;
    await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes })
    });
}

/**
 * Merges two Firestore document field maps.
 */
function mergeFields(master, other) {
    const merged = { ...master };
    let changes = 0;

    for (const [key, value] of Object.entries(other)) {
        if (!merged[key] || (merged[key].stringValue === "" && value.stringValue !== "")) {
            merged[key] = value;
            changes++;
        } else if (value.arrayValue && merged[key].arrayValue) {
            // Merge arrays uniquely
            const masterValues = new Set(merged[key].arrayValue.values?.map(v => v.stringValue) || []);
            const otherValues = other[key].arrayValue.values?.map(v => v.stringValue) || [];
            let arrayChanges = 0;
            for (const v of otherValues) {
                if (!masterValues.has(v)) {
                    merged[key].arrayValue.values = merged[key].arrayValue.values || [];
                    merged[key].arrayValue.values.push({ stringValue: v });
                    masterValues.add(v);
                    arrayChanges++;
                }
            }
            if (arrayChanges > 0) changes++;
        }
    }
    return { merged, changes };
}

async function main() {
    const args = process.argv.slice(2);
    const limitGroups = parseInt(args[0]) || 50;

    try {
        const investors = await getAllInvestors();
        console.log(`Total documents found: ${investors.length}`);

        const groups = {};
        investors.forEach(inv => {
            const rawName = (inv.fields.name?.stringValue || "").trim();
            if (!rawName) return;
            const norm = normalizeName(rawName);
            if (!groups[norm]) groups[norm] = [];
            groups[norm].push(inv);
        });

        const duplicatesGroups = Object.entries(groups)
            .filter(([norm, list]) => list.length > 1)
            .slice(0, limitGroups);

        console.log(`Found ${Object.keys(groups).length} unique normalized names.`);
        console.log(`Processing ${duplicatesGroups.length} groups of duplicates...`);

        const writes = [];

        for (const [norm, list] of duplicatesGroups) {
            console.log(`\n--- Merging: "${norm}" (${list.length} records) ---`);

            // Fetch full docs
            const fullDocs = [];
            for (const summary of list) {
                const url = `https://firestore.googleapis.com/v1/${summary.name}?key=${API_KEY}`;
                const response = await fetchWithRetry(url);
                fullDocs.push(await response.json());
            }

            // Sort by field count to pick the best master
            fullDocs.sort((a, b) => Object.keys(b.fields || {}).length - Object.keys(a.fields || {}).length);

            let master = fullDocs[0];
            const others = fullDocs.slice(1);

            console.log(`Master: ${master.name} (${Object.keys(master.fields || {}).length} fields)`);

            for (const other of others) {
                const { merged, changes } = mergeFields(master.fields, other.fields);
                master.fields = merged;
                console.log(`Merging ${other.name} into master. Fields added: ${changes}`);

                // Add delete operation for the loser
                writes.push({ delete: other.name });
            }

            // Update the master with merged fields
            writes.push({
                update: {
                    name: master.name,
                    fields: master.fields
                }
            });

            // Commit in chunks of 100 operations
            if (writes.length >= 100) {
                console.log(`Committing batch of ${writes.length} operations...`);
                await batchCommit(writes.splice(0, 100));
            }
        }

        // Final commit
        if (writes.length > 0) {
            console.log(`Committing final batch of ${writes.length} operations...`);
            await batchCommit(writes);
        }

        console.log("\nDeduplication and Merging complete!");

    } catch (error) {
        console.error("Deduplication failed:", error);
    }
}

main();
