import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bot, Sparkles, Heart, TrendingUp, Users, Target, Trophy } from "lucide-react";

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to Your Dashboard! 🎉",
    description: "Let me show you around your financial soul companion. I'm here to help you understand everything!",
    icon: <Bot className="h-12 w-12 text-purple-500" />,
  },
  {
    title: "Meet Your AI Coach 🤖",
    description: "Your AI Coach is available 24/7 to provide personalized financial guidance. It understands your unique financial personality and offers compassionate, context-aware advice tailored just for you. Click the 'Start Conversation' button anytime to chat!",
    icon: <Sparkles className="h-12 w-12 text-indigo-500" />,
  },
  {
    title: "Track Your Peace Meter 💚",
    description: "Your Peace Meter reflects your emotional relationship with money. It's calculated based on your financial fears and dreams. Keep nurturing it through mindful financial decisions!",
    icon: <Heart className="h-12 w-12 text-pink-500" />,
  },
  {
    title: "Investments Page 📈",
    description: "Discover values-aligned investment opportunities matched to your financial archetype. Track your portfolio, add investments, and monitor your financial growth in real-time.",
    icon: <TrendingUp className="h-12 w-12 text-green-500" />,
  },
  {
    title: "Community Circles 👥",
    description: "Join or create financial circles to connect with like-minded individuals. Share experiences, learn from others, and grow together on your financial journey.",
    icon: <Users className="h-12 w-12 text-blue-500" />,
  },
  {
    title: "Financial Calculators 🧮",
    description: "Access powerful tools like SIP, EMI, and Retirement calculators to plan your financial future with confidence and clarity.",
    icon: <Target className="h-12 w-12 text-orange-500" />,
  },
  {
    title: "Achievements & Gamification 🏆",
    description: "Earn points and unlock achievements as you progress on your financial journey. Track your level, compete on the leaderboard, and celebrate your milestones!",
    icon: <Trophy className="h-12 w-12 text-yellow-500" />,
  },
];

export function TutorialDialog({ open, onOpenChange, currentStep, onNextStep, onPrevStep }: TutorialDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                duration: 0.5 
              }}
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {tutorialSteps[currentStep]?.icon}
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            key={`title-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <DialogTitle className="text-2xl text-center">
              {tutorialSteps[currentStep]?.title}
            </DialogTitle>
          </motion.div>
          <motion.div
            key={`desc-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <DialogDescription className="text-center text-base leading-relaxed pt-4">
              {tutorialSteps[currentStep]?.description}
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={onPrevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Skip
            </Button>
            <Button onClick={onNextStep}>
              {currentStep === tutorialSteps.length - 1 ? "Get Started!" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
