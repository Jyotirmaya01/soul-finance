import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Leaf, Shield, TrendingUp, TrendingDown, Plus, Trash2, DollarSign, PieChart, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

export default function Investments() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const investments = useQuery(api.investments.getMatchingInvestments);
  const portfolio = useQuery(api.portfolio.getUserPortfolio);
  const portfolioStats = useQuery(api.portfolio.getPortfolioStats);
  const addToPortfolio = useMutation(api.portfolio.addToPortfolio);
  const removeFromPortfolio = useMutation(api.portfolio.removeFromPortfolio);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-green-600 bg-green-100 dark:bg-green-900/30";
    if (risk === "Medium") return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    return "text-red-600 bg-red-100 dark:bg-red-900/30";
  };

  const handleAddToPortfolio = async () => {
    if (!selectedInvestment || !amount) {
      toast.error("Please enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amountNum < selectedInvestment.minInvestment) {
      toast.error(`Minimum investment is $${selectedInvestment.minInvestment}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addToPortfolio({
        investmentId: selectedInvestment._id,
        investmentName: selectedInvestment.name,
        amountInvested: amountNum,
        quantity: quantity ? parseFloat(quantity) : undefined,
        notes: notes || undefined,
      });
      toast.success("Investment added to portfolio! 💚");
      setIsAddDialogOpen(false);
      setAmount("");
      setQuantity("");
      setNotes("");
      setSelectedInvestment(null);
    } catch (error) {
      toast.error("Failed to add investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromPortfolio = async (portfolioId: Id<"userPortfolio">) => {
    try {
      await removeFromPortfolio({ portfolioId });
      toast.success("Investment removed from portfolio");
    } catch (error) {
      toast.error("Failed to remove investment");
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Finding investments for you..." />;
  }

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
        <Tabs defaultValue="available" className="space-y-6">
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
          <TabsContent value="available">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Investments That Match Your Soul
              </h2>
              <p className="text-muted-foreground">
                Curated opportunities aligned with your values and financial archetype
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments?.map((investment, index) => (
                <motion.div
                  key={investment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full flex flex-col">
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
                            Aligned with your {user?.archetype?.replace("_", " ")} values
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

              {/* Portfolio Holdings */}
              <div>
                <h3 className="text-2xl font-bold mb-4">Your Holdings ({stats.investmentCount})</h3>
                {portfolio && portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolio.map((item, index) => {
                      const gainLoss = item.currentValue - item.amountInvested;
                      const percentChange = (gainLoss / item.amountInvested) * 100;
                      
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
                                <CardTitle className="text-lg">{item.investmentName}</CardTitle>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveFromPortfolio(item._id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                      <Button onClick={() => document.querySelector('[value="available"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
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
              Add {selectedInvestment?.name} to your investment portfolio
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToPortfolio} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add to Portfolio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}