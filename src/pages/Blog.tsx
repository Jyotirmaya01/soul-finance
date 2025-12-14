import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Blog() {
  const navigate = useNavigate();
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getPosts,
    {},
    { initialNumItems: 9 }
  );

  if (status === "LoadingFirstPage") {
    return <LoadingScreen message="Loading articles..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold">FinSoul Blog</h1>
          <div className="w-32" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Financial Wisdom for the Soul</h2>
          <p className="text-xl text-muted-foreground">Insights, guides, and stories to help you grow.</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No articles found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex gap-2 mb-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-xs mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min read
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full group" 
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {status === "CanLoadMore" && (
          <div className="text-center mt-12">
            <Button onClick={() => loadMore(9)} size="lg">
              Load More Articles
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}