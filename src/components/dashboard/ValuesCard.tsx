import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface ValuesCardProps {
  topValues?: string[];
}

export function ValuesCard({ topValues }: ValuesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-500" />
            Your Values
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topValues?.slice(0, 3).map((value, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
