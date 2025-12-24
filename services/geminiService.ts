
import { GoogleGenAI } from "@google/genai";
import { IPO } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Helper to sleep for a given duration
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retries a function with exponential backoff
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let delay = 2000;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.message?.includes('429') || error?.status === 429;
      if (isRateLimit && i < maxRetries - 1) {
        console.warn(`Gemini API rate limited. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(delay);
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  return fn(); // Final attempt
}

export const fetchLiveIPOs = async (): Promise<IPO[]> => {
  // Safety check for API key
  if (!process.env.API_KEY) {
    console.warn("API Key missing, skipping live fetch.");
    return [];
  }

  return withRetry(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a Real-Time Financial Data Engine. Provide accurate Indian IPO data for Mainboard and SME markets.
        
        Instructions:
        1. Use Google Search Grounding (Chittorgarh, NSE, BSE, Zerodha).
        2. Verify GMP across sources.
        3. Subscription status must show consolidated 'X-times'.
        
        Return a JSON array of objects strictly following this schema:
        {
          "id": "string",
          "name": "string",
          "priceBand": "string",
          "lotSize": number,
          "gmp": number,
          "subscription": "string",
          "status": "Open" | "Upcoming" | "Closed",
          "type": "Mainboard" | "SME",
          "sector": "string"
        }
        
        IMPORTANT: Return ONLY the raw JSON array. No markdown, no text.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      if (!text) throw new Error("No data returned");

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const groundingSources = groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        return null;
      }).filter(Boolean) || [];

      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      
      if (startIndex === -1 || endIndex === -1) throw new Error("Invalid format");

      const jsonPart = text.substring(startIndex, endIndex + 1).replace(/\[\d+\]/g, "");
      const data = JSON.parse(jsonPart);
      
      if (Array.isArray(data)) {
        return data.map((ipo, index) => ({
          ...ipo,
          id: ipo.id || `live-${index}-${Date.now()}`,
          lotSize: Number(ipo.lotSize) || 0,
          gmp: Number(ipo.gmp) || 0,
          isLive: true,
          groundingSources: groundingSources.length > 0 ? groundingSources : undefined
        }));
      }
      return [];
    } catch (error: any) {
      if (error?.message?.includes('429')) throw error;
      console.error("Gemini Fetch Error:", error);
      return []; // Return empty array instead of crashing
    }
  });
};

export const getIPOInsight = async (ipo: IPO): Promise<string> => {
  if (!process.env.API_KEY) return "Analytics unavailable offline.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Brief analyst insight for: ${ipo.name}
      Sector: ${ipo.sector}
      Price: ${ipo.priceBand}
      GMP: ₹${ipo.gmp}
      Subscription: ${ipo.subscription}
      
      Provide 2 sentences on market sentiment and risk/reward. No financial advice.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Insight unavailable.";
  } catch (error) {
    return "Unable to fetch AI insights at this time.";
  }
};
