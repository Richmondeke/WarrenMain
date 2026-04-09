import fs from 'fs';
import Papa from 'papaparse';

const CSV_PATH = '/Users/mac/Downloads/warren_intelligence_results_enriched.csv';
const JSON_PATH = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren.json';
const OUTPUT_PATH = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren.json'; // Overwrite local

function main() {
    console.log(`Reading enriched CSV from ${CSV_PATH}...`);
    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
    const parsed = Papa.parse(csvContent, { header: true });

    // Create a map of Name -> Website
    const websiteMap = new Map();
    parsed.data.forEach(row => {
        if (row.Name && row.Website) {
            websiteMap.set(row.Name.trim().toLowerCase(), row.Website);
        }
    });
    console.log(`Mapped ${websiteMap.size} websites from CSV.`);

    console.log(`Reading local JSON from ${JSON_PATH}...`);
    const jsonData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    console.log(`Found ${jsonData.length} records in JSON.`);

    let updateCount = 0;
    const updatedData = jsonData.map(record => {
        const nameKey = record.name ? record.name.trim().toLowerCase() : "";
        if (websiteMap.has(nameKey)) {
            const newWebsite = websiteMap.get(nameKey);
            if (record.website !== newWebsite) {
                updateCount++;
                return { ...record, website: newWebsite };
            }
        }
        return record;
    });

    console.log(`\nUpdated ${updateCount} records in local JSON.`);

    console.log(`Writing to ${OUTPUT_PATH}...`);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updatedData));
    console.log("Done.");
}

main();
