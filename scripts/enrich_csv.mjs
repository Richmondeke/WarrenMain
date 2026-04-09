import fs from 'fs';
import Papa from 'papaparse';

const CSV_PATH = '/Users/mac/Downloads/warren_intelligence_results_2025-11-24.csv';
const OUTPUT_PATH = '/Users/mac/Downloads/warren_intelligence_results_enriched.csv';

function extractDomain(email) {
    if (!email || !email.includes('@')) return null;
    const domain = email.split('@')[1].toLowerCase();

    const genericDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'icloud.com', 'me.com', 'msn.com', 'aol.com', 'zoho.com',
        'protonmail.com', 'mail.com'
    ];
    if (genericDomains.includes(domain)) return null;

    return `https://${domain}`;
}

function main() {
    console.log(`Reading ${CSV_PATH}...`);
    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');

    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    console.log(`Found ${parsed.data.length} records.`);

    let enrichedCount = 0;
    let alreadyHadCount = 0;
    let couldNotEnrichCount = 0;

    const enrichedData = parsed.data.map(row => {
        const website = row.Website || "";
        const email = row.Email || "";

        const hasWebsite = website.trim() !== "" && !website.includes("example.com");

        if (hasWebsite) {
            alreadyHadCount++;
            return row;
        }

        const derivedWebsite = extractDomain(email);
        if (derivedWebsite) {
            enrichedCount++;
            return {
                ...row,
                Website: derivedWebsite
            };
        }

        couldNotEnrichCount++;
        return row;
    });

    console.log(`\nEnrichment Summary:`);
    console.log(`- Already had website: ${alreadyHadCount}`);
    console.log(`- Enriched from email: ${enrichedCount}`);
    console.log(`- Could not enrich:    ${couldNotEnrichCount}`);

    console.log(`\nWriting to ${OUTPUT_PATH}...`);
    const newCsv = Papa.unparse(enrichedData);
    fs.writeFileSync(OUTPUT_PATH, newCsv);
    console.log("Done.");
}

main();
