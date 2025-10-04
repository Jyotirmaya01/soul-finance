import { internalMutation } from "./_generated/server";

export const seedInvestments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const investments = [
      {
        name: "Green Energy Fund",
        description: "Invest in renewable energy companies making a real impact",
        category: "ESG",
        esgScore: 95,
        minInvestment: 100,
        expectedReturn: "8-12%",
        riskLevel: "Medium",
        matchingArchetypes: ["earth_guardian", "harmony_keeper"],
        isPremium: false,
      },
      {
        name: "Freedom Index ETF",
        description: "Diversified portfolio for financial independence",
        category: "Index Funds",
        esgScore: 70,
        minInvestment: 50,
        expectedReturn: "10-15%",
        riskLevel: "Medium",
        matchingArchetypes: ["freedom_seeker", "adventure_investor"],
        isPremium: false,
      },
      {
        name: "Legacy Real Estate Trust",
        description: "Build generational wealth through property",
        category: "Real Estate",
        esgScore: 75,
        minInvestment: 1000,
        expectedReturn: "6-10%",
        riskLevel: "Low",
        matchingArchetypes: ["legacy_builder", "harmony_keeper"],
        isPremium: true,
      },
      {
        name: "Local Community Bonds",
        description: "Support your community while earning steady returns",
        category: "Bonds",
        esgScore: 90,
        minInvestment: 500,
        expectedReturn: "4-6%",
        riskLevel: "Low",
        matchingArchetypes: ["earth_guardian", "legacy_builder"],
        isPremium: false,
      },
      {
        name: "Tech Innovation Fund",
        description: "High-growth potential in emerging technologies",
        category: "Growth",
        esgScore: 60,
        minInvestment: 200,
        expectedReturn: "15-25%",
        riskLevel: "High",
        matchingArchetypes: ["adventure_investor", "freedom_seeker"],
        isPremium: true,
      },
      {
        name: "Balanced Harmony Portfolio",
        description: "Perfect mix of stability and growth",
        category: "Balanced",
        esgScore: 80,
        minInvestment: 100,
        expectedReturn: "7-11%",
        riskLevel: "Medium",
        matchingArchetypes: ["harmony_keeper", "legacy_builder"],
        isPremium: false,
      },
    ];

    for (const inv of investments) {
      await ctx.db.insert("investments", inv);
    }

    return { count: investments.length };
  },
});
