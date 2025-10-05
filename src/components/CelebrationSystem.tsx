import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Target, Heart, Award } from "lucide-react";

export type CelebrationType = 
  | "goal_milestone" 
  | "mood_streak" 
  | "first_goal" 
  | "peace_meter_up" 
  | "investment_made"
  | "circle_joined"
  | "profile_complete";

interface CelebrationConfig {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  color: string;
  confettiColors: string[];
}

const celebrationConfigs: Record<CelebrationType, CelebrationConfig> = {
  goal_milestone: {
    icon: Target,
    title: "Goal Milestone! 🎯",
    message: "You're making amazing progress!",
    color: "from-green-500 to-emerald-500",
    confettiColors: ["#10b981", "#059669", "#34d399"],
  },
  mood_streak: {
    icon: Heart,
    title: "Mood Streak! 💚",
    message: "You've tracked your mood for 7 days!",
    color: "from-pink-500 to-rose-500",
    confettiColors: ["#ec4899", "#f43f5e", "#fb7185"],
  },
  first_goal: {
    icon: Sparkles,
    title: "First Goal Set! ✨",
    message: "Your financial journey begins!",
    color: "from-purple-500 to-indigo-500",
    confettiColors: ["#a855f7", "#8b5cf6", "#c084fc"],
  },
  peace_meter_up: {
    icon: TrendingUp,
    title: "Peace Meter Rising! 📈",
    message: "Your financial peace is growing!",
    color: "from-blue-500 to-cyan-500",
    confettiColors: ["#3b82f6", "#06b6d4", "#60a5fa"],
  },
  investment_made: {
    icon: Award,
    title: "Investment Made! 💰",
    message: "You're building your future!",
    color: "from-yellow-500 to-orange-500",
    confettiColors: ["#eab308", "#f59e0b", "#fbbf24"],
  },
  circle_joined: {
    icon: Sparkles,
    title: "Circle Joined! 🤝",
    message: "Welcome to the community!",
    color: "from-indigo-500 to-purple-500",
    confettiColors: ["#6366f1", "#8b5cf6", "#a78bfa"],
  },
  profile_complete: {
    icon: Award,
    title: "Profile Complete! 👤",
    message: "You're all set up!",
    color: "from-green-500 to-teal-500",
    confettiColors: ["#10b981", "#14b8a6", "#2dd4bf"],
  },
};

interface CelebrationSystemProps {
  type: CelebrationType;
  show: boolean;
  onComplete?: () => void;
  customMessage?: string;
}

export function CelebrationSystem({ 
  type, 
  show, 
  onComplete,
  customMessage 
}: CelebrationSystemProps) {
  const config = celebrationConfigs[type];

  useEffect(() => {
    if (show) {
      // Trigger confetti
      triggerConfetti(config.confettiColors);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, config.confettiColors, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm"
        >
          <div className={`bg-gradient-to-r ${config.color} p-6 rounded-2xl shadow-2xl text-white`}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <config.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{config.title}</h3>
                <p className="text-sm opacity-90">
                  {customMessage || config.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confetti trigger function
function triggerConfetti(colors: string[]) {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: colors,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

// Hook for easy celebration triggering
export function useCelebration() {
  const celebrate = (type: CelebrationType) => {
    const config = celebrationConfigs[type];
    triggerConfetti(config.confettiColors);
    
    // You can add toast notification here if needed
    return config;
  };

  return { celebrate };
}
