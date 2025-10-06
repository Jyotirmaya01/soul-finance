import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  earnedAt?: number;
  index?: number;
}

export function AchievementBadge({
  title,
  description,
  icon,
  points,
  earned,
  earnedAt,
  index = 0,
}: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`relative overflow-hidden transition-all ${
          earned
            ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-300 dark:border-yellow-700"
            : "bg-muted/50 opacity-60"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                earned
                  ? "bg-gradient-to-br from-yellow-400 to-orange-400"
                  : "bg-muted"
              }`}
            >
              {earned ? icon : <Lock className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{description}</p>
              <div className="flex items-center gap-2">
                <Award className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-medium">{points} points</span>
              </div>
              {earned && earnedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Earned {new Date(earnedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
