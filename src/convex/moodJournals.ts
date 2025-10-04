import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createMoodEntry = mutation({
  args: {
    date: v.string(),
    mood: v.string(),
    emoji: v.string(),
    note: v.optional(v.string()),
    peaceMeterScore: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("moodJournals", {
      userId: user._id,
      ...args,
    });
  },
});

export const getUserMoodJournals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const journals = await ctx.db
      .query("moodJournals")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 30);

    return journals;
  },
});
