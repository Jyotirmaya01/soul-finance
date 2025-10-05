import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Id } from "@/convex/_generated/dataModel";

interface PortfolioHoldingProps {
  item: {
    _id: Id<"userPortfolio">;
    investmentName: string;
    amountInvested: number;
    currentValue: number;
    purchaseDate: string;
    quantity?: number;
    notes?: string;
    isCustom?: boolean;
  };
  onEdit: (item: any) => void;
  onRemove: (portfolioId: Id<"userPortfolio">) => void;
  index: number;
}

export function PortfolioHolding({ item, onEdit, onRemove, index }: PortfolioHoldingProps) {
  const gainLoss = item.currentValue - item.amountInvested;
  const percentChange = item.amountInvested > 0 ? (gainLoss / item.amountInvested) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{item.investmentName}</CardTitle>
              {item.isCustom && (
                <Badge variant="outline" className="mt-1 text-xs">
                  Custom Investment
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
                className="h-8 w-8 text-blue-500 hover:text-blue-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item._id)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invested</span>
            <span className="font-semibold">${item.amountInvested.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Value</span>
            <span className="font-semibold">${item.currentValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gain/Loss</span>
            <span className={`font-semibold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {gainLoss >= 0 ? "+" : ""}${Math.abs(gainLoss).toLocaleString()} ({percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%)
            </span>
          </div>
          {item.quantity && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-semibold">{item.quantity}</span>
            </div>
          )}
          {item.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">{item.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
