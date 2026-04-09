import fs from 'fs';

const JSON_PATH = 'public/warren.json';
const OUTPUT_PATH = 'public/warren_enriched.json';

function extractDomain(email) {
    if (!email || !email.includes('@')) return null;
    const domain = email.split('@')[1].toLowerCase();

    // Ignore generic domains
    const genericDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'icloud.com', 'me.com', 'msn.com', 'aol.com', 'zoho.com',
        'protonmail.com', 'mail.com'
    ];
    if (genericDomains.includes(domain)) return null;

    return `https://${domain}`;
}

function main() {
    console.log(`Reading ${JSON_PATH}...`);
    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`Found ${data.length} records.`);

    let enrichedCount = 0;
    let alreadyHadCount = 0;
    let couldNotEnrichCount = 0;

    const enrichedData = data.map(investor => {
        const hasWebsite = investor.website &&
            investor.website.trim() !== "" &&
            !investor.website.includes("example.com");

        if (hasWebsite) {
            alreadyHadCount++;
            return investor;
        }

        const derivedWebsite = extractDomain(investor.contactEmail);
        if (derivedWebsite) {
            enrichedCount++;
            return {
                ...investor,
                website: derivedWebsite,
                enriched: true // Add a flag to track enriched records
            };
        }

        couldNotEnrichCount++;
        return investor;
    });

    console.log(`\nEnrichment Summary:`);
    console.log(`- Already had website: ${alreadyHadCount}`);
    console.log(`- Enriched from email: ${enrichedCount}`);
    console.log(`- Could not enrich:    ${couldNotEnrichCount}`);

    console.log(`\nWriting to ${OUTPUT_PATH}...`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enrichedData, null, 2));
    console.log("Done.");
}

main();
