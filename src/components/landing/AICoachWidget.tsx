import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

interface AICoachWidgetProps {
  className?: string;
}

export function AICoachWidget({ className }: AICoachWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className={cn("z-20 max-w-[280px]", className)}
      >
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-indigo-100 dark:border-indigo-900 p-4 rounded-2xl shadow-xl">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-sm border hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Hi! I'm your AI Coach</h4>
              <p className="text-xs text-muted-foreground mb-3 leading-snug">
                I can help you find your financial personality type. Want to try?
              </p>
              <Button 
                size="sm" 
                variant="default"
                className="w-full text-xs h-7 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => navigate("/soul-scan")}
              >
                Start Soul Scan <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* Speech bubble tail */}
          <div className="absolute bottom-4 -left-2 w-4 h-4 bg-white/90 dark:bg-gray-800/90 border-b border-l border-indigo-100 dark:border-indigo-900 transform rotate-45" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
