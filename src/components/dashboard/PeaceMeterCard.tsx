import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PeaceMeter } from "@/components/PeaceMeter";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface PeaceMeterCardProps {
  peaceMeter: number;
}

export function PeaceMeterCard({ peaceMeter }: PeaceMeterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-pink-500" />
            Your Peace
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <PeaceMeter score={peaceMeter} size="md" />
          <Button variant="outline" className="mt-4 w-full" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Take a Breath
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
