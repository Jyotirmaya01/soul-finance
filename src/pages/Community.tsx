import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Community() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const publicCircles = useQuery(api.circles.getPublicCircles);
  const userCircles = useQuery(api.circles.getUserCircles);
  const joinCircle = useMutation(api.circles.joinCircle);
  const createCircle = useMutation(api.circles.createCircle);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [circleType, setCircleType] = useState("mutual_fund");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleJoinCircle = async (circleId: string) => {
    try {
      await joinCircle({ circleId: circleId as any });
      toast.success("Joined circle! 🎉");
    } catch (error) {
      toast.error("Failed to join circle");
    }
  };

  const handleCreateCircle = async () => {
    if (!circleName.trim() || !circleDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createCircle({
        name: circleName,
        description: circleDescription,
        isPublic,
        tags: [],
        communityType: circleType,
      });
      toast.success("Circle created! 🎉");
      setIsCreateDialogOpen(false);
      setCircleName("");
      setCircleDescription("");
      setCircleType("mutual_fund");
      setIsPublic(true);
    } catch (error) {
      toast.error("Failed to create circle");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold">Community Hub</h1>
          <div className="w-24" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Connect With Your Tribe
          </h2>
          <p className="text-muted-foreground">
            Join circles, share experiences, and grow together
          </p>
        </motion.div>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-circles">My Circles</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Public Circles</h3>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Circle
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicCircles?.map((circle, index) => (
                <motion.div
                  key={circle._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
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
          </TabsContent>

          <TabsContent value="my-circles" className="space-y-6">
            <h3 className="text-xl font-semibold">Your Circles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCircles && userCircles.length > 0 ? (
                userCircles.map((circle, index) => (
                  <motion.div
                    key={circle._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-500" />
                          {circle.name}
                        </CardTitle>
                        <CardDescription>{circle.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <span className="text-sm text-muted-foreground">
                          {circle.memberCount} members
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground col-span-full text-center py-12">
                  You haven't joined any circles yet. Explore and connect!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Circle Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                id="is-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="is-public" className="cursor-pointer">
                Make this circle public
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
    </div>
  );
}