import { NextResponse } from "next/server";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Investor } from "@/lib/investor-data";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        let data: any[] = [];

        if (file.name.endsWith(".csv")) {
            let text = new TextDecoder().decode(buffer);
            // Sanitize: Quote unquoted dollar amounts containing commas (e.g., $5,000,000 -> "$5,000,000")
            text = text.replace(/(?<=^|,)(\$\d[\d,.]*)(?=,|$)/g, (match) => {
                if (match.includes(',')) return `"${match}"`;
                return match;
            });
            const results = Papa.parse(text, { header: true, skipEmptyLines: true });
            data = results.data;
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            data = XLSX.utils.sheet_to_json(worksheet);
        } else {
            return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
        }

        // Map the raw data to Investor objects with robust field matching
        const investors: Investor[] = data.map((row: any) => {
            // Helper to find a value by multiple possible keys (case-insensitive)
            const getVal = (keys: string[]) => {
                const rowKeys = Object.keys(row);
                for (const key of keys) {
                    const foundKey = rowKeys.find(k => k.toLowerCase() === key.toLowerCase());
                    if (foundKey && row[foundKey]) return row[foundKey];
                }
                return "";
            };

            const name = getVal(["Name", "Investor", "Company", "d-flex"]) || "Unknown Investor";
            const type = (getVal(["Type", "text-dark"]) || "VC") as any;
            const location = getVal(["Location", "badge", "Geography", "Country"]) || "Unknown";
            const checks = getVal(["Checks", "tablescraper-selected-row", "Check Size", "Range"]) || "$100k - $1M";
            const thesis = getVal(["Thesis", "criteriaCell 2", "Description", "About", "Investment Thesis"]) || "No thesis provided.";
            const website = getVal(["Website", "URL", "text-nowrap href", "Link"]) || "";
            const contactEmail = getVal(["Email", "Contact", "Contact Email", "Email Address"]) || "";
            const linkedin = getVal(["LinkedIn", "LinkedIn URL", "Social", "LinkedIn 2"]) || "";

            const rawStage = getVal(["Stage", "badge 3", "Investment Stage"]);
            const stage = rawStage ? rawStage.split(",").map((s: string) => s.trim()) : ["Seed"];

            const rawFlags = getVal(["Flags", "badge src"]);
            const flags = rawFlags ? rawFlags.split(",").map((f: string) => f.trim()) : ["🌍"];

            return {
                id: uuidv4(),
                name,
                type,
                stage,
                location,
                checks,
                thesis,
                flags,
                description: thesis,
                website,
                contactEmail,
                linkedIn: linkedin,
                updatedAt: new Date().toISOString(),
            };
        });

        return NextResponse.json({ data: investors });
    } catch (error) {
        console.error("Error ingesting investors:", error);
        return NextResponse.json({ error: "Failed to process the spreadsheet", details: String(error) }, { status: 500 });
    }
}
