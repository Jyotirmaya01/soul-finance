import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export function AICoachPreviewSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="container mx-auto px-4 py-20 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-12 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 relative overflow-hidden">
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-12 w-12 text-indigo-500" />
                </motion.div>
                <h2 className="text-4xl font-bold">Meet Your AI Coach</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Get personalized financial guidance 24/7. Our AI Coach understands your unique financial personality and provides compassionate, context-aware advice tailored just for you.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Personalized financial guidance",
                  "24/7 availability",
                  "Understands your archetype",
                  "Compassionate & supportive"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="group"
              >
                <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {isAuthenticated ? "Chat with AI Coach" : "Get Started"}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">AI Coach</div>
                      <div className="text-xs text-muted-foreground">Always here to help</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">Hi! I'm your AI Coach. How can I help you with your financial journey today? 💚</p>
                    </div>
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg ml-8">
                      <p className="text-sm">How do I start investing?</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">Great question! Let's explore investment options that align with your values and financial goals...</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                    Online now
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
