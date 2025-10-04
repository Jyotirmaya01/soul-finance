import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createCircle = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    isPublic: v.boolean(),
    tags: v.array(v.string()),
    communityType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const circleId = await ctx.db.insert("circles", {
      ...args,
      creatorId: user._id,
      memberCount: 1,
    });

    await ctx.db.insert("circleMembers", {
      circleId,
      userId: user._id,
      joinedAt: Date.now(),
    });

    return circleId;
  },
});

export const joinCircle = mutation({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("circleMembers")
      .withIndex("by_circle_and_user", (q) =>
        q.eq("circleId", args.circleId).eq("userId", user._id)
      )
      .first();

    if (existing) return;

    await ctx.db.insert("circleMembers", {
      circleId: args.circleId,
      userId: user._id,
      joinedAt: Date.now(),
    });

    const circle = await ctx.db.get(args.circleId);
    if (circle) {
      await ctx.db.patch(args.circleId, {
        memberCount: circle.memberCount + 1,
      });
    }
  },
});

export const getPublicCircles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("circles")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .take(20);
  },
});

export const searchCircles = query({
  args: { searchTerm: v.optional(v.string()), communityType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let circles = await ctx.db
      .query("circles")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();

    if (args.communityType && args.communityType !== "all") {
      circles = circles.filter((c) => c.communityType === args.communityType);
    }

    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      circles = circles.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term)
      );
    }

    return circles.slice(0, 20);
  },
});

export const getUserCircles = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const memberships = await ctx.db
      .query("circleMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const circles = await Promise.all(
      memberships.map((m) => ctx.db.get(m.circleId))
    );

    return circles.filter((c) => c !== null);
  },
});