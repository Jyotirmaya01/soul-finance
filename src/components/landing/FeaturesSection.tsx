import { AnimatedBackground } from "@/components/ui/animated-background";
import { TextReveal } from "@/components/ui/text-reveal";
import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Sparkles, Target, Users } from "lucide-react";

const features = [
  { icon: Heart, title: "Peace Meter™", description: "Track your emotional relationship with money in real-time", color: "text-pink-500" },
  { icon: Sparkles, title: "Soul Scan Quiz", description: "Discover your unique financial archetype in 5 minutes", color: "text-purple-500" },
  { icon: Target, title: "Values-Aligned Goals", description: "Set and achieve goals that truly matter to you", color: "text-blue-500" },
  { icon: Leaf, title: "Ethical Investments", description: "Invest in what you believe in with ESG-rated opportunities", color: "text-green-500" },
  { icon: Users, title: "Community Circles", description: "Connect with others on similar financial journeys", color: "text-indigo-500" },
  { icon: Shield, title: "Safe & Secure", description: "Bank-level security with empathetic, human-first design", color: "text-orange-500" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-20 relative">
      <AnimatedBackground variant="glow" />
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <TextReveal 
          text="The Anti-Bank App" 
          className="text-4xl font-bold tracking-tight mb-4 text-foreground"
        />
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Warm, wise, and wonderfully human. Finance that nurtures your soul, not just your wallet.
        </motion.p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all cursor-pointer hover:shadow-xl"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
