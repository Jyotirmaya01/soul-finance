import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Achievement types
export const ACHIEVEMENT_TYPES = {
  FIRST_GOAL: "first_goal",
  GOAL_COMPLETED: "goal_completed",
  MOOD_STREAK_7: "mood_streak_7",
  MOOD_STREAK_30: "mood_streak_30",
  FIRST_INVESTMENT: "first_investment",
  PORTFOLIO_5K: "portfolio_5k",
  PORTFOLIO_10K: "portfolio_10k",
  CIRCLE_JOINED: "circle_joined",
  CIRCLE_CREATED: "circle_created",
  QUIZ_COMPLETED: "quiz_completed",
  PROFILE_COMPLETE: "profile_complete",
} as const;

// Get user achievements
export const getUserAchievements = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Get user stats
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
    const level = Math.floor(totalPoints / 100) + 1;

    return {
      totalPoints,
      level,
      achievementCount: achievements.length,
      moodStreakCount: user.moodStreakCount || 0,
    };
  },
});

// Award achievement
export const awardAchievement = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.string(),
    points: v.number(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if achievement already exists
    const existing = await ctx.db
      .query("achievements")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", user._id).eq("type", args.type)
      )
      .first();

    if (existing) {
      return { alreadyAwarded: true };
    }

    // Award the achievement
    await ctx.db.insert("achievements", {
      userId: user._id,
      type: args.type,
      title: args.title,
      description: args.description,
      points: args.points,
      icon: args.icon,
      earnedAt: Date.now(),
    });

    return { alreadyAwarded: false, points: args.points };
  },
});

// Get leaderboard
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get all users with their achievement counts
    const users = await ctx.db.query("users").collect();
    
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const achievements = await ctx.db
          .query("achievements")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
        const level = Math.floor(totalPoints / 100) + 1;

        return {
          userId: user._id,
          name: user.name || "Anonymous",
          archetype: user.archetype,
          totalPoints,
          level,
          achievementCount: achievements.length,
        };
      })
    );

    // Sort by points and return top users
    return leaderboard
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  },
});
