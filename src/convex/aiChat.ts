"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const sendMessage = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; response: string; error?: string }> => {
    // Dynamic import for OpenAI to avoid module resolution issues
    const { default: OpenAI } = await import("openai");
    
    // Get user info for context
    const user: any = await ctx.runQuery(api.users.currentUser);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Initialize OpenRouter client
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // Build context about the user
    const userContext: string = `
User Profile:
- Name: ${user.name || "User"}
- Financial Archetype: ${user.archetype || "Not determined"}
- Peace Meter Score: ${user.peaceMeter || "Not set"}
- Top Values: ${user.topValues?.join(", ") || "Not set"}
- Premium Status: ${user.isPremium ? "Premium Member" : "Free Member"}
`;

    const systemPrompt: string = `You are FinSoul's AI Coach, a compassionate and knowledgeable financial advisor with emotional intelligence. Your role is to help users with their financial questions while being mindful of their emotional relationship with money.

${userContext}

Guidelines:
- Be warm, supportive, and non-judgmental
- Provide practical financial advice tailored to the user's archetype and values
- Consider the user's Peace Meter score when giving advice
- Use emojis occasionally to be friendly (💚, 🎯, 💰, etc.)
- Keep responses concise but helpful (2-4 paragraphs max)
- If asked about investments, remind them to check the Investments page for personalized recommendations
- Encourage healthy financial habits and emotional awareness
- Never provide specific investment advice or guarantee returns
- If the question is outside your expertise, be honest about it

Remember: You're here to guide, support, and educate - not to judge or pressure.`;

    try {
      const completion: any = await openai.chat.completions.create({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: args.message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response: string = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";

      return {
        success: true,
        response,
      };
    } catch (error: any) {
      console.error("OpenRouter API error:", error);
      return {
        success: false,
        response: "I'm having trouble connecting right now. Please try again in a moment. 💚",
        error: error.message,
      };
    }
  },
});
