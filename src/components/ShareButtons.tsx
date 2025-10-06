import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share2, Twitter, Linkedin, Facebook, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  className?: string;
}

export function ShareButtons({
  title = "Soul Finance - Your Financial Companion",
  url,
  hashtags = ["FinTech", "FinancialWellness", "AI"],
  className = "",
}: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use current URL if not provided
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const hashtagString = hashtags.join(",");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtagString}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleShare = (platform: string, link: string) => {
    window.open(link, "_blank", "width=600,height=400");
    toast.success(`Sharing on ${platform}!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Share menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 z-50 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border"
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold mb-3">Share Soul Finance</p>

              {/* Twitter */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => handleShare("Twitter", shareLinks.twitter)}
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Share on Twitter
              </Button>

              {/* LinkedIn */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => handleShare("LinkedIn", shareLinks.linkedin)}
              >
                <Linkedin className="h-4 w-4 text-blue-600" />
                Share on LinkedIn
              </Button>

              {/* Facebook */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => handleShare("Facebook", shareLinks.facebook)}
              >
                <Facebook className="h-4 w-4 text-blue-500" />
                Share on Facebook
              </Button>

              {/* WhatsApp */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-green-50 dark:hover:bg-green-950"
                onClick={() => handleShare("WhatsApp", shareLinks.whatsapp)}
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                Share on WhatsApp
              </Button>

              <div className="border-t pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleCopyLink}
                >
                  <Share2 className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
