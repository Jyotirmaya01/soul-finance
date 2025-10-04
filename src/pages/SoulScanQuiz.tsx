import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as confetti from "canvas-confetti";

const quizSections = [
  {
    id: "personality",
    title: "Your Personality",
    description: "How do you approach life?",
    options: [
      "I'm a planner who loves structure",
      "I go with the flow",
      "I'm analytical and data-driven",
      "I trust my intuition",
      "I'm collaborative and seek advice",
    ],
  },
  {
    id: "values",
    title: "Your Core Values",
    description: "What matters most to you?",
    options: [
      "Environmental sustainability",
      "Financial freedom",
      "Family and legacy",
      "Personal growth",
      "Community impact",
      "Balance and peace",
      "Adventure and experiences",
    ],
  },
  {
    id: "financialFears",
    title: "Financial Fears",
    description: "What keeps you up at night?",
    options: [
      "Not having enough for retirement",
      "Losing money in investments",
      "Not being able to help loved ones",
      "Missing out on opportunities",
      "Economic uncertainty",
    ],
  },
  {
    id: "financialDreams",
    title: "Financial Dreams",
    description: "What would financial success look like?",
    options: [
      "Early retirement",
      "Owning my dream home",
      "Traveling the world",
      "Starting a business",
      "Leaving a legacy",
      "Living debt-free",
      "Making a difference",
    ],
  },
  {
    id: "spendingTriggers",
    title: "Spending Triggers",
    description: "When do you tend to spend?",
    options: [
      "When I'm stressed",
      "When I'm celebrating",
      "When I see a good deal",
      "When I'm with friends",
      "When I'm bored",
    ],
  },
];

export default function SoulScanQuiz() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    personality: [],
    values: [],
    financialFears: [],
    financialDreams: [],
    spendingTriggers: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSoulScan = useMutation(api.soulScans.submitSoulScan);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.hasCompletedQuiz) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const progress = ((currentSection + 1) / quizSections.length) * 100;
  const section = quizSections[currentSection];

  const toggleAnswer = (option: string) => {
    const sectionAnswers = answers[section.id];
    if (sectionAnswers.includes(option)) {
      setAnswers({
        ...answers,
        [section.id]: sectionAnswers.filter((a) => a !== option),
      });
    } else {
      setAnswers({
        ...answers,
        [section.id]: [...sectionAnswers, option],
      });
    }
  };

  const handleNext = () => {
    if (answers[section.id].length === 0) {
      toast.error("Please select at least one option");
      return;
    }
    if (currentSection < quizSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers[section.id].length === 0) {
      toast.error("Please select at least one option");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitSoulScan({ 
        answers: {
          personality: answers.personality || [],
          values: answers.values || [],
          financialFears: answers.financialFears || [],
          financialDreams: answers.financialDreams || [],
          spendingTriggers: answers.spendingTriggers || [],
        }
      });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("Soul Scan Complete! 🎉");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Failed to submit Soul Scan");
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              Soul Scan
            </h1>
            <span className="text-sm text-muted-foreground">
              {currentSection + 1} of {quizSections.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-2">
            <CardHeader>
              <CardTitle className="text-2xl">{section.title}</CardTitle>
              <CardDescription className="text-base">{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.options.map((option) => (
                <motion.div
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary hover:bg-accent">
                    <Checkbox
                      checked={answers[section.id].includes(option)}
                      onCheckedChange={() => toggleAnswer(option)}
                    />
                    <span className="text-sm leading-relaxed">{option}</span>
                  </label>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentSection < quizSections.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Complete
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}