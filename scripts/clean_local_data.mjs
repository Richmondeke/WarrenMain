import fs from 'fs';
import path from 'path';

const WARREN_JSON_PATH = path.resolve('public/warren.json');

function cleanLocalData() {
    console.log(`Reading ${WARREN_JSON_PATH}...`);
    const rawData = fs.readFileSync(WARREN_JSON_PATH, 'utf8');
    const investors = JSON.parse(rawData);

    let deletedCount = 0;
    const initialCount = investors.length;

    const cleanedInvestors = investors.filter(inv => {
        const name = inv.name || "";
        const type = inv.type || "";
        const thesis = inv.thesis || "";

        // Heuristics for corrupted CSV rows (same as in InvestorCard.tsx)
        const isCorrupted =
            (name.includes(',') && (name.includes('http') || name.includes('www.'))) ||
            (name.length > 200) ||
            (name.startsWith('Occasionally')) ||
            (name.includes('pre-seed') && name.includes('Seed II')) ||
            (type.includes(',') && (type.includes('http') || type.includes('www.')));

        if (isCorrupted) {
            console.log(`Removing corrupted: ${name.substring(0, 50)}...`);
            deletedCount++;
            return false;
        }
        return true;
    });

    if (deletedCount > 0) {
        console.log(`Writing cleaned data back to ${WARREN_JSON_PATH}...`);
        fs.writeFileSync(WARREN_JSON_PATH, JSON.stringify(cleanedInvestors, null, 2));
        console.log(`Cleaned! Removed ${deletedCount} records.`);
    } else {
        console.log("No corrupted records found in local JSON.");
    }

    console.log(`Final count: ${cleanedInvestors.length} (from ${initialCount})`);
}

cleanLocalData();
