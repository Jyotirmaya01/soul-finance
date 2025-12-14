import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIChatDialog } from "@/components/AIChatDialog";
import { motion } from "framer-motion";

export function FloatingAIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-2 border-white/20"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="h-6 w-6 animate-pulse" />
          <span className="sr-only">Chat with AI Coach</span>
        </Button>
      </motion.div>
      <AIChatDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
