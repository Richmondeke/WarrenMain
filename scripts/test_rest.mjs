import https from 'https';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";

async function testUpload() {
    const batch = {
        writes: [
            {
                update: {
                    name: `projects/${PROJECT_ID}/databases/(default)/documents/investors/test-rest-api`,
                    fields: {
                        name: { stringValue: "REST API Test Investor" },
                        type: { stringValue: "Test" },
                        updatedAt: { timestampValue: new Date().toISOString() }
                    }
                }
            }
        ]
    };

    const postData = JSON.stringify(batch);

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
            console.log(`Status ${res.statusCode}: ${data}`);
        });
    });

    req.on('error', (e) => console.error(e));
    req.write(postData);
    req.end();
}

testUpload();
