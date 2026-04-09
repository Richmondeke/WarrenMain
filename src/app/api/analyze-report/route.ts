import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/cache";

export const dynamic = 'force-dynamic';

// Ensure this environment variable is set
const apiKey = process.env.GEMINI_API_KEY || "dummy_key_for_build";
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
    // ... schema definition remains the same
    type: Type.OBJECT,
    properties: {
        profile_updates: {
            type: Type.OBJECT,
            properties: {
                ceo: { type: Type.STRING, description: "Name of the CEO (Chief Executive Officer) if mentioned." },
                market_cap: { type: Type.STRING, description: "Market Capitalization or Aggregate Market Value if stated in the report, e.g. '$2.5 Trillion'" },
            },
            description: "Extracted basic company profile fields if found."
        },
        swot: {
            type: Type.OBJECT,
            properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 bullet points" },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 bullet points" },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 bullet points" },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 bullet points" },
            },
        },
        financials: {
            type: Type.OBJECT,
            properties: {
                revenue: { type: Type.STRING, description: "e.g. $5.8B (+18.3%)" },
                netProfit: { type: Type.STRING, description: "e.g. $890M" },
                eps: { type: Type.STRING, description: "e.g. $3.42" },
                debtToEquity: { type: Type.STRING, description: "e.g. 1.2x" },
                dividends: { type: Type.STRING, description: "e.g. 2.4%" },
                cashAndEquivalents: { type: Type.STRING, description: "e.g. $1.2B" },
            },
            description: "Key financial metrics",
        },
        sentiment_score: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER, description: "Score out of 10, e.g. 7.4" },
                label: { type: Type.STRING, description: "Moderate Buy, Hold, Caution, or High Risk" },
                rationale: { type: Type.STRING, description: "Brief 2-sentence AI-generated rationale" },
            },
        },
        risk_flags: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    level: { type: Type.STRING, description: "high, medium, or low" },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
            },
            description: "Key risk flags categorized by severity",
        },
        agm_summary: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Resolution or item voted on" },
                    status: { type: Type.STRING, description: "passed, passed_warning, or failed" },
                    votes: { type: Type.STRING, description: "Percentage of FOR votes" },
                    note: { type: Type.STRING, description: "Optional brief note (e.g. First strike received)" },
                },
            },
            description: "AGM items if available in the text",
        },
    },
};

const systemInstruction = `You are a financial analyst assistant. 
Given an annual report document text or snippet, extract and return a structured analysis in JSON format including: 
The name of the CEO and the Market Capitalization if available, SWOT analysis (3-5 bullet points per quadrant), key financial metrics, an investment sentiment score out of 10 with label and rationale, 
a list of risk flags categorized by severity, and an AGM summary. Be concise, objective, and investor-focused.`;

