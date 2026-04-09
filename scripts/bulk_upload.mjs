import fs from 'fs';
import https from 'https';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";

const TEST_MODE = false; // Set to false for full upload
const TEST_LIMIT = 50;

async function upload() {
    const jsonPath = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren_enriched.json';
    const investors = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`Loaded ${investors.length} records from JSON.`);

    const uploadData = TEST_MODE ? investors.slice(0, TEST_LIMIT) : investors;
    console.log(`Starting upload of ${uploadData.length} records...`);

    const CHUNK_SIZE = 200; // Firestore commit batch limit is 500
    for (let i = 0; i < uploadData.length; i += CHUNK_SIZE) {
        const chunk = uploadData.slice(i, i + CHUNK_SIZE);

        const batch = {
            writes: chunk.map(inv => ({
                update: {
                    name: `projects/${PROJECT_ID}/databases/(default)/documents/investors/${inv.id}`,
                    fields: {
                        name: { stringValue: inv.name || "" },
                        type: { stringValue: inv.type || "" },
                        location: { stringValue: inv.location || "" },
                        checks: { stringValue: inv.checks || "" },
                        thesis: { stringValue: inv.thesis || "" },
                        description: { stringValue: inv.description || "" },
                        website: { stringValue: inv.website || "" },
                        logo: { stringValue: inv.logo || "" },
                        wikipedia: { stringValue: inv.wikipedia || "" },
                        enriched: { booleanValue: !!inv.enriched },
                        deep_enriched: { booleanValue: !!inv.deep_enriched },
                        stage: { arrayValue: { values: (inv.stage || []).map(s => ({ stringValue: s })) } },
                        flags: { arrayValue: { values: (inv.flags || []).map(f => ({ stringValue: f })) } },
                        updatedAt: { timestampValue: new Date().toISOString() }
                    }
                }
            }))
        };

        const postData = JSON.stringify(batch);

        await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'firestore.googleapis.com',
                path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents:commit?key=${API_KEY}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        console.log(`Uploaded batch ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(uploadData.length / CHUNK_SIZE)}`);
                        resolve();
                    } else {
                        console.error(`Status ${res.statusCode}: ${data}`);
                        resolve();
                    }
                });
            });

            req.on('error', (e) => {
                console.error(e);
                resolve();
            });

            req.write(postData);
            req.end();
        });
    }
    console.log("Upload completed.");
}

upload();

