import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createLifeGoal = mutation({
  args: {
    title: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    targetDate: v.string(),
    category: v.string(),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("lifeGoals", {
      userId: user._id,
      ...args,
    });
  },
});

export const updateLifeGoal = mutation({
  args: {
    goalId: v.id("lifeGoals"),
    currentAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(args.goalId, {
      currentAmount: args.currentAmount,
    });
  },
});

export const getUserLifeGoals = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("lifeGoals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});
