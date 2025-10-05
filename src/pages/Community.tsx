import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export default function Community() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [circleType, setCircleType] = useState("mutual_fund");
  const [isPrivate, setIsPrivate] = useState(false);

  const publicCircles = useQuery(api.circles.getPublicCircles);
  const searchResults = useQuery(
    api.circles.searchCircles,
    searchQuery ? { searchTerm: searchQuery } : "skip"
  );
  const joinCircle = useMutation(api.circles.joinCircle);
  const createCircle = useMutation(api.circles.createCircle);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleJoinCircle = async (circleId: any) => {
    try {
      await joinCircle({ circleId: circleId as any });
      toast.success("Joined circle successfully! 🎉");
    } catch (error) {
      toast.error("Failed to join circle");
    }
  };

  const handleCreateCircle = async () => {
    if (!circleName.trim() || !circleDescription.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createCircle({
        name: circleName,
        description: circleDescription,
        communityType: circleType,
        isPublic: !isPrivate,
        tags: [],
      });
      toast.success("Circle created successfully! 🎉");
      setIsCreateDialogOpen(false);
      setCircleName("");
      setCircleDescription("");
      setCircleType("mutual_fund");
      setIsPrivate(false);
    } catch (error) {
      toast.error("Failed to create circle");
    }
  };

  const filteredCircles = searchQuery ? searchResults : publicCircles;

  if (authLoading) {
    return <LoadingScreen message="Loading community..." />;
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">Community</h1>
          <ProfileDropdown />
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Users className="text-blue-500" />
            Financial Circles
          </h2>
          <p className="text-muted-foreground">
            Join communities of like-minded investors and learners
          </p>
        </motion.div>

        {/* Search and Create */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Circle
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Circle</DialogTitle>
                <DialogDescription>
                  Start a community around your financial interests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="circle-name">Circle Name</Label>
                  <Input
                    id="circle-name"
                    placeholder="e.g., Tech Stock Investors"
                    value={circleName}
                    onChange={(e) => setCircleName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="circle-description">Description</Label>
                  <Textarea
                    id="circle-description"
                    placeholder="What is this circle about?"
                    value={circleDescription}
                    onChange={(e) => setCircleDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="circle-type">Community Type</Label>
                  <Select value={circleType} onValueChange={setCircleType}>
                    <SelectTrigger id="circle-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                      <SelectItem value="sip">SIP</SelectItem>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="finance_news">Finance News</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is-private" className="cursor-pointer">
                    Make this circle private
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCircle}>Create Circle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Circles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles?.map((circle, index) => (
            <motion.div
              key={circle._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    {circle.name}
                  </CardTitle>
                  <CardDescription>{circle.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {circle.memberCount} members
                    </span>
                    <Button size="sm" onClick={() => handleJoinCircle(circle._id)}>
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCircles && filteredCircles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 text-center py-12">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">No Circles Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any circles matching your search.
                </p>
                <Button onClick={() => setSearchQuery("")} className="w-full">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}