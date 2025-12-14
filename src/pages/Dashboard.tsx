import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AIChatDialog } from "@/components/AIChatDialog";
import { CelebrationSystem, CelebrationType } from "@/components/CelebrationSystem";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { BookHeart, MessageCircle, Sparkles, Target, TrendingUp, Calendar, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TutorialDialog } from "@/components/dashboard/TutorialDialog";
import { PeaceMeterCard } from "@/components/dashboard/PeaceMeterCard";
import { ValuesCard } from "@/components/dashboard/ValuesCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { BackToTop } from "@/components/ui/back-to-top";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, user, signOut } = useAuth();
  const [journalNote, setJournalNote] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalCurrentAmount, setGoalCurrentAmount] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [goalCategory, setGoalCategory] = useState("savings");
  const [celebrationType, setCelebrationType] = useState<CelebrationType | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | undefined>();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const lifeGoals = useQuery(api.lifeGoals.getUserLifeGoals);
  const moodJournals = useQuery(api.moodJournals.getUserMoodJournals, { limit: 5 });
  const createMoodEntry = useMutation(api.moodJournals.createMoodEntry);
  const createLifeGoal = useMutation(api.lifeGoals.createLifeGoal);
  const userProfile = useQuery(api.profile.getProfile);

  const userCurrency = userProfile?.currency ?? "INR";

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

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("dashboard_tutorial_seen");
    if (!hasSeenTutorial && user && userProfile !== undefined) {
      setShowTutorial(true);
      localStorage.setItem("dashboard_tutorial_seen", "true");
    }
  }, [user, userProfile]);

  const handleNextStep = () => {
    if (tutorialStep < 6) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const handlePrevStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

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
      const result = await createMoodEntry({
        date: new Date().toISOString().split("T")[0] as string,
        mood: mood.label,
        emoji: mood.emoji,
        note: journalNote,
        peaceMeterScore: user?.peaceMeter || 50,
      });

      toast.success("Mood saved! 💚");
      setJournalNote("");
      setSelectedMood("");

      if (result.shouldCelebrate) {
        setCelebrationType("mood_streak");
        setCelebrationMessage(`${result.streakCount} day streak! Keep it up! 🔥`);
        setShowCelebration(true);
      }
    } catch (error) {
      toast.error("Failed to save mood");
    }
  };

  const handleAddGoal = async () => {
    if (!goalTitle.trim() || !goalAmount || !goalDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const result = await createLifeGoal({
        title: goalTitle,
        targetAmount: Number(goalAmount),
        currentAmount: Number(goalCurrentAmount) || 0,
        targetDate: goalDate,
        category: goalCategory,
        priority: 1,
      });
      
      toast.success("Goal added! 🎯");
      setIsAddGoalOpen(false);
      setGoalTitle("");
      setGoalAmount("");
      setGoalCurrentAmount("");
      setGoalDate("");
      setGoalCategory("savings");

      if (result.shouldCelebrate) {
        setCelebrationType("first_goal");
        setShowCelebration(true);
      }
    } catch (error) {
      toast.error("Failed to add goal");
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  if (authLoading || !user || userProfile === undefined) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <AnimatedBackground variant="subtle" />
      
      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => {
          setShowTutorial(true);
          setTutorialStep(0);
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all"
        aria-label="Show tutorial"
        title="Need help? Click for a guided tour!"
      >
        <HelpCircle className="h-6 w-6" />
      </motion.button>

      {/* Tutorial Dialog */}
      <TutorialDialog
        open={showTutorial}
        onOpenChange={setShowTutorial}
        currentStep={tutorialStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
      />

      {/* Header */}
      <DashboardHeader onSignOut={signOut} />

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
          <PeaceMeterCard peaceMeter={user.peaceMeter || 50} />

          {/* Values Tracker */}
          <ValuesCard topValues={user.topValues} />

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
                    {lifeGoals.slice(0, 3).map((goal) => {
                      const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);

                      return (
                        <div key={goal._id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{goal.title}</span>
                            <span className="text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No goals yet. Let's create some!</p>
                )}
                <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => setIsAddGoalOpen(true)}>
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Money Mood Journal - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 lg:col-span-2"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookHeart className="text-purple-500" />
                  Money Mood Journal
                </CardTitle>
                <CardDescription>Track your financial emotions and build awareness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Mood Entry */}
                <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">How are you feeling about money today?</h4>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {moods.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={selectedMood === mood.value ? "default" : "outline"}
                        size="lg"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`text-2xl transition-all ${
                          selectedMood === mood.value ? "scale-110 shadow-lg" : "hover:scale-105"
                        }`}
                      >
                        {mood.emoji}
                      </Button>
                    ))}
                  </div>
                  {selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3"
                    >
                      <p className="text-sm text-center font-medium">
                        You're feeling {moods.find((m) => m.value === selectedMood)?.label.toLowerCase()} about money
                      </p>
                      <Textarea
                        placeholder="What's on your mind? Share your thoughts... (optional)"
                        value={journalNote}
                        onChange={(e) => setJournalNote(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <Button onClick={handleSaveMood} className="w-full">
                        <BookHeart className="mr-2 h-4 w-4" />
                        Save Today's Mood
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Recent Mood History */}
                {moodJournals && moodJournals.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      Recent Entries
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {moodJournals.map((entry, index) => (
                        <motion.div
                          key={entry._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-2xl">{entry.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm">{entry.mood}</span>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            {entry.note && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {entry.note}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mood Insights */}
                {moodJournals && moodJournals.length > 0 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      <strong>Insight:</strong> You've logged {moodJournals.length} mood{moodJournals.length > 1 ? "s" : ""} recently. 
                      Tracking your financial emotions helps build awareness and peace. Keep it up! 💚
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Coach - Enhanced and Enlarged */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-indigo-500" />
                  </motion.div>
                  AI Coach
                </CardTitle>
                <CardDescription className="text-base">Your 24/7 financial companion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-2">💚 Today's Insight</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "Remember, every small step counts. You're doing great! Your Peace Meter shows you're on the right track. Keep nurturing your financial soul."
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <MessageCircle className="mr-2 h-3 w-3" />
                      Ask Question
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs"
                      onClick={() => setIsChatOpen(true)}
                    >
                      <Target className="mr-2 h-3 w-3" />
                      Goal Advice
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsChatOpen(true)} 
                  className="w-full h-12 text-base font-semibold group"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Conversation
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                  AI Coach is online and ready to help
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Life Goal</DialogTitle>
            <DialogDescription>
              Set a financial goal and track your progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Goal Title *</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Buy a house"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="goal-amount">Target Amount ({userCurrency}) *</Label>
              <Input
                id="goal-amount"
                type="number"
                placeholder={`e.g., ${userCurrency === "INR" ? "5000000" : userCurrency === "USD" ? "60000" : "50000"}`}
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="goal-current">Current Amount ({userCurrency})</Label>
              <Input
                id="goal-current"
                type="number"
                placeholder={`e.g., ${userCurrency === "INR" ? "500000" : userCurrency === "USD" ? "6000" : "5000"}`}
                value={goalCurrentAmount}
                onChange={(e) => setGoalCurrentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="goal-date">Target Date *</Label>
              <Input
                id="goal-date"
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="goal-category">Category</Label>
              <Select value={goalCategory} onValueChange={setGoalCategory}>
                <SelectTrigger id="goal-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Chat Dialog */}
      <AIChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />

      {/* Celebration System */}
      {celebrationType && (
        <CelebrationSystem
          type={celebrationType}
          show={showCelebration}
          onComplete={() => {
            setShowCelebration(false);
            setCelebrationType(null);
            setCelebrationMessage(undefined);
          }}
          customMessage={celebrationMessage}
        />
      )}
    </div>
  );
}