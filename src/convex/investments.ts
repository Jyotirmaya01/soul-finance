import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getMatchingInvestments = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    
    const allInvestments = await ctx.db.query("investments").collect();
    
    if (!user?.archetype) {
      return allInvestments.slice(0, 6);
    }

    const matching = allInvestments.filter((inv) =>
      inv.matchingArchetypes.includes(user.archetype!)
    );

    return matching.length > 0 ? matching : allInvestments.slice(0, 6);
  },
});

export const getAllInvestments = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("investments")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("investments").collect();
  },
});
