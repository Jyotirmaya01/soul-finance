import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Shield, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface InvestmentCardProps {
  investment: {
    _id: string;
    name: string;
    description: string;
    category: string;
    esgScore: number;
    minInvestment: number;
    expectedReturn: string;
    riskLevel: string;
    matchingArchetypes: string[];
    isPremium: boolean;
  };
  userArchetype?: string;
  onAddToPortfolio: (investment: any) => void;
  index: number;
}

export function InvestmentCard({ investment, userArchetype, onAddToPortfolio, index }: InvestmentCardProps) {
  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-green-600 bg-green-100 dark:bg-green-900/30";
    if (risk === "Medium") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    return "text-red-600 bg-red-100 dark:bg-red-900/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-lg">{investment.name}</CardTitle>
            {investment.isPremium && (
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                Premium
              </Badge>
            )}
          </div>
          <CardDescription>{investment.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">ESG Score</span>
              <div className="flex items-center gap-1">
                <Leaf className="h-4 w-4 text-green-500" />
                <span className="font-semibold">{investment.esgScore}/100</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expected Return</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{investment.expectedReturn}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Level</span>
              <Badge className={getRiskColor(investment.riskLevel)}>
                <Shield className="h-3 w-3 mr-1" />
                {investment.riskLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Min. Investment</span>
              <span className="font-semibold">${investment.minInvestment.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Why This Matches You</p>
              <p className="text-sm flex items-center gap-1">
                <Heart className="h-3 w-3 text-pink-500" fill="currentColor" />
                Aligned with your {userArchetype?.replace(/_/g, " ") || "financial"} values
              </p>
            </div>
            <Button className="w-full" onClick={() => onAddToPortfolio(investment)}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
