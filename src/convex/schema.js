"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archetypeValidator = exports.ARCHETYPES = exports.roleValidator = exports.ROLES = void 0;
var server_1 = require("@convex-dev/auth/server");
var server_2 = require("convex/server");
var values_1 = require("convex/values");
exports.ROLES = {
    ADMIN: "admin",
    USER: "user",
    MEMBER: "member",
};
exports.roleValidator = values_1.v.union(values_1.v.literal(exports.ROLES.ADMIN), values_1.v.literal(exports.ROLES.USER), values_1.v.literal(exports.ROLES.MEMBER));
// Finance Archetypes
exports.ARCHETYPES = {
    EARTH_GUARDIAN: "earth_guardian",
    FREEDOM_SEEKER: "freedom_seeker",
    LEGACY_BUILDER: "legacy_builder",
    HARMONY_KEEPER: "harmony_keeper",
    ADVENTURE_INVESTOR: "adventure_investor",
};
exports.archetypeValidator = values_1.v.union(values_1.v.literal(exports.ARCHETYPES.EARTH_GUARDIAN), values_1.v.literal(exports.ARCHETYPES.FREEDOM_SEEKER), values_1.v.literal(exports.ARCHETYPES.LEGACY_BUILDER), values_1.v.literal(exports.ARCHETYPES.HARMONY_KEEPER), values_1.v.literal(exports.ARCHETYPES.ADVENTURE_INVESTOR));
var schema = (0, server_2.defineSchema)(__assign(__assign({}, server_1.authTables), { users: (0, server_2.defineTable)({
        name: values_1.v.optional(values_1.v.string()),
        image: values_1.v.optional(values_1.v.string()),
        email: values_1.v.optional(values_1.v.string()),
        emailVerificationTime: values_1.v.optional(values_1.v.number()),
        isAnonymous: values_1.v.optional(values_1.v.boolean()),
        role: values_1.v.optional(exports.roleValidator),
        // FinSoul specific fields
        archetype: values_1.v.optional(exports.archetypeValidator),
        peaceMeter: values_1.v.optional(values_1.v.number()),
        hasCompletedQuiz: values_1.v.optional(values_1.v.boolean()),
        dashboardTheme: values_1.v.optional(values_1.v.string()),
        topValues: values_1.v.optional(values_1.v.array(values_1.v.string())),
        // New profile fields
        profilePhoto: values_1.v.optional(values_1.v.string()),
        bio: values_1.v.optional(values_1.v.string()),
        currency: values_1.v.optional(values_1.v.string()),
        isPremium: values_1.v.optional(values_1.v.boolean()),
        newsletterSubscribed: values_1.v.optional(values_1.v.boolean()),
    }).index("email", ["email"]), soulScans: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        answers: values_1.v.object({
            personality: values_1.v.array(values_1.v.string()),
            values: values_1.v.array(values_1.v.string()),
            financialFears: values_1.v.array(values_1.v.string()),
            financialDreams: values_1.v.array(values_1.v.string()),
            spendingTriggers: values_1.v.array(values_1.v.string()),
        }),
        archetype: exports.archetypeValidator,
        peaceMeter: values_1.v.number(),
        completedAt: values_1.v.number(),
    }).index("by_user", ["userId"]), moodJournals: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        date: values_1.v.string(),
        mood: values_1.v.string(),
        emoji: values_1.v.string(),
        note: values_1.v.optional(values_1.v.string()),
        peaceMeterScore: values_1.v.number(),
    }).index("by_user_and_date", ["userId", "date"]), lifeGoals: (0, server_2.defineTable)({
        userId: values_1.v.id("users"),
        title: values_1.v.string(),
        targetAmount: values_1.v.number(),
        currentAmount: values_1.v.number(),
        targetDate: values_1.v.string(),
        category: values_1.v.string(),
        priority: values_1.v.number(),
    }).index("by_user", ["userId"]), circles: (0, server_2.defineTable)({
        name: values_1.v.string(),
        description: values_1.v.string(),
        creatorId: values_1.v.id("users"),
        memberCount: values_1.v.number(),
        isPublic: values_1.v.boolean(),
        tags: values_1.v.array(values_1.v.string()),
        communityType: values_1.v.string(),
    }).index("by_creator", ["creatorId"]), circleMembers: (0, server_2.defineTable)({
        circleId: values_1.v.id("circles"),
        userId: values_1.v.id("users"),
        joinedAt: values_1.v.number(),
    })
        .index("by_circle", ["circleId"])
        .index("by_user", ["userId"])
        .index("by_circle_and_user", ["circleId", "userId"]), challenges: (0, server_2.defineTable)({
        title: values_1.v.string(),
        description: values_1.v.string(),
        category: values_1.v.string(),
        points: values_1.v.number(),
        startDate: values_1.v.string(),
        endDate: values_1.v.string(),
        participantCount: values_1.v.number(),
    }), challengeParticipants: (0, server_2.defineTable)({
        challengeId: values_1.v.id("challenges"),
        userId: values_1.v.id("users"),
        progress: values_1.v.number(),
        completed: values_1.v.boolean(),
        joinedAt: values_1.v.number(),
    })
        .index("by_challenge", ["challengeId"])
        .index("by_user", ["userId"])
        .index("by_challenge_and_user", ["challengeId", "userId"]), investments: (0, server_2.defineTable)({
        name: values_1.v.string(),
        description: values_1.v.string(),
        category: values_1.v.string(),
        esgScore: values_1.v.number(),
        minInvestment: values_1.v.number(),
        expectedReturn: values_1.v.string(),
        riskLevel: values_1.v.string(),
        matchingArchetypes: values_1.v.array(values_1.v.string()),
        affiliateLink: values_1.v.optional(values_1.v.string()),
        isPremium: values_1.v.boolean(),
    }).index("by_category", ["category"]), newsletters: (0, server_2.defineTable)({
        email: values_1.v.string(),
        subscribedAt: values_1.v.number(),
        isActive: values_1.v.boolean(),
    }).index("by_email", ["email"]) }), {
    schemaValidation: false,
});
exports.default = schema;
