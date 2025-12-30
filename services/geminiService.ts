
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
      - USE precise technical terms (e.g., "12lb Fluorocarbon", "Dropshot rig", "3/8oz Jig").
      - BE ultra-specific about spots found in the area.

      STRUCTURE YOUR RESPONSE AS FOLLOWS:
      [SUMMARY] One short tactical overview sentence.
      [SPOTS] List 2-3 specific coordinate-based or landmark spots with a 1-sentence "why".
      [TIMING] Precise peak hours and specific weather/lunar triggers.
      [TACKLE] Bulleted list of specific rod, line, and lure/bait combos.
      [PRO TIPS] 3-4 punchy technique-specific commands.

      Use Search and Maps to find real, active reports.
    `;

    try {
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
