import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { Heart, TrendingUp, Users, Target, Sparkles, Trophy, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export function DashboardHeader({ onSignOut }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FinSoul" className="h-8 w-8 cursor-pointer hover:scale-110 transition-transform" onClick={() => navigate("/")} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">FinSoul</h1>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="hover:bg-green-50 dark:hover:bg-green-900/20">
            <Heart className="mr-2 h-4 w-4 text-green-500" />
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigate("/investments")} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
            Investments
          </Button>
          <Button variant="ghost" onClick={() => navigate("/community")} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <Users className="mr-2 h-4 w-4 text-purple-500" />
            Community
          </Button>
          <Button variant="ghost" onClick={() => navigate("/calculators")} className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
            <Target className="mr-2 h-4 w-4 text-orange-500" />
            Calculators
          </Button>
          <Button variant="ghost" onClick={() => navigate("/astrology")} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
            <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
            Astrology
          </Button>
          <Button variant="ghost" onClick={() => navigate("/achievements")} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
            Achievements
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <ThemeToggle />
          <ShareButtons 
            title="Check out my Soul Finance Dashboard!"
            description="I'm tracking my financial journey with Soul Finance - discover your financial archetype too!"
            hashtags={["FinancialWellness", "PersonalFinance", "FinTech"]}
          />
          <Button variant="ghost" onClick={onSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}