import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      if (!existing.isActive) {
        await ctx.db.patch(existing._id, { isActive: true });
      }
      return { success: true, message: "Already subscribed!" };
    }

    await ctx.db.insert("newsletters", {
      email: args.email,
      subscribedAt: Date.now(),
      isActive: true,
    });

    return { success: true, message: "Successfully subscribed!" };
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { isActive: false });
    }

    return { success: true };
  },
});
