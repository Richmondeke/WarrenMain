import fs from 'fs';
import https from 'https';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const COLLECTION = "investors";
const CSV_PATH = '/Users/mac/Downloads/warren_intelligence_results_2025-11-24.csv';

async function firestoreRequest(path, method, body = null, retries = 3) {
    const postData = body ? JSON.stringify(body) : null;
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            return await new Promise((resolve, reject) => {
                const options = {
                    hostname: 'firestore.googleapis.com',
                    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents${path}?key=${API_KEY}`,
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000 // 10s timeout
                };
                if (postData) {
                    options.headers['Content-Length'] = Buffer.byteLength(postData);
                }

                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        try {
                            const parsed = data ? JSON.parse(data) : {};
                            resolve({ status: res.statusCode, data: parsed });
                        } catch (e) {
                            resolve({ status: res.statusCode, data: { error: data } });
                        }
                    });
                });
                req.on('error', reject);
                req.on('timeout', () => {
                    req.destroy();
                    reject(new Error('ETIMEDOUT'));
                });
                if (postData) req.write(postData);
                req.end();
            });
        } catch (e) {
            lastError = e;
            console.warn(`Attempt ${i + 1} failed: ${e.message}. Retrying...`);
            await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Linear backoff
        }
    }
    throw lastError;
}

async function findInvestorByName(name) {
    const query = {
        structuredQuery: {
            from: [{ collectionId: COLLECTION }],
            where: {
                fieldFilter: {
                    field: { fieldPath: "name" },
                    op: "EQUAL",
                    value: { stringValue: name }
                }
            },
            limit: 1
        }
    };
    const res = await firestoreRequest(':runQuery', 'POST', query);
    if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0 && res.data[0].document) {
        const doc = res.data[0].document;
        const id = doc.name.split('/').pop();
        return { id, doc };
    }
    return null;
}

async function updateOrCreateInvestor(row) {
    const name = row.Name;
    if (!name) return;

    const existing = await findInvestorByName(name);
    const id = existing ? existing.id : uuidv4();

    // Convert CSV fields to Firestore format
    const fields = {
        name: { stringValue: name },
        type: { stringValue: row.Type || "INVESTOR" },
        location: { stringValue: row.Location || "Unknown" },
        checks: { stringValue: `${row["Min Check"] || ""} - ${row["Max Check"] || ""}`.trim() || "Contact for details" },
        thesis: { stringValue: row.Description || "" },
        stage: { arrayValue: { values: (row["Focus Areas"] || "").split(';').map(s => ({ stringValue: s.trim() })).filter(s => s.stringValue) } },
        website: { stringValue: row.Website || "" },
        contactEmail: { stringValue: row.Email || "" },
        rating: { doubleValue: parseFloat(row.Rating) || 0 },
        updatedAt: { timestampValue: new Date().toISOString() }
    };

    const docPath = `/${COLLECTION}/${id}`;
    const res = await firestoreRequest(docPath, 'PATCH', { fields });

    if (res.status === 200) {
        console.log(`${existing ? 'Updated' : 'Created'}: ${name}`);
    } else {
        console.error(`Failed to ${existing ? 'update' : 'create'} ${name}: ${res.status}`, JSON.stringify(res.data));
    }
}

async function main() {
    console.log("Starting investor update process...");
    let csvData = fs.readFileSync(CSV_PATH, 'utf-8');

    // Sanitize: Quote unquoted dollar amounts containing commas (e.g., $5,000,000 -> "$5,000,000")
    // This regex matches a field starting with $ and containing a comma, ensuring it's at the start of a line or preceded by a comma.
    csvData = csvData.replace(/(?<=^|,)(\$\d[\d,.]*)(?=,|$)/g, (match) => {
        if (match.includes(',')) return `"${match}"`;
        return match;
    });

    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });

    console.log(`Processing ${parsed.data.length} records...`);

    // Process in sequence to avoid rate limits and keep it simple
    for (const row of parsed.data) {
        await updateOrCreateInvestor(row);
    }

    console.log("Update process finished.");
}

main().catch(console.error);
