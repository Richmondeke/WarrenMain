import fs from 'fs';
import https from 'https';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";
const COLLECTION = "investors";

async function firestoreRequest(path, method, body = null, retries = 5) {
    const postData = body ? JSON.stringify(body) : null;
    let lastError;

    for (let i = 0; i < retries; i++) {
        try {
            const res = await new Promise((resolve, reject) => {
                const options = {
                    hostname: 'firestore.googleapis.com',
                    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents${path}${path.includes('?') ? '&' : '?'}key=${API_KEY}`,
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 20000
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

            if (res.status === 429) {
                const wait = Math.pow(2, i) * 2000;
                console.warn(`Rate limited (429). Waiting ${wait}ms before retry ${i + 1}...`);
                await new Promise(r => setTimeout(r, wait));
                continue;
            }

            return res;
        } catch (e) {
            lastError = e;
            const wait = Math.pow(2, i) * 1000;
            console.warn(`Attempt ${i + 1} failed: ${e.message}. Retrying in ${wait}ms...`);
            await new Promise(r => setTimeout(r, wait));
        }
    }
    throw lastError;
}

async function getAllInvestors() {
    let allDocs = [];
    let pageToken = null;
    const pageSize = 50; // Smaller batches

    do {
        console.log(`Fetching page (current total: ${allDocs.length})...`);
        const path = `/${COLLECTION}?pageSize=${pageSize}${pageToken ? `&pageToken=${pageToken}` : ''}`;
        const res = await firestoreRequest(path, 'GET');

        if (res.status === 200 && res.data.documents) {
            allDocs = allDocs.concat(res.data.documents);
            pageToken = res.data.nextPageToken;
            // Add a small delay between page fetches to avoid tight loop hitting burst limits
            await new Promise(r => setTimeout(r, 500));
        } else {
            if (res.status !== 200) {
                console.error("Failed to fetch documents:", res.status, JSON.stringify(res.data));
            }
            break;
        }
    } while (pageToken);

    return allDocs;
}

function extractDomain(email) {
    if (!email || !email.includes('@')) return null;
    const domain = email.split('@')[1].toLowerCase();

    // Ignore generic domains
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'me.com', 'msn.com'];
    if (genericDomains.includes(domain)) return null;

    return `https://${domain}`;
}

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
    if (DRY_RUN) {
        console.log("--- DRY RUN MODE: No changes will be saved to Firestore ---\n");
    }

    console.log("Fetching all investors from Firestore...");
    const investors = await getAllInvestors();
    console.log(`Found ${investors.length} investors.`);

    let updateCount = 0;
    let skipCount = 0;
    let totalEligible = 0;

    for (const doc of investors) {
        const fields = doc.fields;
        const id = doc.name.split('/').pop();
        const name = fields.name?.stringValue || "Unknown";
        const currentWebsite = fields.website?.stringValue;
        const contactEmail = fields.contactEmail?.stringValue;

        // Also check for "example.com" placeholders
        if (!currentWebsite || currentWebsite.trim() === "" || currentWebsite.includes("example.com")) {
            const derivedWebsite = extractDomain(contactEmail);

            if (derivedWebsite) {
                totalEligible++;
                if (DRY_RUN) {
                    console.log(`[DRY RUN] Would enrich ${name}: ${derivedWebsite}`);
                } else {
                    console.log(`Enriching ${name}: ${derivedWebsite}`);

                    // Update only the website field
                    const updatePath = `/${COLLECTION}/${id}?updateMask.fieldPaths=website&updateMask.fieldPaths=updatedAt`;
                    const updateBody = {
                        fields: {
                            website: { stringValue: derivedWebsite },
                            updatedAt: { timestampValue: new Date().toISOString() }
                        }
                    };

                    const res = await firestoreRequest(updatePath, 'PATCH', updateBody);
                    if (res.status === 200) {
                        updateCount++;
                    } else {
                        console.error(`Failed to update ${name}: ${res.status}`);
                    }
                }
            } else {
                skipCount++;
            }
        }
    }

    if (DRY_RUN) {
        console.log(`\n--- DRY RUN SUMMARY ---`);
        console.log(`Total investors checked: ${investors.length}`);
        console.log(`Would have updated: ${totalEligible}`);
        console.log(`Skipped (no email or generic domain): ${skipCount}`);
    } else {
        console.log(`\nEnrichment finished.`);
        console.log(`Updated: ${updateCount}`);
        console.log(`Skipped (no email or generic domain): ${skipCount}`);
    }
}

main().catch(console.error);
