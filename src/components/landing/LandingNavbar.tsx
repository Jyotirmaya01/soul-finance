import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function LandingNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img 
            src="/logo.svg" 
            alt="FinSoul" 
            className="h-8 w-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          <span className="text-xl font-bold">FinSoul</span>
        </motion.div>
        <div className="hidden md:flex items-center gap-6">
          {["features", "about", "reviews", "contact"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item}`}
              className="text-sm hover:text-primary transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.1, color: "var(--color-primary)" }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </motion.a>
          ))}
          <motion.a
            href="/blog"
            className="text-sm hover:text-primary transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1, color: "var(--color-primary)" }}
          >
            Blog
          </motion.a>
          <motion.a
            href="/markets"
            className="text-sm hover:text-primary transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1, color: "var(--color-primary)" }}
          >
            Markets
          </motion.a>
        </div>
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ShareButtons 
            title="Soul Finance - Your Financial Companion"
            description="Discover your financial archetype and build wealth that aligns with your values"
            hashtags={["FinTech", "FinancialWellness", "AI", "PersonalFinance"]}
          />
          <ThemeToggle />
          {isAuthenticated && user ? (
            <Button onClick={() => navigate(user.hasCompletedQuiz ? "/dashboard" : "/soul-scan")}>
              {user.hasCompletedQuiz ? "Dashboard" : "Continue Quiz"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
              <Button onClick={() => navigate("/auth")}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}
