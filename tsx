import { TreeVisualization } from "@/components/TreeVisualization";
import { HeroScene3D } from "@/components/HeroScene3D";
import { ScrollStory } from "@/components/ScrollStory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, Leaf, Shield, Sparkles, Target, Users, Mail, MapPin, Phone, Star, TrendingUp, Award, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButtons } from "@/components/ShareButtons";

const features = [

{/* Hero Section */}
<section className="relative container mx-auto px-4 py-20 min-h-[80vh] flex items-center">
  <HeroScene3D />
  <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
    <motion.div 
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.8 }}
      style={{ opacity, scale }}
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
]