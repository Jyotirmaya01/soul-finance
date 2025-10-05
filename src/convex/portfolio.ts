import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const addToPortfolio = mutation({
  args: {
    investmentId: v.id("investments"),
    investmentName: v.string(),
    amountInvested: v.number(),
    quantity: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const portfolioId = await ctx.db.insert("userPortfolio", {
      userId: user._id,
      investmentId: args.investmentId,
      investmentName: args.investmentName,
      amountInvested: args.amountInvested,
      currentValue: args.amountInvested,
      purchaseDate: new Date().toISOString(),
      quantity: args.quantity,
      notes: args.notes,
    });

    return portfolioId;
  },
});

export const getUserPortfolio = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const portfolio = await ctx.db
      .query("userPortfolio")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return portfolio;
  },
});

export const updatePortfolioValue = mutation({
  args: {
    portfolioId: v.id("userPortfolio"),
    currentValue: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(args.portfolioId, {
      currentValue: args.currentValue,
    });
  },
});

export const removeFromPortfolio = mutation({
  args: {
    portfolioId: v.id("userPortfolio"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.delete(args.portfolioId);
  },
});

export const getPortfolioStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return {
        totalInvested: 0,
        currentValue: 0,
        totalGainLoss: 0,
        percentageChange: 0,
        investmentCount: 0,
      };
    }

    const portfolio = await ctx.db
      .query("userPortfolio")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalInvested = portfolio.reduce((sum, item) => sum + item.amountInvested, 0);
    const currentValue = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
    const totalGainLoss = currentValue - totalInvested;
    const percentageChange = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      totalGainLoss,
      percentageChange,
      investmentCount: portfolio.length,
    };
  },
});
