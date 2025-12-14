import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";

const stats = [
  { number: "10,000+", label: "Happy Investors" },
  { number: "₹500Cr+", label: "Assets Managed" },
  { number: "95%", label: "Satisfaction Rate" },
  { number: "50+", label: "ESG Investments" }
];

export function StatsSection() {
  return (
    <section className="container mx-auto px-4 py-12 relative">
      <AnimatedBackground variant="subtle" className="rounded-3xl" />
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl text-center border hover:shadow-lg transition-shadow"
          >
            <motion.div 
              className="text-3xl md:text-4xl font-bold text-primary mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {stat.number}
            </motion.div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
