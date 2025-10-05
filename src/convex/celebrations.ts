import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getRecentCelebrations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("celebrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 10);
  },
});

export const getCelebrationStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const celebrations = await ctx.db
      .query("celebrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      totalCelebrations: celebrations.length,
      moodStreakCount: user.moodStreakCount || 0,
      recentCelebrations: celebrations.slice(0, 5),
    };
  },
});
