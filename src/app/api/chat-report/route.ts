import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const apiKey = process.env.GEMINI_API_KEY || "dummy_key_for_build";
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, ticker, filingUrl, companyName } = body;

        if (!messages || !ticker || !filingUrl) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        console.log(`[Chat API] Downloading filing for ${ticker} to answer query...`);

        // Fetch the HTML from the SEC URL
        const fileResponse = await fetch(filingUrl, {
            headers: { "User-Agent": "Warrenintel contact@warrenintel.com" }
        });

        if (!fileResponse.ok) {
            throw new Error(`Failed to download filing: ${fileResponse.statusText}`);
        }
        const rawHtml = await fileResponse.text();

        // Strip HTML tags
        let cleanText = rawHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s\s+/g, ' ').trim();

        if (cleanText.length > 300000) {
            cleanText = cleanText.substring(0, 300000); // Prevent payload too large
        }

        // Extract the user's latest query
        const latestQuery = messages[messages.length - 1].content;

        // Format previous conversation context if any
        let conversationHistory = "";
        if (messages.length > 1) {
            const previousMessages = messages.slice(0, -1);
            conversationHistory = previousMessages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
        }

        const prompt = `You are an expert financial analyst assistant for Warrenintel, an intelligence platform for retail investors.
You are currently helping a user understand the latest SEC 10-K Annual Report for ${companyName || ticker}.

Below is the text extracted from the actual 10-K filing:
--- START OF SEC FILING TEXT ---
${cleanText.substring(0, 200000)} ... [Truncated for brevity]
--- END OF FILING TEXT ---

${conversationHistory ? `Previous conversation context:\n${conversationHistory}\n` : ''}

The investor asks: "${latestQuery}"

Act strictly as a financial analyst interpreting this specific document. 
- Answer the user's question clearly, concisely, and professionally.
- Base your answers ONLY on the provided filing text and general financial principles. 
- If the answer is not in the text, clearly state that the 10-K does not explicitly mention it.
- Use formatting (markdown, bullet points) where appropriate to make data easy to read.
`;

        // Since Vercel Edge Functions or streaming isn't fully set up with the new SDK here, 
        // we'll just return the full response directly for now.
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                temperature: 0.1, // Keep it factual
            }
        });

        if (!response.text) {
            throw new Error("No response generated");
        }

        return NextResponse.json({ reply: response.text });
    } catch (error: any) {
        console.error("[Chat API] Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate chat response" }, { status: 500 });
    }
}
