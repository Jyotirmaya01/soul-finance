import { PeaceMeter } from "@/components/PeaceMeter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { BookHeart, Heart, Loader2, LogOut, MessageCircle, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, user, signOut } = useAuth();
  const [journalNote, setJournalNote] = useState("");
  const [selectedMood, setSelectedMood] = useState("");

  const moodJournals = useQuery(api.moodJournals.getUserMoodJournals, { limit: 7 });
  const lifeGoals = useQuery(api.lifeGoals.getUserLifeGoals);
  const createMoodEntry = useMutation(api.moodJournals.createMoodEntry);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user && !user.hasCompletedQuiz) {
      navigate("/soul-scan");
    }
  }, [user, navigate]);

  const moods = [
    { emoji: "😊", label: "Great", value: "great" },
    { emoji: "😌", label: "Calm", value: "calm" },
    { emoji: "😐", label: "Okay", value: "okay" },
    { emoji: "😟", label: "Worried", value: "worried" },
    { emoji: "😰", label: "Stressed", value: "stressed" },
  ];

  const handleSaveMood = async () => {
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    const mood = moods.find((m) => m.value === selectedMood);
    if (!mood) return;

    try {
      await createMoodEntry({
        date: new Date().toISOString().split("T")[0],
        mood: mood.label,
        emoji: mood.emoji,
        note: journalNote,
        peaceMeterScore: user?.peaceMeter || 50,
      });

      toast.success("Mood saved! 💚");
      setJournalNote("");
      setSelectedMood("");
    } catch (error) {
      toast.error("Failed to save mood");
    }
  };

  const getArchetypeName = (archetype?: string) => {
    const names: Record<string, string> = {
      earth_guardian: "The Earth Guardian",
      freedom_seeker: "The Freedom Seeker",
      legacy_builder: "The Legacy Builder",
      harmony_keeper: "The Harmony Keeper",
      adventure_investor: "The Adventure Investor",
    };
    return archetype ? names[archetype] : "Explorer";
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="FinSoul" className="h-8 w-8 cursor-pointer" onClick={() => navigate("/")} />
            <h1 className="text-xl font-bold">FinSoul</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <Heart className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/investments")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Investments
            </Button>
            <Button variant="ghost" onClick={() => navigate("/community")}>
              <Users className="mr-2 h-4 w-4" />
              Community
            </Button>
            <Button variant="ghost" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user.name || "Friend"} 💚
          </h2>
          <p className="text-muted-foreground">
            You're {getArchetypeName(user.archetype)} — let's nurture your financial soul today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Peace Meter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-pink-500" />
                  Your Peace
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <PeaceMeter score={user.peaceMeter || 50} size="md" />
                <Button variant="outline" className="mt-4 w-full" size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Take a Breath
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values Tracker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-blue-500" />
                  Your Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.topValues?.slice(0, 3).map((value, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Life Goals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-green-500" />
                  Life Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lifeGoals && lifeGoals.length > 0 ? (
                  <div className="space-y-3">
                    {lifeGoals.slice(0, 3).map((goal) => (
                      <div key={goal._id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{goal.title}</span>
                          <span className="text-muted-foreground">
                            {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No goals yet. Let's create some!</p>
                )}
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Money Mood Journal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookHeart className="text-purple-500" />
                  Money Mood Journal
                </CardTitle>
                <CardDescription>How are you feeling about money today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {moods.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={selectedMood === mood.value ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedMood(mood.value)}
                      className="text-2xl"
                    >
                      {mood.emoji}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="What's on your mind? (optional)"
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSaveMood} className="w-full">
                  Save Today's Mood
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Coach */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="text-indigo-500" />
                  AI Coach
                </CardTitle>
                <CardDescription>I'm here to help</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  "Remember, every small step counts. You're doing great! 💚"
                </p>
                <Button variant="outline" className="w-full">
                  Chat Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
