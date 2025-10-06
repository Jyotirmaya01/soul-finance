import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Plus, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { LoadingScreen } from "@/components/LoadingScreen";
import { InvestmentCard } from "@/components/investments/InvestmentCard";
import { PortfolioStats } from "@/components/investments/PortfolioStats";
import { PortfolioHolding } from "@/components/investments/PortfolioHolding";
import { AddToPortfolioDialog } from "@/components/investments/AddToPortfolioDialog";
import { AddCustomInvestmentDialog } from "@/components/investments/AddCustomInvestmentDialog";
import { EditPortfolioDialog } from "@/components/investments/EditPortfolioDialog";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";
import { ShareButtons } from "@/components/ShareButtons";

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

  const [activeTab, setActiveTab] = useState("investments");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleAddToPortfolio = (investment: any) => {
    setSelectedInvestment(investment);
    setIsAddDialogOpen(true);
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Investments</h1>
            <ShareButtons 
              title="Check out my Investment Portfolio on Soul Finance!"
              description="I'm building wealth that aligns with my values using Soul Finance"
              hashtags={["Investing", "FinancialFreedom", "ESG", "FinTech"]}
            />
          </div>
          <ProfileDropdown />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="investments">
              <Leaf className="h-4 w-4 mr-2" />
              Investments
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <PieChart className="h-4 w-4 mr-2" />
              My Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Values-Aligned Investments</h2>
              <p className="text-muted-foreground">
                Discover investment opportunities that match your financial archetype
              </p>
            </motion.div>

            {!investments ? (
              <LoadingScreen message="Loading investments..." />
            ) : investments.length === 0 ? (
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <CardContent className="py-12 text-center">
                  <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Investments Available</h3>
                  <p className="text-muted-foreground">Check back soon for new opportunities</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map((investment, index) => (
                  <InvestmentCard
                    key={investment._id}
                    investment={investment}
                    userArchetype={user?.archetype}
                    onAddToPortfolio={handleAddToPortfolio}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Portfolio Stats */}
              <PortfolioStats stats={stats} />

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
                  <LoadingScreen message="Loading portfolio..." />
                ) : portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolio.map((item, index) => (
                      <PortfolioHolding
                        key={item._id}
                        item={item}
                        onEdit={handleEditEntry}
                        onRemove={handleRemoveFromPortfolio}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                    <CardContent className="py-12 text-center">
                      <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Investments Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your portfolio by adding investments
                      </p>
                      <Button onClick={() => setActiveTab("investments")}>
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

      {/* Dialogs */}
      <AddToPortfolioDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setSelectedInvestment(null);
          }
        }}
        investment={selectedInvestment}
        onAdd={async (data) => {
          await addToPortfolio(data);
          setActiveTab("portfolio");
        }}
      />

      <AddCustomInvestmentDialog
        open={isCustomDialogOpen}
        onOpenChange={setIsCustomDialogOpen}
        onAdd={async (data) => {
          await addCustomInvestment(data);
          setActiveTab("portfolio");
        }}
      />

      <EditPortfolioDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingEntry(null);
          }
        }}
        entry={editingEntry}
        onUpdate={async (data) => {
          await updatePortfolioEntry(data);
        }}
      />
    </div>
  );
}