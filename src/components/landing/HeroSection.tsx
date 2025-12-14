import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { HeroScene3D } from "@/components/HeroScene3D";
import { TreeVisualization } from "@/components/TreeVisualization";
import { ParallaxBackground } from "./ParallaxBackground";
import { AICoachWidget } from "./AICoachWidget";

export function HeroSection() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden">
      <ParallaxBackground />
      <HeroScene3D />
      
      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
          style={{ opacity, scale }}
          className="relative"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Finally, Finance That Understands You.
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 leading-relaxed backdrop-blur-sm bg-white/30 dark:bg-black/30 p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            FinSoul is your values-driven financial companion. We blend emotional intelligence with smart money management to help you grow wealth that feels right.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg group">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
              Start Your Free Soul Scan
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>Sign In</Button>
          </motion.div>
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            ✨ No credit card required • 5-minute setup • Join 10,000+ mindful investors
          </motion.p>
          
          {/* AI Coach Widget positioned near the CTA */}
          <div className="absolute -right-8 top-1/2 hidden xl:block">
             <AICoachWidget />
          </div>
          <div className="absolute right-0 -bottom-24 block xl:hidden">
             <AICoachWidget />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:block"
        >
          <TreeVisualization />
        </motion.div>
      </div>
    </section>
  );
}