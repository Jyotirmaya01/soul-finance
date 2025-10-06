import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    imageUrl?: string;
    createdAt: number;
    author: {
      _id?: string;
      name: string;
      profilePhoto?: string;
    };
    isAuthorAdmin?: boolean;
  };
  currentUserId?: string;
  isCurrentUserAdmin?: boolean;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, currentUserId, isCurrentUserAdmin, onDelete }: PostCardProps) {
  const canDelete = post.author._id === currentUserId || isCurrentUserAdmin;
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.profilePhoto} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{post.author.name}</span>
                {post.isAuthorAdmin && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(post.createdAt)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post attachment"
                  className="mt-3 rounded-lg max-w-full h-auto"
                />
              )}
            </div>
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(post._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