export async function POST(req: Request) {
    let tempFilePath: string | null = null;
    let uploadResult: any = null;

    try {
        const body = await req.json();
        const { ticker, filingUrl } = body;

        if (!ticker || !filingUrl) {
            return NextResponse.json({ error: "Missing ticker or filingUrl" }, { status: 400 });
        }

        const cacheKey = `analyze-${ticker}`;
        const cachedData = await getCached(cacheKey, 30 * 24 * 60 * 60); // 30 days cache
        if (cachedData) {
            console.log(`Returning cached analysis for ${ticker}`);
            return NextResponse.json({ data: cachedData });
        }

        console.log(`Downloading SEC filing for ${ticker} from ${filingUrl}...`);

        // Fetch the HTML from the URL
        const fileResponse = await fetch(filingUrl, {
            headers: { "User-Agent": "Warrenintel contact@warrenintel.com" }
        });

        if (!fileResponse.ok) {
            throw new Error(`Failed to download filing: ${fileResponse.statusText}`);
        }
        const rawHtml = await fileResponse.text();

        // Strip HTML tags using regex to get raw text
        let cleanText = rawHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s\s+/g, ' ').trim();

        if (!cleanText || cleanText.length < 100) {
            throw new Error(`The SEC filing content appears to be empty or too short (length: ${cleanText.length}). URL: ${filingUrl}`);
        }

        // Truncate to a reasonable limit for both engines to avoid 429 Payload Too Large
        if (cleanText.length > 300000) {
            console.log(`Truncating massive SEC filing from ${cleanText.length} down to 300,000 chars...`);
            cleanText = cleanText.substring(0, 300000);
        }

        let result: string | undefined = undefined;

        try {
            console.log("Generating analysis with Gemini text stream (Pro)...");
            const response = await ai.models.generateContent({
                model: "gemini-pro-latest",
                contents: [
                    { role: "user", parts: [{ text: "Analyze this annual report:\n\n" + cleanText }] }
                ],
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: analysisSchema,
                    temperature: 0.2,
                }
            });
            result = response.text;
        } catch (geminiProError) {
            console.warn("Gemini Pro failed, trying Gemini Flash...", geminiProError);
            try {
                const flashResponse = await ai.models.generateContent({
                    model: "gemini-flash-latest",
                    contents: [
                        { role: "user", parts: [{ text: "Analyze this annual report:\n\n" + cleanText }] }
                    ],
                    config: {
                        systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: analysisSchema,
                        temperature: 0.2,
                    }
                });
                result = flashResponse.text;
            } catch (geminiFlashError) {
                console.error("Gemini Flash also failed, falling back to OpenRouter:", geminiFlashError);

                const openRouterApiKey = process.env.OPENROUTER_API_KEY;
                if (!openRouterApiKey) {
                    throw new Error("Gemini failed and OPENROUTER_API_KEY is not set for fallback.");
                }

                console.log("Generating analysis with Grok fallback via OpenRouter...");

                // Truncate to ~100k characters to fit within Grok limitations
                let grokText = cleanText;
                if (grokText.length > 100000) {
                    console.log("Truncating text further for Grok 128k context limits...");
                    grokText = grokText.substring(0, 100000);
                }

                const jsonSchemaInstruction = `
            Respond strictly with a JSON object matching this schema:
            {
                "profile_updates": {
                    "ceo": "string",
                    "market_cap": "string"
                },
                "swot": {
                    "strengths": ["string"],
                    "weaknesses": ["string"],
                    "opportunities": ["string"],
                    "threats": ["string"]
                },
                "financials": {
                    "revenue": "string",
                    "netProfit": "string",
                    "eps": "string",
                    "debtToEquity": "string",
                    "dividends": "string",
                    "cashAndEquivalents": "string"
                },
                "sentiment_score": {
                    "score": number,
                    "label": "string",
                    "rationale": "string"
                },
                "risk_flags": [
                    { "level": "string", "title": "string", "description": "string" }
                ],
                "agm_summary": [
                    { "title": "string", "status": "string", "votes": "string", "note": "string" }
                ]
            }
            `;

                let grokData;
                const fallbackModels = [
                    "x-ai/grok-3",
                    "meta-llama/llama-3.3-70b-instruct:free",
                    "google/gemma-3-27b-it:free",
                    "mistralai/mistral-small-3.1-24b-instruct:free"
                ];

                let lastError = "";
                for (const modelId of fallbackModels) {
                    try {
                        console.log(`Attempting fallback with model: ${modelId}...`);
                        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${openRouterApiKey}`,
                                "HTTP-Referer": "http://localhost:3000",
                                "X-Title": "Warrenintel"
                            },
                            body: JSON.stringify({
                                model: modelId,
                                messages: [
                                    { role: "system", content: systemInstruction + "\n\n" + jsonSchemaInstruction },
                                    { role: "user", content: "Analyze this annual report text:\n\n" + grokText }
                                ],
                                response_format: { type: "json_object" },
                                temperature: 0.2
                            })
                        });

                        if (!response.ok) {
                            const err = await response.text();
                            console.warn(`Fallback model ${modelId} failed: ${err}`);
                            lastError = err;
                            continue; // Try next model
                        }

                        grokData = await response.json();
                        if (grokData?.choices?.[0]?.message?.content) {
                            console.log(`Successfully generated analysis with ${modelId}.`);
                            break;
                        }
                    } catch (e) {
                        console.error(`Error with fallback model ${modelId}:`, e);
                        lastError = String(e);
                    }
                }

                if (!grokData) {
                    throw new Error(`All LLM fallbacks failed. Last error: ${lastError}`);
                }

                result = grokData.choices[0].message.content;
            }
        }

        if (!result) {
            throw new Error("No analysis result generated from either Gemini or Grok.");
        }

        // We expect the result to be a JSON string that matches our schema
        const parsedData = JSON.parse(result || "{}");

        // Cache the successful result asynchronously
        setCached(cacheKey, parsedData).catch(err => console.error("Failed to set cache:", err));

        return NextResponse.json({ data: parsedData });
    } catch (error) {
        console.error("Error analyzing report:", error);

        return NextResponse.json({ error: "Failed to analyze annual report", details: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }, { status: 500 });
    }
}
