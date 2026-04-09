import fs from 'fs';
import path from 'url';

const __dirname = path.fileURLToPath(new URL('.', import.meta.url));
const JSON_PATH = '/Users/mac/.gemini/antigravity/scratch/warrenintel/src/data/firms_dump.json';
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const PROJECT_ID = "warrenintel-c53a2";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/investors?key=${API_KEY}`;

async function fetchWithRetry(url, options, maxRetries = 3) {
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
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const wait = Math.pow(2, i) * 1000;
            console.warn(`Attempt ${i + 1} failed. Retrying in ${wait}ms... ${error.message}`);
            await new Promise(r => setTimeout(r, wait));
        }
    }
}

async function runQuery(name) {
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`;
    const query = {
        structuredQuery: {
            from: [{ collectionId: 'investors' }],
            where: {
                fieldFilter: {
                    field: { fieldPath: 'name' },
                    op: 'EQUAL',
                    value: { stringValue: name }
                }
            },
            limit: 1
        }
    };

    const response = await fetchWithRetry(queryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    });

    const results = await response.json();
    return results[0]?.document || null;
}

async function updateInvestor(documentName, data) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${documentName}?updateMask.fieldPaths=type&updateMask.fieldPaths=location&updateMask.fieldPaths=website&updateMask.fieldPaths=linkedIn&updateMask.fieldPaths=thesis&updateMask.fieldPaths=stage&updateMask.fieldPaths=focus&updateMask.fieldPaths=updatedAt&key=${API_KEY}`;

    await fetchWithRetry(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fields: {
                ...data,
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        })
    });
}

async function createInvestor(data) {
    await fetchWithRetry(FIRESTORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fields: {
                ...data,
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        })
    });
}

async function main() {
    const rawData = fs.readFileSync(JSON_PATH, 'utf8');
    const firms = JSON.parse(rawData);

    console.log(`Starting import of ${firms.length} firms...`);

    let updated = 0;
    let created = 0;

    for (const firm of firms) {
        try {
            const name = firm.firm_name;
            const location = [firm.firm_city, firm.firm_state, firm.firm_country].filter(Boolean).join(', ');
            const focus = (firm.firm_focus || []).join('; ');

            const fields = {
                name: { stringValue: name },
                type: { stringValue: firm.firm_type_id || "VC" },
                location: { stringValue: location },
                website: { stringValue: firm.firm_website || "" },
                linkedIn: { stringValue: firm.firm_linkedin_url || "" },
                thesis: { stringValue: firm.firm_description || "" },
                stage: {
                    arrayValue: {
                        values: (firm.firm_stages || []).map(s => ({ stringValue: s }))
                    }
                },
                focus: { stringValue: focus }
            };

            const existingDoc = await runQuery(name);

            if (existingDoc) {
                const docId = existingDoc.name.split('/').pop();
                await updateInvestor(`investors/${docId}`, fields);
                console.log(`Updated: ${name}`);
                updated++;
            } else {
                await createInvestor(fields);
                console.log(`Created: ${name}`);
                created++;
            }
        } catch (error) {
            console.error(`Error processing ${firm.firm_name}:`, error.message);
        }
    }

    console.log(`\nImport complete!`);
    console.log(`Updated: ${updated}`);
    console.log(`Created: ${created}`);
}

main().catch(console.error);

