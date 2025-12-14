import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingScreen } from "@/components/LoadingScreen";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Moon, Sparkles, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FloatingAIChatButton } from "@/components/FloatingAIChatButton";

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export default function FinancialAstrology() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const [selectedZodiac, setSelectedZodiac] = useState<string>(user?.zodiacSign || "");
  const [isLoading, setIsLoading] = useState(false);
  const [horoscope, setHoroscope] = useState<string>("");
  const [bestDays, setBestDays] = useState<number[]>([]);
  const [bestDaysInsight, setBestDaysInsight] = useState<string>("");
  const [cosmicInsights, setCosmicInsights] = useState<string>("");

  const generateHoroscope = useAction(api.astrology.generateDailyHoroscope);
  const generateBestDays = useAction(api.astrology.generateBestDays);
  const generateCosmicInsights = useAction(api.astrology.generateCosmicInsights);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedZodiac) {
      loadAstrologyData();
    }
  }, [selectedZodiac]);

  const loadAstrologyData = async () => {
    if (!selectedZodiac) return;
    
    setIsLoading(true);
    try {
      const [horoscopeResult, daysResult, insightsResult] = await Promise.all([
        generateHoroscope({ zodiacSign: selectedZodiac }),
        generateBestDays({ zodiacSign: selectedZodiac }),
        generateCosmicInsights({ zodiacSign: selectedZodiac }),
      ]);

      if (horoscopeResult.success && horoscopeResult.horoscope) {
        setHoroscope(horoscopeResult.horoscope);
      }

      if (daysResult.success && daysResult.bestDays) {
        setBestDays(daysResult.bestDays);
        setBestDaysInsight(daysResult.insights || "");
      }

      if (insightsResult.success && insightsResult.insights) {
        setCosmicInsights(insightsResult.insights);
      }
    } catch (error) {
      console.error("Error loading astrology data:", error);
      toast.error("Unable to load cosmic guidance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentMonthDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const isToday = (day: number) => {
    return day === new Date().getDate();
  };

  const isFavorableDay = (day: number) => {
    return bestDays.includes(day);
  };

  if (authLoading || !user) {
    return <LoadingScreen message="Consulting the stars..." />;
  }

  if (isLoading && !horoscope) {
    return <LoadingScreen message="The cosmos is aligning..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <AnimatedBackground variant="nebula" />
      <FloatingAIChatButton />

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Moon className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl font-bold">Financial Astrology</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 hidden sm:flex">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Daily Guidance</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Zodiac Selector */}
        {!selectedZodiac && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-purple-500" />
                  Select Your Zodiac Sign
                </CardTitle>
                <CardDescription>Choose your sign to receive personalized cosmic financial guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedZodiac} onValueChange={setSelectedZodiac}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your zodiac sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {zodiacSigns.map((sign) => (
                      <SelectItem key={sign} value={sign}>
                        {sign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedZodiac && (
          <>
            {/* Zodiac Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                {selectedZodiac} Financial Forecast
              </h2>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              <Button variant="ghost" size="sm" onClick={() => setSelectedZodiac("")} className="mt-2">
                Change Sign
              </Button>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="horoscope" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                <TabsTrigger value="horoscope">
                  <Moon className="h-4 w-4 mr-2" />
                  Horoscope
                </TabsTrigger>
                <TabsTrigger value="bestdays">
                  <Calendar className="h-4 w-4 mr-2" />
                  Best Days
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>

              {/* Money Horoscope */}
              <TabsContent value="horoscope">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Moon className="text-purple-500" />
                        Today's Money Horoscope
                      </CardTitle>
                      <CardDescription>Financial guidance based on cosmic energies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed">{horoscope}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Best Days to Invest */}
              <TabsContent value="bestdays">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="text-yellow-500" />
                        Favorable Days This Month
                      </CardTitle>
                      <CardDescription>Days aligned with positive financial energies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {bestDays.map((day) => (
                          <div
                            key={day}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      {bestDaysInsight && (
                        <p className="text-center text-muted-foreground mt-4">{bestDaysInsight}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Personal Finance Calendar */}
              <TabsContent value="calendar">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 max-w-4xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="text-blue-500" />
                        {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} Calendar
                      </CardTitle>
                      <CardDescription>
                        <span className="inline-flex items-center gap-2 mr-4">
                          <span className="w-3 h-3 rounded-full bg-green-500"></span>
                          Favorable Days
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                          Today
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                            {day}
                          </div>
                        ))}
                        {getCurrentMonthDays().map((day) => (
                          <div
                            key={day}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                              isToday(day)
                                ? "bg-blue-500 text-white shadow-lg scale-110"
                                : isFavorableDay(day)
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-500"
                                : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Cosmic Spending Insights */}
              <TabsContent value="insights">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-pink-500" />
                        Cosmic Spending Insights
                      </CardTitle>
                      <CardDescription>Understanding your financial patterns through lunar cycles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed">{cosmicInsights}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <Card className="backdrop-blur-sm bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                ⚠️ <strong>Disclaimer:</strong> This feature is for entertainment and reflection purposes only. We do not recommend making investment decisions based solely on astrological guidance. Always consult with qualified financial advisors and conduct thorough research before making any financial decisions. Past performance and astrological predictions are not indicators of future results. FinSoul is not responsible for any financial decisions made based on this content.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}