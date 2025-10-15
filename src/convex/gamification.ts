import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { getCurrentUser } from "./users";

// Achievement types - Extended with new challenging achievements
export const ACHIEVEMENT_TYPES = {
  // Beginner
  FIRST_GOAL: "first_goal",
  QUIZ_COMPLETED: "quiz_completed",
  PROFILE_COMPLETE: "profile_complete",
  CIRCLE_JOINED: "circle_joined",
  FIRST_INVESTMENT: "first_investment",
  
  // Intermediate
  GOAL_COMPLETED: "goal_completed",
  MOOD_STREAK_7: "mood_streak_7",
  MOOD_STREAK_30: "mood_streak_30",
  CIRCLE_CREATED: "circle_created",
  PORTFOLIO_5K: "portfolio_5k",
  PORTFOLIO_10K: "portfolio_10k",
  
  // Advanced - Mood Streaks
  MOOD_STREAK_60: "mood_streak_60",
  MOOD_STREAK_90: "mood_streak_90",
  MOOD_STREAK_180: "mood_streak_180",
  MOOD_STREAK_365: "mood_streak_365",
  
  // Advanced - Goal Completions
  GOALS_COMPLETED_3: "goals_completed_3",
  GOALS_COMPLETED_5: "goals_completed_5",
  GOALS_COMPLETED_10: "goals_completed_10",
  
  // Advanced - Portfolio Value
  PORTFOLIO_25K: "portfolio_25k",
  PORTFOLIO_50K: "portfolio_50k",
  PORTFOLIO_100K: "portfolio_100k",
  
  // Advanced - Portfolio Diversity
  DIVERSE_PORTFOLIO_5: "diverse_portfolio_5",
  DIVERSE_PORTFOLIO_10: "diverse_portfolio_10",
  DIVERSE_PORTFOLIO_15: "diverse_portfolio_15",
  
  // Elite - Community
  CIRCLES_CREATED_3: "circles_created_3",
  CIRCLES_CREATED_5: "circles_created_5",
  
  // Elite - Engagement
  CALCULATOR_MASTER: "calculator_master",
  ASTROLOGY_EXPLORER: "astrology_explorer",
  PREMIUM_SUBSCRIBER: "premium_subscriber",
  EARLY_ADOPTER: "early_adopter",
  PERFECT_WEEK: "perfect_week",
  WEALTH_BUILDER: "wealth_builder",
  
  // Legendary
  ULTIMATE_ACHIEVER: "ultimate_achiever",
  SOUL_FINANCE_LEGEND: "soul_finance_legend",
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

// Helper function to check and award mood streak achievements
export const checkMoodStreakAchievements = mutation({
  args: { streakCount: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return;

    const achievements = [
      { type: ACHIEVEMENT_TYPES.MOOD_STREAK_7, threshold: 7, title: "Week Warrior", description: "Track your mood for 7 days straight", icon: "💚", points: 50 },
      { type: ACHIEVEMENT_TYPES.MOOD_STREAK_30, threshold: 30, title: "Mood Master", description: "Track your mood for 30 days straight", icon: "🔥", points: 150 },
      { type: ACHIEVEMENT_TYPES.MOOD_STREAK_60, threshold: 60, title: "Consistency King", description: "Track your mood for 60 days straight", icon: "⚡", points: 250 },
      { type: ACHIEVEMENT_TYPES.MOOD_STREAK_90, threshold: 90, title: "Habit Master", description: "Track your mood for 90 days straight", icon: "🌟", points: 350 },
      { type: ACHIEVEMENT_TYPES.MOOD_STREAK_180, threshold: 180, title: "Half Year Hero", description: "Track your mood for 180 days straight", icon: "🎖️", points: 500 },
      { type: ACHIEVEMENT_TYPES.MOOD_STREAK_365, threshold: 365, title: "Year-Long Legend", description: "Track your mood for 365 days straight", icon: "🏅", points: 1000 },
    ];

    for (const achievement of achievements) {
      if (args.streakCount >= achievement.threshold) {
        await ctx.runMutation(api.gamification.awardAchievement, {
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          points: achievement.points,
        });
      }
    }
  },
});

// Helper function to check portfolio value achievements
export const checkPortfolioAchievements = mutation({
  args: { portfolioValue: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return;

    const achievements = [
      { type: ACHIEVEMENT_TYPES.PORTFOLIO_5K, threshold: 5000, title: "5K Club", description: "Reach $5,000 in portfolio value", icon: "💎", points: 100 },
      { type: ACHIEVEMENT_TYPES.PORTFOLIO_10K, threshold: 10000, title: "10K Champion", description: "Reach $10,000 in portfolio value", icon: "👑", points: 200 },
      { type: ACHIEVEMENT_TYPES.PORTFOLIO_25K, threshold: 25000, title: "25K Elite", description: "Reach $25,000 in portfolio value", icon: "💰", points: 300 },
      { type: ACHIEVEMENT_TYPES.PORTFOLIO_50K, threshold: 50000, title: "50K Master", description: "Reach $50,000 in portfolio value", icon: "💵", points: 500 },
      { type: ACHIEVEMENT_TYPES.PORTFOLIO_100K, threshold: 100000, title: "100K Legend", description: "Reach $100,000 in portfolio value", icon: "🤑", points: 1000 },
    ];

    for (const achievement of achievements) {
      if (args.portfolioValue >= achievement.threshold) {
        await ctx.runMutation(api.gamification.awardAchievement, {
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          points: achievement.points,
        });
      }
    }
  },
});

// Helper function to check portfolio diversity achievements
export const checkDiversityAchievements = mutation({
  args: { investmentCount: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return;

    const achievements = [
      { type: ACHIEVEMENT_TYPES.DIVERSE_PORTFOLIO_5, threshold: 5, title: "Diversification Starter", description: "Hold 5 different investments", icon: "📊", points: 150 },
      { type: ACHIEVEMENT_TYPES.DIVERSE_PORTFOLIO_10, threshold: 10, title: "Portfolio Architect", description: "Hold 10 different investments", icon: "📈", points: 300 },
      { type: ACHIEVEMENT_TYPES.DIVERSE_PORTFOLIO_15, threshold: 15, title: "Investment Maestro", description: "Hold 15+ different investments", icon: "🎼", points: 500 },
    ];

    for (const achievement of achievements) {
      if (args.investmentCount >= achievement.threshold) {
        await ctx.runMutation(api.gamification.awardAchievement, {
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          points: achievement.points,
        });
      }
    }
  },
});

// Helper function to check goal completion achievements
export const checkGoalCompletionAchievements = mutation({
  args: { completedGoals: v.number() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return;

    const achievements = [
      { type: ACHIEVEMENT_TYPES.GOAL_COMPLETED, threshold: 1, title: "Goal Crusher", description: "Complete a life goal", icon: "🏆", points: 100 },
      { type: ACHIEVEMENT_TYPES.GOALS_COMPLETED_3, threshold: 3, title: "Triple Threat", description: "Complete 3 life goals", icon: "🎯", points: 250 },
      { type: ACHIEVEMENT_TYPES.GOALS_COMPLETED_5, threshold: 5, title: "Goal Dominator", description: "Complete 5 life goals", icon: "🏆", points: 400 },
      { type: ACHIEVEMENT_TYPES.GOALS_COMPLETED_10, threshold: 10, title: "Dream Achiever", description: "Complete 10 life goals", icon: "💫", points: 750 },
    ];

    for (const achievement of achievements) {
      if (args.completedGoals >= achievement.threshold) {
        await ctx.runMutation(api.gamification.awardAchievement, {
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          points: achievement.points,
        });
      }
    }
  },
});