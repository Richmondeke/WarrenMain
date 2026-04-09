import fs from 'fs';

const csvPath = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren.csv';
const jsonPath = '/Users/mac/.gemini/antigravity/scratch/warrenintel/public/warren.json';

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());

const records = [];
for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let char of line) {
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
            parts.push(current.trim());
            current = '';
        } else current += char;
    }
    parts.push(current.trim());

    const record = {};
    headers.forEach((h, idx) => {
        record[h] = parts[idx] ? parts[idx].replace(/^"|"$/g, '') : '';
    });

    // Transform to Investor schema
    const name = record["d-flex"] || "Unknown";
    let id = (record["VClink href"] || name).split('/').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '-') || Math.random().toString(36).substring(7);
    if (!id) id = Math.random().toString(36).substring(7);

    records.push({
        id,
        name,
        type: record["text-dark"] || "VC firm",
        location: record["badge"] || "Global",
        checks: record["tablescraper-selected-row"] || "Contact for details",
        thesis: record["criteriaCell 2"] || "",
        stage: record["badge 3"] ? [record["badge 3"]] : [],
        flags: ["🌍"]
    });
}

fs.writeFileSync(jsonPath, JSON.stringify(records));
console.log(`Saved ${records.length} records to ${jsonPath}`);
