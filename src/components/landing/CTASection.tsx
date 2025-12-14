import { AnimatedBackground } from "@/components/ui/animated-background";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        className="backdrop-blur-sm bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-12 rounded-3xl text-center text-white hover:shadow-2xl transition-shadow relative overflow-hidden"
      >
        <AnimatedBackground variant="subtle" className="opacity-20" />
        <TextReveal 
          text="Your Financial Soul Awaits" 
          className="text-4xl font-bold mb-4 text-white"
        />
        <motion.p 
          className="text-xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join thousands discovering a healthier relationship with money
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-lg group">
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
            Begin Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
