import https from 'https';

const PROJECT_ID = "warrenintel-c53a2";
const API_KEY = "AIzaSyDl9YzeGcW5z502qIWNaz9urCRM5FIa2aU";

async function getCount() {
    let count = 0;
    let nextPageToken = null;

    do {
        const path = `/v1/projects/${PROJECT_ID}/databases/(default)/documents/investors?key=${API_KEY}&mask.fieldPaths=name&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

        await new Promise((resolve) => {
            https.get({
                hostname: 'firestore.googleapis.com',
                path: path
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    const result = JSON.parse(data);
                    if (result.documents) {
                        count += result.documents.length;
                    }
                    nextPageToken = result.nextPageToken;
                    console.log(`Current count: ${count}...`);
                    resolve();
                });
            }).on('error', (e) => {
                console.error(e);
                resolve();
            });
        });
    } while (nextPageToken);

    console.log(`Total records in Firestore: ${count}`);
}

getCount();
