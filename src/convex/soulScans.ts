import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const submitSoulScan = mutation({
  args: {
    answers: v.object({
      personality: v.array(v.string()),
      values: v.array(v.string()),
      financialFears: v.array(v.string()),
      financialDreams: v.array(v.string()),
      spendingTriggers: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Calculate archetype based on answers
    const archetype = calculateArchetype(args.answers);
    const peaceMeter = calculatePeaceMeter(args.answers);
    const topValues = args.answers.values.slice(0, 3);

    // Save soul scan
    await ctx.db.insert("soulScans", {
      userId: user._id,
      answers: args.answers,
      archetype,
      peaceMeter,
      completedAt: Date.now(),
    });

    // Update user profile
    await ctx.db.patch(user._id, {
      archetype,
      peaceMeter,
      hasCompletedQuiz: true,
      topValues,
      dashboardTheme: getThemeForArchetype(archetype),
    });

    // Award achievement for completing quiz
    await ctx.db.insert("achievements", {
      userId: user._id,
      type: "quiz_completed",
      title: "Soul Discovered",
      description: "Complete your Soul Scan quiz",
      points: 50,
      icon: "✨",
      earnedAt: Date.now(),
    });

    return { archetype, peaceMeter };
  },
});

export const getUserSoulScan = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const scan = await ctx.db
      .query("soulScans")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    return scan;
  },
});

function calculateArchetype(answers: any): "earth_guardian" | "freedom_seeker" | "legacy_builder" | "harmony_keeper" | "adventure_investor" {
  const values = answers.values.join(" ").toLowerCase();
  
  if (values.includes("environment") || values.includes("sustainability")) {
    return "earth_guardian";
  } else if (values.includes("freedom") || values.includes("independence")) {
    return "freedom_seeker";
  } else if (values.includes("family") || values.includes("legacy")) {
    return "legacy_builder";
  } else if (values.includes("balance") || values.includes("peace")) {
    return "harmony_keeper";
  } else {
    return "adventure_investor";
  }
}

function calculatePeaceMeter(answers: any): number {
  const fearCount = answers.financialFears.length;
  const dreamCount = answers.financialDreams.length;
  
  const baseScore = 50;
  const dreamBonus = dreamCount * 10;
  const fearPenalty = fearCount * 5;
  
  return Math.max(0, Math.min(100, baseScore + dreamBonus - fearPenalty));
}

function getThemeForArchetype(archetype: string): string {
  const themes: Record<string, string> = {
    earth_guardian: "green",
    freedom_seeker: "blue",
    legacy_builder: "gold",
    harmony_keeper: "purple",
    adventure_investor: "orange",
  };
  return themes[archetype] || "blue";
}