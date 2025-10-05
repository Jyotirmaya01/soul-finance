import { TreeVisualization } from "@/components/TreeVisualization";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Leaf, Shield, Sparkles, Target, Users } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Heart,
      title: "Peace Meter™",
      description: "Track your emotional relationship with money in real-time",
      color: "text-pink-500",
    },
    {
      icon: Sparkles,
      title: "Soul Scan Quiz",
      description: "Discover your unique financial archetype in 5 minutes",
      color: "text-purple-500",
    },
    {
      icon: Target,
      title: "Values-Aligned Goals",
      description: "Set and achieve goals that truly matter to you",
      color: "text-blue-500",
    },
    {
      icon: Leaf,
      title: "Ethical Investments",
      description: "Invest in what you believe in with ESG-rated opportunities",
      color: "text-green-500",
    },
    {
      icon: Users,
      title: "Community Circles",
      description: "Connect with others on similar financial journeys",
      color: "text-indigo-500",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Bank-level security with empathetic, human-first design",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="FinSoul" className="h-8 w-8" />
            <span className="text-xl font-bold">FinSoul</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <Button onClick={() => navigate(user.hasCompletedQuiz ? "/dashboard" : "/soul-scan")}>
                {user.hasCompletedQuiz ? "Dashboard" : "Continue Quiz"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Finally, Finance That Understands You.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              FinSoul is your values-driven financial companion. We blend emotional intelligence with smart money management to help you grow wealth that feels right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Free Soul Scan
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✨ No credit card required • 5-minute setup • Join 10,000+ mindful investors
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <TreeVisualization />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            The Anti-Bank App
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Warm, wise, and wonderfully human. Finance that nurtures your soul, not just your wallet.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all cursor-pointer"
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-sm bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-12 rounded-3xl text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Your Financial Soul Awaits
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands discovering a healthier relationship with money
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Begin Your Journey
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 FinSoul. Made with 💚 for mindful investors.</p>
          <p className="mt-2">Powered by FinSoul • Secured by FinSoul</p>
        </div>
      </footer>
    </div>
  );
}