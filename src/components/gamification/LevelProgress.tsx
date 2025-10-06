import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LevelProgressProps {
  level: number;
  totalPoints: number;
  achievementCount: number;
}

export function LevelProgress({ level, totalPoints, achievementCount }: LevelProgressProps) {
  const pointsForCurrentLevel = (level - 1) * 100;
  const progressInLevel = totalPoints - pointsForCurrentLevel;
  const progressPercentage = (progressInLevel / 100) * 100;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {level}
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Star className="h-12 w-12 text-yellow-500" fill="currentColor" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {level + 1}</span>
            <span className="font-medium">
              {progressInLevel} / 100 points
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalPoints}
            </p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {achievementCount}
            </p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
