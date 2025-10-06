import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Users, Send, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { PostCard } from "@/components/community/PostCard";
import { motion } from "framer-motion";
import type { Id } from "@/convex/_generated/dataModel";

export default function CircleDetail() {
  const navigate = useNavigate();
  const { circleId } = useParams<{ circleId: string }>();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const circleDetails = useQuery(
    api.circlePosts.getCircleDetails,
    circleId ? { circleId: circleId as Id<"circles"> } : "skip"
  );
  const posts = useQuery(
    api.circlePosts.getCirclePosts,
    circleId ? { circleId: circleId as Id<"circles"> } : "skip"
  );
  const pendingPosts = useQuery(
    api.circlePosts.getPendingPosts,
    circleId ? { circleId: circleId as Id<"circles"> } : "skip"
  );
  const members = useQuery(
    api.circlePosts.getCircleMembers,
    circleId ? { circleId: circleId as Id<"circles"> } : "skip"
  );
  const isAdmin = useQuery(
    api.circlePosts.isCircleAdmin,
    circleId ? { circleId: circleId as Id<"circles"> } : "skip"
  );

  const createPost = useMutation(api.circlePosts.createPost);
  const deletePost = useMutation(api.circlePosts.deletePost);
  const approvePost = useMutation(api.circlePosts.approvePost);
  const leaveCircle = useMutation(api.circles.leaveCircle);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleCreatePost = async () => {
    if (!postContent.trim() || !circleId) return;

    setIsSubmitting(true);
    try {
      await createPost({
        circleId: circleId as Id<"circles">,
        content: postContent,
      });
      toast.success("Post created successfully!");
      setPostContent("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost({ postId: postId as Id<"circlePosts"> });
      toast.success("Post deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      await approvePost({ postId: postId as Id<"circlePosts"> });
      toast.success("Post approved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve post");
    }
  };

  const handleLeaveCircle = async () => {
    if (!circleId) return;
    try {
      await leaveCircle({ circleId: circleId as Id<"circles"> });
      toast.success("Left circle successfully");
      navigate("/community");
    } catch (error: any) {
      toast.error(error.message || "Failed to leave circle");
    }
  };

  const isMember = members?.some((m) => m.userId === user?._id);
  const isCreator = circleDetails?.creatorId === user?._id;

  if (authLoading || !circleDetails) {
    return <LoadingScreen message="Loading community..." />;
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/community")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Communities
          </Button>
          <ProfileDropdown />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Circle Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-500" />
                    {circleDetails.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">{circleDetails.description}</p>
                  <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                    <span>{circleDetails.memberCount} members</span>
                    <span>•</span>
                    <span>{circleDetails.postCount} posts</span>
                  </div>
                </div>
                {isMember && !isCreator && (
                  <Button variant="outline" size="sm" onClick={handleLeaveCircle}>
                    Leave Circle
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Pending Posts (Admin Only) */}
        {isAdmin && pendingPosts && pendingPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <Card className="backdrop-blur-sm bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pending Approval ({pendingPosts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingPosts.map((post) => (
                  <div key={post._id} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{post.author.name}</p>
                      <p className="text-sm mt-1">{post.content}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApprovePost(post._id)}
                      className="shrink-0"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create Post */}
        {isMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Share something with the community..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <Button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim() || isSubmitting}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                isCurrentUserAdmin={isAdmin}
                onDelete={handleDeletePost}
              />
            ))
          ) : (
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
