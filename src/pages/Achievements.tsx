import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Award } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { LevelProgress } from "@/components/gamification/LevelProgress";

// Define all possible achievements
const ALL_ACHIEVEMENTS = [
  {
    type: "quiz_completed",
    title: "Soul Discovered",
    description: "Complete your Soul Scan quiz",
    icon: "✨",
    points: 50,
  },
  {
    type: "first_goal",
    title: "Goal Setter",
    description: "Set your first life goal",
    icon: "🎯",
    points: 25,
  },
  {
    type: "goal_completed",
    title: "Goal Crusher",
    description: "Complete a life goal",
    icon: "🏆",
    points: 100,
  },
  {
    type: "mood_streak_7",
    title: "Week Warrior",
    description: "Track your mood for 7 days straight",
    icon: "💚",
    points: 50,
  },
  {
    type: "mood_streak_30",
    title: "Mood Master",
    description: "Track your mood for 30 days straight",
    icon: "🔥",
    points: 150,
  },
  {
    type: "first_investment",
    title: "Investor Initiate",
    description: "Add your first investment",
    icon: "💰",
    points: 75,
  },
  {
    type: "portfolio_5k",
    title: "5K Club",
    description: "Reach $5,000 in portfolio value",
    icon: "💎",
    points: 100,
  },
  {
    type: "portfolio_10k",
    title: "10K Champion",
    description: "Reach $10,000 in portfolio value",
    icon: "👑",
    points: 200,
  },
  {
    type: "circle_joined",
    title: "Community Member",
    description: "Join your first circle",
    icon: "🤝",
    points: 25,
  },
  {
    type: "circle_created",
    title: "Community Leader",
    description: "Create a circle",
    icon: "🌟",
    points: 75,
  },
  {
    type: "profile_complete",
    title: "Profile Pro",
    description: "Complete your profile",
    icon: "👤",
    points: 50,
  },
];

export default function Achievements() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const userAchievements = useQuery(api.gamification.getUserAchievements);
  const userStats = useQuery(api.gamification.getUserStats);
  const leaderboard = useQuery(api.gamification.getLeaderboard, { limit: 10 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || userAchievements === undefined || userStats === undefined || userStats === null) {
    return <LoadingScreen message="Loading achievements..." />;
  }

  const earnedAchievements = new Set(userAchievements.map((a) => a.type));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Achievements
          </h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Level Progress */}
          <LevelProgress
            level={userStats.level}
            totalPoints={userStats.totalPoints}
            achievementCount={userStats.achievementCount}
          />

          {/* Tabs */}
          <Tabs defaultValue="achievements" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="achievements">
                <Award className="h-4 w-4 mr-2" />
                My Achievements
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>
                    Unlock achievements by completing goals and engaging with Soul Finance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ALL_ACHIEVEMENTS.map((achievement, index) => {
                      const earned = earnedAchievements.has(achievement.type);
                      const earnedData = userAchievements.find(
                        (a) => a.type === achievement.type
                      );

                      return (
                        <AchievementBadge
                          key={achievement.type}
                          title={achievement.title}
                          description={achievement.description}
                          icon={achievement.icon}
                          points={achievement.points}
                          earned={earned}
                          earnedAt={earnedData?.earnedAt}
                          index={index}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard">
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle>Top Achievers</CardTitle>
                  <CardDescription>
                    See how you rank against other Soul Finance users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!leaderboard ? (
                    <LoadingScreen message="Loading leaderboard..." />
                  ) : (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => (
                        <motion.div
                          key={entry.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-4 rounded-lg ${
                            index < 3
                              ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-300 dark:border-yellow-700"
                              : "bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-yellow-400 text-yellow-900"
                                : index === 1
                                ? "bg-gray-300 text-gray-900"
                                : index === 2
                                ? "bg-orange-400 text-orange-900"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{entry.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Level {entry.level} • {entry.achievementCount} achievements
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{entry.totalPoints}</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
