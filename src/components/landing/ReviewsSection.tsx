import { AnimatedBackground } from "@/components/ui/animated-background";
import { Card, CardContent } from "@/components/ui/card";
import { TextReveal } from "@/components/ui/text-reveal";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Priya Sharma", role: "Freedom Seeker", text: "FinSoul helped me understand my emotional relationship with money. The Peace Meter is a game-changer!", avatar: "PS" },
  { name: "Rahul Mehta", role: "Legacy Builder", text: "Finally, a financial app that aligns with my values. The ethical investment options are exactly what I needed.", avatar: "RM" },
  { name: "Ananya Desai", role: "Harmony Keeper", text: "The community circles have been incredible. I've learned so much from others on similar journeys.", avatar: "AD" },
  { name: "Vikram Singh", role: "Adventure Investor", text: "The AI Coach provides personalized guidance that actually understands my financial personality. Highly recommend!", avatar: "VS" }
];

export function ReviewsSection() {
  return (
    <section id="reviews" className="container mx-auto px-4 py-20 relative">
      <AnimatedBackground variant="subtle" />
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <TextReveal 
          text="What Our Community Says" 
          className="text-4xl font-bold tracking-tight mb-4 text-foreground"
        />
        <p className="text-xl text-muted-foreground">Real stories from real people on their financial journey</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {review.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                    >
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
