import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { Heart, TrendingUp, Users, Target, Sparkles, Trophy, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export function DashboardHeader({ onSignOut }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FinSoul" className="h-8 w-8 cursor-pointer" onClick={() => navigate("/")} />
          <h1 className="text-xl font-bold">FinSoul</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <Heart className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigate("/investments")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Investments
          </Button>
          <Button variant="ghost" onClick={() => navigate("/community")}>
            <Users className="mr-2 h-4 w-4" />
            Community
          </Button>
          <Button variant="ghost" onClick={() => navigate("/calculators")}>
            <Target className="mr-2 h-4 w-4" />
            Calculators
          </Button>
          <Button variant="ghost" onClick={() => navigate("/astrology")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Astrology
          </Button>
          <Button variant="ghost" onClick={() => navigate("/achievements")}>
            <Trophy className="mr-2 h-4 w-4" />
            Achievements
          </Button>
          <ShareButtons 
            title="Check out my Soul Finance Dashboard!"
            description="I'm tracking my financial journey with Soul Finance - discover your financial archetype too!"
            hashtags={["FinancialWellness", "PersonalFinance", "FinTech"]}
          />
          <Button variant="ghost" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
