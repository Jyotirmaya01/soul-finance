import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";

interface PortfolioStatsProps {
  stats: {
    totalInvested: number;
    currentValue: number;
    totalGainLoss: number;
    percentageChange: number;
    investmentCount: number;
  };
}

export function PortfolioStats({ stats }: PortfolioStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">${stats.currentValue.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {stats.totalGainLoss >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(stats.totalGainLoss).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Return %</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            <span className={`text-2xl font-bold ${stats.percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.percentageChange >= 0 ? "+" : ""}{stats.percentageChange.toFixed(2)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
