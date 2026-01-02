
import { GoogleGenAI, Type } from "@google/genai";
import { FishingRecommendation, GroundingSource, UserLocation } from "../types";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async getFishingStrategy(
    location: string, 
    species: string, 
    userLoc?: UserLocation
  ): Promise<FishingRecommendation> {
    const prompt = `
      ACT AS: A elite professional tournament angler and local guide.
      TASK: Generate a TACTICAL SCOUTING REPORT for ${location}.
      TARGET: ${species || 'Local game fish'}.

      RULES:
      - NO conversational filler.
      - NO "Welcome", "Good luck", or "I hope this helps".
      - USE precise technical terms (e.g., "12lb Fluorocarbon", "Dropshot rig").
      - BE ultra-specific about spots found in the area.

      INSTRUCTIONS FOR TACKLE:
      - Based on current local reports, infer WATER CLARITY and DEPTH.
      - RECOMMEND specific lure colors (e.g., "Electric Chicken", "Watermelon Red Flake", "Chrome/Blue") based on clarity.
      - RECOMMEND specific sizes (e.g., "1/4 oz", "5-inch", "Size 2 Hook") based on depth and species behavior.

      STRUCTURE YOUR RESPONSE AS FOLLOWS:
      [SUMMARY] One short tactical overview sentence.
      [CONDITIONS] Brief info on Water Clarity and Target Depth (e.g., "Clarity: Stained, Depth: 10-15ft").
      [SPOTS] List 2-3 specific coordinate-based or landmark spots with a 1-sentence "why".
      [TIMING] Precise peak hours and specific weather/lunar triggers.
      [BITE_DATA] 12 comma-separated integers (0-10) representing bite intensity for the next 12 hours starting now.
      [TACKLE] Bulleted list of specific rod, line, and lure/bait combos including EXACT COLORS and SIZES.
      [PRO TIPS] 3-4 punchy technique-specific commands.

      Use Search and Maps to find real, active reports.
    `;

    try {
      // Maps grounding is only supported in Gemini 2.5 series models.
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 1000 },
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: {
            retrievalConfig: userLoc ? {
              latLng: {
                latitude: userLoc.lat,
                longitude: userLoc.lng
              }
            } : undefined
          }
        },
      });

      const text = response.text || "Report unavailable.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const sources: GroundingSource[] = groundingChunks.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
        return null;
      }).filter(Boolean);

      return {
        summary: text,
        spots: [],
        timing: "",
        tackle: [],
        proTips: [],
        sources
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
