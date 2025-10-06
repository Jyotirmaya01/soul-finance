import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    currency: v.optional(v.string()),
    newsletterSubscribed: v.optional(v.boolean()),
    phoneNumber: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.newsletterSubscribed !== undefined) updates.newsletterSubscribed = args.newsletterSubscribed;
    if (args.phoneNumber !== undefined) updates.phoneNumber = args.phoneNumber;
    if (args.dateOfBirth !== undefined) updates.dateOfBirth = args.dateOfBirth;
    if (args.profilePhoto !== undefined) updates.profilePhoto = args.profilePhoto;

    await ctx.db.patch(user._id, updates);

    // Check if profile is complete and award achievement
    const updatedUser = await ctx.db.get(user._id);
    if (updatedUser && updatedUser.name && updatedUser.bio && updatedUser.phoneNumber && updatedUser.dateOfBirth) {
      const existing = await ctx.db
        .query("achievements")
        .withIndex("by_user_and_type", (q) =>
          q.eq("userId", user._id).eq("type", "profile_complete")
        )
        .first();

      if (!existing) {
        await ctx.db.insert("achievements", {
          userId: user._id,
          type: "profile_complete",
          title: "Profile Pro",
          description: "Complete your profile",
          points: 50,
          icon: "👤",
          earnedAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

export const upgradeToPremium = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(user._id, { isPremium: true });

    return { success: true };
  },
});

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      currency: user.currency || "USD",
      isPremium: user.isPremium || false,
      newsletterSubscribed: user.newsletterSubscribed || false,
      archetype: user.archetype,
      peaceMeter: user.peaceMeter,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
    };
  },
});