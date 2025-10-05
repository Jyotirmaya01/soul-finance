import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Leaf, Shield, TrendingUp, TrendingDown, Plus, Trash2, DollarSign, PieChart, BarChart3, Sparkles, Target, Award, BookOpen, Filter } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import { PieChart as RechartsPie, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export default function Investments() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const investments = useQuery(api.investments.getMatchingInvestments);
  const portfolio = useQuery(api.portfolio.getUserPortfolio);
  const portfolioStats = useQuery(api.portfolio.getPortfolioStats);
  const addToPortfolio = useMutation(api.portfolio.addToPortfolio);
  const addCustomInvestment = useMutation(api.portfolio.addCustomInvestment);
  const updatePortfolioEntry = useMutation(api.portfolio.updatePortfolioEntry);
  const removeFromPortfolio = useMutation(api.portfolio.removeFromPortfolio);

  const [activeTab, setActiveTab] = useState("available");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Custom investment form state
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customCurrentValue, setCustomCurrentValue] = useState("");
  const [customPurchaseDate, setCustomPurchaseDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T');
    return today[0] || new Date().toISOString().substring(0, 10);
  });
  const [customQuantity, setCustomQuantity] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Calculate investment stats
  const investmentStats = useMemo(() => {
    if (!investments || investments.length === 0) {
      return {
        totalCount: 0,
        categories: [],
        avgESGScore: 0,
        minInvestmentRange: { min: 0, max: 0 },
      };
    }

    const categories = [...new Set(investments.map(inv => inv.category))];
    const avgESGScore = Math.round(
      investments.reduce((sum, inv) => sum + inv.esgScore, 0) / investments.length
    );
    const minInvestments = investments.map(inv => inv.minInvestment);
    const minInvestmentRange = {
      min: Math.min(...minInvestments),
      max: Math.max(...minInvestments),
    };

    return {
      totalCount: investments.length,
      categories,
      avgESGScore,
      minInvestmentRange,
    };
  }, [investments]);

  // Filter investments by category
  const filteredInvestments = useMemo(() => {
    if (!investments) return [];
    if (!selectedCategory) return investments;
    return investments.filter(inv => inv.category === selectedCategory);
  }, [investments, selectedCategory]);

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-green-600 bg-green-100 dark:bg-green-900/30";
    if (risk === "Medium") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    return "text-red-600 bg-red-100 dark:bg-red-900/30";
  };

  const handleAddToPortfolio = async () => {
    if (!selectedInvestment) {
      toast.error("No investment selected");
      return;
    }

    if (!amount || amount.trim() === "") {
      toast.error("Please enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    if (amountNum < selectedInvestment.minInvestment) {
      toast.error(`Minimum investment is $${selectedInvestment.minInvestment}`);
      return;
    }

    if (quantity && quantity.trim() !== "") {
      const quantityNum = parseFloat(quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error("Please enter a valid positive quantity");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await addToPortfolio({
        investmentId: selectedInvestment._id,
        investmentName: selectedInvestment.name,
        amountInvested: amountNum,
        quantity: quantity && quantity.trim() !== "" ? parseFloat(quantity) : undefined,
        notes: notes && notes.trim() !== "" ? notes.trim() : undefined,
      });
      toast.success("Investment added to portfolio! 💚");
      setIsAddDialogOpen(false);
      setAmount("");
      setQuantity("");
      setNotes("");
      setSelectedInvestment(null);
      setActiveTab("portfolio");
    } catch (error) {
      console.error("Failed to add investment:", error);
      toast.error("Failed to add investment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromPortfolio = async (portfolioId: Id<"userPortfolio">) => {
    if (!portfolioId) {
      toast.error("Invalid portfolio item");
      return;
    }

    try {
      await removeFromPortfolio({ portfolioId });
      toast.success("Investment removed from portfolio");
    } catch (error) {
      console.error("Failed to remove investment:", error);
      toast.error("Failed to remove investment. Please try again.");
    }
  };

  const handleAddCustomInvestment = async () => {
    if (!customName || customName.trim() === "") {
      toast.error("Please enter an investment name");
      return;
    }

    if (!customAmount || customAmount.trim() === "") {
      toast.error("Please enter the amount invested");
      return;
    }

    const amountNum = parseFloat(customAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    if (!customCurrentValue || customCurrentValue.trim() === "") {
      toast.error("Please enter the current value");
      return;
    }

    const currentValueNum = parseFloat(customCurrentValue);
    if (isNaN(currentValueNum) || currentValueNum < 0) {
      toast.error("Please enter a valid current value");
      return;
    }

    if (customQuantity && customQuantity.trim() !== "") {
      const quantityNum = parseFloat(customQuantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error("Please enter a valid positive quantity");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await addCustomInvestment({
        investmentName: customName.trim(),
        category: customCategory && customCategory.trim() !== "" ? customCategory.trim() : undefined,
        amountInvested: amountNum,
        currentValue: currentValueNum,
        purchaseDate: customPurchaseDate,
        quantity: customQuantity && customQuantity.trim() !== "" ? parseFloat(customQuantity) : undefined,
        notes: customNotes && customNotes.trim() !== "" ? customNotes.trim() : undefined,
      });
      toast.success("Custom investment added to portfolio! 💚");
      setIsCustomDialogOpen(false);
      setCustomName("");
      setCustomCategory("");
      setCustomAmount("");
      setCustomCurrentValue("");
      const today = new Date().toISOString().split('T');
      setCustomPurchaseDate(today[0] || new Date().toISOString().substring(0, 10));
      setCustomQuantity("");
      setCustomNotes("");
    } catch (error) {
      console.error("Failed to add custom investment:", error);
      toast.error("Failed to add custom investment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setCustomCurrentValue(entry.currentValue.toString());
    setCustomQuantity(entry.quantity ? entry.quantity.toString() : "");
    setCustomNotes(entry.notes || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry) {
      toast.error("No entry selected");
      return;
    }

    if (!customCurrentValue || customCurrentValue.trim() === "") {
      toast.error("Please enter the current value");
      return;
    }

    const currentValueNum = parseFloat(customCurrentValue);
    if (isNaN(currentValueNum) || currentValueNum < 0) {
      toast.error("Please enter a valid current value");
      return;
    }

    if (customQuantity && customQuantity.trim() !== "") {
      const quantityNum = parseFloat(customQuantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error("Please enter a valid positive quantity");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await updatePortfolioEntry({
        portfolioId: editingEntry._id,
        currentValue: currentValueNum,
        quantity: customQuantity && customQuantity.trim() !== "" ? parseFloat(customQuantity) : undefined,
        notes: customNotes && customNotes.trim() !== "" ? customNotes.trim() : undefined,
      });
      toast.success("Investment updated successfully! 💚");
      setIsEditDialogOpen(false);
      setEditingEntry(null);
      setCustomCurrentValue("");
      setCustomQuantity("");
      setCustomNotes("");
    } catch (error) {
      console.error("Failed to update investment:", error);
      toast.error("Failed to update investment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add chart data calculations
  const chartData = useMemo(() => {
    if (!portfolio || portfolio.length === 0) {
      return {
        allocationData: [],
        performanceData: [],
        individualPerformanceData: [],
      };
    }

    // Portfolio Allocation Data (Pie Chart)
    const allocationData = portfolio.map((item) => ({
      name: item.investmentName,
      value: item.amountInvested,
      currentValue: item.currentValue,
    }));

    // Individual Performance Data (Bar Chart)
    const individualPerformanceData = portfolio.map((item) => {
      const gainLoss = item.currentValue - item.amountInvested;
      const percentChange = item.amountInvested > 0 ? (gainLoss / item.amountInvested) * 100 : 0;
      
      return {
        name: item.investmentName.length > 15 
          ? item.investmentName.substring(0, 15) + "..." 
          : item.investmentName,
        gainLoss: parseFloat(gainLoss.toFixed(2)),
        percentChange: parseFloat(percentChange.toFixed(2)),
        fill: gainLoss >= 0 ? "#10b981" : "#ef4444",
      };
    }).sort((a, b) => b.gainLoss - a.gainLoss);

    // Performance Over Time Data (Line Chart)
    // Since we don't have historical data yet, we'll create a simple projection
    const performanceData = portfolio.map((item) => {
      const date = new Date(item.purchaseDate);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        invested: item.amountInvested,
        current: item.currentValue,
        timestamp: date.getTime(),
      };
    }).sort((a, b) => a.timestamp - b.timestamp);

    // Aggregate cumulative values
    let cumulativeInvested = 0;
    let cumulativeCurrent = 0;
    const aggregatedPerformance = performanceData.map((item) => {
      cumulativeInvested += item.invested;
      cumulativeCurrent += item.current;
      return {
        date: item.date,
        invested: parseFloat(cumulativeInvested.toFixed(2)),
        current: parseFloat(cumulativeCurrent.toFixed(2)),
      };
    });

    return {
      allocationData,
      performanceData: aggregatedPerformance,
      individualPerformanceData,
    };
  }, [portfolio]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  if (authLoading) {
    return <LoadingScreen message="Finding investments for you..." />;
  }

  // Safe access to portfolio stats with defaults
  const stats = portfolioStats || {
    totalInvested: 0,
    currentValue: 0,
    totalGainLoss: 0,
    percentageChange: 0,
    investmentCount: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">Investments</h1>
          <ProfileDropdown />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="available">
              <Leaf className="h-4 w-4 mr-2" />
              Available
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <PieChart className="h-4 w-4 mr-2" />
              My Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Available Investments Tab */}
          <TabsContent value="available" className="space-y-6">
            {/* Hero Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-8 text-white"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-6 w-6" />
                  <h2 className="text-3xl font-bold">Investments That Match Your Soul</h2>
                </div>
                <p className="text-lg mb-4 max-w-3xl">
                  Discover curated investment opportunities aligned with your values and financial archetype. 
                  Every investment is carefully selected to match your {user?.archetype?.replace(/_/g, " ") || "unique"} profile.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Target className="h-5 w-5" />
                    <span className="font-semibold">Values-Aligned</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Leaf className="h-5 w-5" />
                    <span className="font-semibold">ESG Focused</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Award className="h-5 w-5" />
                    <span className="font-semibold">Curated Selection</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Quick Stats */}
            {investments && investments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{investmentStats.totalCount}</div>
                      <div className="text-sm text-muted-foreground mt-1">Available Investments</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{investmentStats.categories.length}</div>
                      <div className="text-sm text-muted-foreground mt-1">Investment Categories</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{investmentStats.avgESGScore}</div>
                      <div className="text-sm text-muted-foreground mt-1">Avg ESG Score</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        ${investmentStats.minInvestmentRange.min}+
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Starting From</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Category Filters */}
            {investments && investments.length > 0 && investmentStats.categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      <CardTitle>Filter by Category</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedCategory === null ? "default" : "outline"}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedCategory(null)}
                      >
                        All ({investments.length})
                      </Badge>
                      {investmentStats.categories.map((category) => {
                        const count = investments.filter(inv => inv.category === category).length;
                        return (
                          <Badge
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category} ({count})
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Investment Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-blue-900 dark:text-blue-100">Investment Wisdom</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
                        <h4 className="font-semibold">Diversify</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Spread investments across different categories to reduce risk and maximize returns.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">2</div>
                        <h4 className="font-semibold">ESG Matters</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        High ESG scores indicate sustainable practices that often lead to long-term stability.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">3</div>
                        <h4 className="font-semibold">Match Your Values</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Invest in what you believe in. Values-aligned investing creates meaningful impact.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Cards */}
            {!investments ? (
              <div className="text-center py-12">
                <LoadingScreen message="Loading investments..." />
              </div>
            ) : filteredInvestments.length === 0 ? (
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <CardContent className="py-12 text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedCategory ? `No ${selectedCategory} Investments Available` : "No Investments Available"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory 
                      ? "Try selecting a different category to see more options."
                      : "Check back soon for new investment opportunities"}
                  </p>
                  {selectedCategory && (
                    <Button onClick={() => setSelectedCategory(null)} variant="outline">
                      View All Investments
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvestments.map((investment, index) => (
                  <motion.div
                    key={investment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{investment.name}</CardTitle>
                          {investment.isPremium && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{investment.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div className="space-y-4 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">ESG Score</span>
                            <div className="flex items-center gap-1">
                              <Leaf className="h-4 w-4 text-green-500" />
                              <span className="font-semibold">{investment.esgScore}/100</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Expected Return</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold">{investment.expectedReturn}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Risk Level</span>
                            <Badge className={getRiskColor(investment.riskLevel)}>
                              <Shield className="h-3 w-3 mr-1" />
                              {investment.riskLevel}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Min. Investment</span>
                            <span className="font-semibold">${investment.minInvestment}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="p-3 bg-accent rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Why This Matches You</p>
                            <p className="text-sm flex items-center gap-1">
                              <Heart className="h-3 w-3 text-pink-500" fill="currentColor" />
                              Aligned with your {user?.archetype?.replace(/_/g, " ") || "financial"} values
                            </p>
                          </div>
                          <Button
                            className="w-full"
                            variant="default"
                            onClick={() => {
                              setSelectedInvestment(investment);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Portfolio
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Portfolio Tab */}
          <TabsContent value="portfolio">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Portfolio Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold">${stats.totalInvested.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">${stats.currentValue.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {stats.totalGainLoss >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs(stats.totalGainLoss).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Return %</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      <span className={`text-2xl font-bold ${stats.percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {stats.percentageChange >= 0 ? "+" : ""}{stats.percentageChange.toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Charts Section */}
              {portfolio && portfolio.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Portfolio Performance</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Portfolio Allocation Pie Chart */}
                    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                      <CardHeader>
                        <CardTitle>Portfolio Allocation</CardTitle>
                        <CardDescription>Distribution of investments by amount invested</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={chartData.allocationData.reduce((acc, item, index) => ({
                            ...acc,
                            [item.name]: {
                              label: item.name,
                              color: COLORS[index % COLORS.length],
                            },
                          }), {})}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                              <Pie
                                data={chartData.allocationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {chartData.allocationData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </RechartsPie>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Individual Investment Performance Bar Chart */}
                    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                      <CardHeader>
                        <CardTitle>Investment Performance</CardTitle>
                        <CardDescription>Gain/Loss comparison across investments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            gainLoss: {
                              label: "Gain/Loss",
                              color: "#10b981",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.individualPerformanceData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="name" 
                                className="text-xs"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis className="text-xs" />
                              <ChartTooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length > 0 && payload[0] && payload[0].payload) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid gap-2">
                                          <div className="font-medium">{data.name}</div>
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-muted-foreground">Gain/Loss:</span>
                                            <span className={`font-bold ${data.gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                                              ${data.gainLoss}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-muted-foreground">Change:</span>
                                            <span className={`font-bold ${data.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                              {data.percentChange >= 0 ? "+" : ""}{data.percentChange}%
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar dataKey="gainLoss" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Over Time Line Chart */}
                  {chartData.performanceData.length > 0 && (
                    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                      <CardHeader>
                        <CardTitle>Portfolio Value Over Time</CardTitle>
                        <CardDescription>Cumulative invested amount vs current value</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            invested: {
                              label: "Invested",
                              color: "#3b82f6",
                            },
                            current: {
                              label: "Current Value",
                              color: "#10b981",
                            },
                          }}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.performanceData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="date" className="text-xs" />
                              <YAxis className="text-xs" />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="invested" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ fill: "#3b82f6" }}
                                name="Invested"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="current" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={{ fill: "#10b981" }}
                                name="Current Value"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Portfolio Holdings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Your Holdings ({stats.investmentCount})</h3>
                  <Button onClick={() => setIsCustomDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Custom Investment
                  </Button>
                </div>
                {!portfolio ? (
                  <div className="text-center py-12">
                    <LoadingScreen message="Loading portfolio..." />
                  </div>
                ) : portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolio.map((item, index) => {
                      const gainLoss = item.currentValue - item.amountInvested;
                      const percentChange = item.amountInvested > 0 ? (gainLoss / item.amountInvested) * 100 : 0;
                      
                      return (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg">{item.investmentName}</CardTitle>
                                  {item.isCustom && (
                                    <Badge variant="outline" className="mt-1 text-xs">
                                      Custom Investment
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditEntry(item)}
                                    className="h-8 w-8 text-blue-500 hover:text-blue-700"
                                  >
                                    <TrendingUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveFromPortfolio(item._id)}
                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardDescription>
                                Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Invested</span>
                                <span className="font-semibold">${item.amountInvested.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Value</span>
                                <span className="font-semibold">${item.currentValue.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Gain/Loss</span>
                                <span className={`font-semibold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {gainLoss >= 0 ? "+" : ""}${gainLoss.toFixed(2)} ({percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%)
                                </span>
                              </div>
                              {item.quantity && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Quantity</span>
                                  <span className="font-semibold">{item.quantity}</span>
                                </div>
                              )}
                              {item.notes && (
                                <div className="pt-2 border-t">
                                  <p className="text-xs text-muted-foreground">{item.notes}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                    <CardContent className="py-12 text-center">
                      <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your portfolio by adding investments from the Available tab
                      </p>
                      <Button onClick={() => setActiveTab("available")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Browse Investments
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add to Portfolio Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Portfolio</DialogTitle>
            <DialogDescription>
              Add {selectedInvestment?.name || "this investment"} to your investment portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Min. $${selectedInvestment?.minInvestment || 0}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={selectedInvestment?.minInvestment || 0}
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of units"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this investment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddToPortfolio} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add to Portfolio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Investment Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Custom Investment</DialogTitle>
            <DialogDescription>
              Track investments you've made on other platforms or custom assets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customName">Investment Name *</Label>
              <Input
                id="customName"
                placeholder="e.g., Apple Stock, Bitcoin, Real Estate"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customCategory">Category (Optional)</Label>
              <Input
                id="customCategory"
                placeholder="e.g., Stocks, Crypto, Real Estate"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customAmount">Amount Invested *</Label>
                <Input
                  id="customAmount"
                  type="number"
                  placeholder="$0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customCurrentValue">Current Value *</Label>
                <Input
                  id="customCurrentValue"
                  type="number"
                  placeholder="$0.00"
                  value={customCurrentValue}
                  onChange={(e) => setCustomCurrentValue(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customPurchaseDate">Purchase Date *</Label>
                <Input
                  id="customPurchaseDate"
                  type="date"
                  value={customPurchaseDate}
                  onChange={(e) => setCustomPurchaseDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customQuantity">Quantity (Optional)</Label>
                <Input
                  id="customQuantity"
                  type="number"
                  placeholder="Number of units"
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customNotes">Notes (Optional)</Label>
              <Textarea
                id="customNotes"
                placeholder="Add any notes about this investment..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomInvestment} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Portfolio Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Investment</DialogTitle>
            <DialogDescription>
              Update the current value and details for {editingEntry?.investmentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCurrentValue">Current Value *</Label>
              <Input
                id="editCurrentValue"
                type="number"
                placeholder="$0.00"
                value={customCurrentValue}
                onChange={(e) => setCustomCurrentValue(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editQuantity">Quantity (Optional)</Label>
              <Input
                id="editQuantity"
                type="number"
                placeholder="Number of units"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes (Optional)</Label>
              <Textarea
                id="editNotes"
                placeholder="Add any notes about this investment..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEntry} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}