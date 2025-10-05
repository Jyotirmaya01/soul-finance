"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// Get current lunar phase (simplified calculation)
function getLunarPhase(date: Date): string {
  const lunarCycle = 29.53058867; // days
  const knownNewMoon = new Date("2000-01-06").getTime();
  const daysSinceNew = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = (daysSinceNew % lunarCycle) / lunarCycle;
  
  if (phase < 0.125) return "New Moon";
  if (phase < 0.375) return "Waxing Crescent";
  if (phase < 0.625) return "Full Moon";
  if (phase < 0.875) return "Waning Crescent";
  return "New Moon";
}

export const generateDailyHoroscope = action({
  args: {
    zodiacSign: v.string(),
  },
  handler: async (_ctx, args): Promise<{ success: boolean; horoscope?: string; error?: string }> => {
    try {
      const { default: OpenAI } = await import("openai");
      
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });

      const today = new Date();
      const lunarPhase = getLunarPhase(today);
      const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

      const prompt = `Generate a daily financial horoscope for ${args.zodiacSign} for ${dayOfWeek}, ${today.toLocaleDateString()}. 

Current lunar phase: ${lunarPhase}

Provide:
1. A brief financial outlook (2-3 sentences)
2. One specific financial tip or action to consider
3. An encouraging message about their financial journey

Keep it positive, emotionally intelligent, and values-aligned. Use emojis sparingly (💰, 🌙, ✨). 
Make it feel mystical but grounded in practical financial wisdom.
Maximum 150 words.`;

      const completion: any = await openai.chat.completions.create({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      const horoscope = completion.choices[0].message.content || "The stars are aligning... check back soon! 🌟";

      return {
        success: true,
        horoscope,
      };
    } catch (error: any) {
      console.error("Astrology generation error:", error);
      return {
        success: false,
        error: error.message,
        horoscope: "The cosmic energies are shifting... please try again later! 🌙✨",
      };
    }
  },
});

export const generateBestDays = action({
  args: {
    zodiacSign: v.string(),
  },
  handler: async (_ctx, args): Promise<{ success: boolean; bestDays?: number[]; insights?: string; error?: string }> => {
    try {
      const { default: OpenAI } = await import("openai");
      
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });

      const today = new Date();
      const month = today.toLocaleDateString("en-US", { month: "long" });

      const prompt = `For ${args.zodiacSign} in ${month}, suggest 5-7 favorable days (as day numbers 1-31) for making financial decisions or investments. 

Respond ONLY with a JSON object in this exact format:
{
  "days": [3, 7, 12, 18, 24, 29],
  "insight": "Brief explanation of why these days are favorable (1-2 sentences)"
}`;

      const completion: any = await openai.chat.completions.create({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content || "{}";
      const parsed = JSON.parse(response);

      return {
        success: true,
        bestDays: parsed.days || [7, 14, 21],
        insights: parsed.insight || "These days align with favorable cosmic energies for financial decisions.",
      };
    } catch (error: any) {
      console.error("Best days generation error:", error);
      return {
        success: false,
        error: error.message,
        bestDays: [7, 14, 21, 28],
        insights: "The cosmic calendar is recalibrating... using general favorable days.",
      };
    }
  },
});

export const generateCosmicInsights = action({
  args: {
    zodiacSign: v.string(),
  },
  handler: async (_ctx, args): Promise<{ success: boolean; insights?: string; error?: string }> => {
    try {
      const { default: OpenAI } = await import("openai");
      
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });

      const lunarPhase = getLunarPhase(new Date());

      const prompt = `Generate cosmic spending insights for ${args.zodiacSign} during the ${lunarPhase} phase.

Explain how this lunar phase might influence their spending patterns and financial decisions. Include:
1. How this phase affects their financial energy
2. One spending tendency to be aware of
3. One positive financial habit to embrace

Keep it mystical yet practical. Maximum 120 words. Use emojis: 🌙, 💫, 💰`;

      const completion: any = await openai.chat.completions.create({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 250,
        temperature: 0.8,
      });

      const insights = completion.choices[0].message.content || "The cosmic energies are in flux... 🌙";

      return {
        success: true,
        insights,
      };
    } catch (error: any) {
      console.error("Cosmic insights generation error:", error);
      return {
        success: false,
        error: error.message,
        insights: "The universe is recalibrating its wisdom... please check back soon! 🌙✨",
      };
    }
  },
});
