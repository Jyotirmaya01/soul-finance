import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createMoodEntry = mutation({
  args: {
    date: v.string(),
    mood: v.string(),
    emoji: v.string(),
    note: v.optional(v.string()),
    peaceMeterScore: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check for mood streak
    const today = new Date(args.date);
    const lastEntry = user.lastMoodEntryDate ? new Date(user.lastMoodEntryDate) : null;
    let streakCount = user.moodStreakCount || 0;
    let shouldCelebrate = false;

    if (lastEntry) {
      const daysDiff = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        streakCount += 1;
        if (streakCount === 7 || streakCount % 30 === 0) {
          shouldCelebrate = true;
        }
      } else if (daysDiff > 1) {
        streakCount = 1;
      }
    } else {
      streakCount = 1;
    }

    // Update user streak
    await ctx.db.patch(user._id, {
      moodStreakCount: streakCount,
      lastMoodEntryDate: args.date,
    });

    // Create celebration if streak milestone
    if (shouldCelebrate) {
      await ctx.db.insert("celebrations", {
        userId: user._id,
        type: "mood_streak",
        triggeredAt: Date.now(),
        message: `${streakCount} day streak!`,
        metadata: { streakCount },
      });

      // Award achievement for mood streaks
      if (streakCount === 7) {
        const existing = await ctx.db
          .query("achievements")
          .withIndex("by_user_and_type", (q) =>
            q.eq("userId", user._id).eq("type", "mood_streak_7")
          )
          .first();

        if (!existing) {
          await ctx.db.insert("achievements", {
            userId: user._id,
            type: "mood_streak_7",
            title: "Week Warrior",
            description: "Track your mood for 7 days straight",
            points: 50,
            icon: "💚",
            earnedAt: Date.now(),
          });
        }
      } else if (streakCount === 30) {
        const existing = await ctx.db
          .query("achievements")
          .withIndex("by_user_and_type", (q) =>
            q.eq("userId", user._id).eq("type", "mood_streak_30")
          )
          .first();

        if (!existing) {
          await ctx.db.insert("achievements", {
            userId: user._id,
            type: "mood_streak_30",
            title: "Mood Master",
            description: "Track your mood for 30 days straight",
            points: 150,
            icon: "🔥",
            earnedAt: Date.now(),
          });
        }
      }
    }

    const entryId = await ctx.db.insert("moodJournals", {
      userId: user._id,
      ...args,
    });

    return { entryId, shouldCelebrate, streakCount };
  },
});

export const getUserMoodJournals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const journals = await ctx.db
      .query("moodJournals")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 30);

    return journals;
  },
});