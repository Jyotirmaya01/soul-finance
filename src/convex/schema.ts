import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Finance Archetypes
export const ARCHETYPES = {
  EARTH_GUARDIAN: "earth_guardian",
  FREEDOM_SEEKER: "freedom_seeker",
  LEGACY_BUILDER: "legacy_builder",
  HARMONY_KEEPER: "harmony_keeper",
  ADVENTURE_INVESTOR: "adventure_investor",
} as const;

export const archetypeValidator = v.union(
  v.literal(ARCHETYPES.EARTH_GUARDIAN),
  v.literal(ARCHETYPES.FREEDOM_SEEKER),
  v.literal(ARCHETYPES.LEGACY_BUILDER),
  v.literal(ARCHETYPES.HARMONY_KEEPER),
  v.literal(ARCHETYPES.ADVENTURE_INVESTOR),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      
      // FinSoul specific fields
      archetype: v.optional(archetypeValidator),
      peaceMeter: v.optional(v.number()),
      hasCompletedQuiz: v.optional(v.boolean()),
      dashboardTheme: v.optional(v.string()),
      topValues: v.optional(v.array(v.string())),
      
      // Profile fields
      profilePhoto: v.optional(v.string()),
      bio: v.optional(v.string()),
      currency: v.optional(v.string()),
      isPremium: v.optional(v.boolean()),
      newsletterSubscribed: v.optional(v.boolean()),
      
      // New profile fields
      phoneNumber: v.optional(v.string()),
      dateOfBirth: v.optional(v.string()),
      
      // Astrology field
      zodiacSign: v.optional(v.string()),
      
      // Celebration tracking
      moodStreakCount: v.optional(v.number()),
      lastMoodEntryDate: v.optional(v.string()),
    }).index("email", ["email"]),

    soulScans: defineTable({
      userId: v.id("users"),
      answers: v.object({
        personality: v.array(v.string()),
        values: v.array(v.string()),
        financialFears: v.array(v.string()),
        financialDreams: v.array(v.string()),
        spendingTriggers: v.array(v.string()),
      }),
      archetype: archetypeValidator,
      peaceMeter: v.number(),
      completedAt: v.number(),
    }).index("by_user", ["userId"]),

    moodJournals: defineTable({
      userId: v.id("users"),
      date: v.string(),
      mood: v.string(),
      emoji: v.string(),
      note: v.optional(v.string()),
      peaceMeterScore: v.number(),
    }).index("by_user_and_date", ["userId", "date"]),

    lifeGoals: defineTable({
      userId: v.id("users"),
      title: v.string(),
      targetAmount: v.number(),
      currentAmount: v.number(),
      targetDate: v.string(),
      category: v.string(),
      priority: v.number(),
    }).index("by_user", ["userId"]),

    circles: defineTable({
      name: v.string(),
      description: v.string(),
      creatorId: v.id("users"),
      memberCount: v.number(),
      isPublic: v.boolean(),
      tags: v.array(v.string()),
      communityType: v.string(),
    }).index("by_creator", ["creatorId"]),

    circleMembers: defineTable({
      circleId: v.id("circles"),
      userId: v.id("users"),
      joinedAt: v.number(),
    })
      .index("by_circle", ["circleId"])
      .index("by_user", ["userId"])
      .index("by_circle_and_user", ["circleId", "userId"]),

    celebrations: defineTable({
      userId: v.id("users"),
      type: v.string(),
      triggeredAt: v.number(),
      message: v.optional(v.string()),
      metadata: v.optional(v.object({
        goalId: v.optional(v.id("lifeGoals")),
        streakCount: v.optional(v.number()),
        peaceMeterChange: v.optional(v.number()),
      })),
    }).index("by_user", ["userId"]),

    challenges: defineTable({
      title: v.string(),
      description: v.string(),
      category: v.string(),
      points: v.number(),
      startDate: v.string(),
      endDate: v.string(),
      participantCount: v.number(),
    }),

    challengeParticipants: defineTable({
      challengeId: v.id("challenges"),
      userId: v.id("users"),
      progress: v.number(),
      completed: v.boolean(),
      joinedAt: v.number(),
    })
      .index("by_challenge", ["challengeId"])
      .index("by_user", ["userId"])
      .index("by_challenge_and_user", ["challengeId", "userId"]),

    investments: defineTable({
      name: v.string(),
      description: v.string(),
      category: v.string(),
      esgScore: v.number(),
      minInvestment: v.number(),
      expectedReturn: v.string(),
      riskLevel: v.string(),
      matchingArchetypes: v.array(v.string()),
      affiliateLink: v.optional(v.string()),
      isPremium: v.boolean(),
    }).index("by_category", ["category"]),

    userPortfolio: defineTable({
      userId: v.id("users"),
      investmentId: v.id("investments"),
      investmentName: v.string(),
      amountInvested: v.number(),
      currentValue: v.number(),
      purchaseDate: v.string(),
      quantity: v.optional(v.number()),
      notes: v.optional(v.string()),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_investment", ["userId", "investmentId"]),

    newsletters: defineTable({
      email: v.string(),
      subscribedAt: v.number(),
      isActive: v.boolean(),
    }).index("by_email", ["email"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;