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

    // Check if this is the first goal
    const existingGoals = await ctx.db
      .query("lifeGoals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const isFirstGoal = existingGoals.length === 0;

    const goalId = await ctx.db.insert("lifeGoals", {
      userId: user._id,
      ...args,
    });

    // Celebrate first goal
    if (isFirstGoal) {
      await ctx.db.insert("celebrations", {
        userId: user._id,
        type: "first_goal",
        triggeredAt: Date.now(),
        metadata: { goalId },
      });
    }

    return { goalId, shouldCelebrate: isFirstGoal };
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

    const goal = await ctx.db.get(args.goalId);
    if (!goal) throw new Error("Goal not found");

    const oldProgress = (goal.currentAmount / goal.targetAmount) * 100;
    const newProgress = (args.currentAmount / goal.targetAmount) * 100;

    // Check for milestone celebrations (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100];
    let shouldCelebrate = false;
    let celebrationMessage = "";

    for (const milestone of milestones) {
      if (oldProgress < milestone && newProgress >= milestone) {
        shouldCelebrate = true;
        celebrationMessage = `${milestone}% of your goal reached!`;
        
        await ctx.db.insert("celebrations", {
          userId: user._id,
          type: "goal_milestone",
          triggeredAt: Date.now(),
          message: celebrationMessage,
          metadata: { goalId: args.goalId },
        });
        break;
      }
    }

    await ctx.db.patch(args.goalId, {
      currentAmount: args.currentAmount,
    });

    return { shouldCelebrate, message: celebrationMessage, progress: newProgress };
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