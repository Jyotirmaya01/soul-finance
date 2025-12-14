import { AnimatedBackground } from "@/components/ui/animated-background";
import { TextReveal } from "@/components/ui/text-reveal";
import { motion } from "framer-motion";
import { Award, Heart, TrendingUp } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4 py-20 relative">
      <AnimatedBackground variant="default" />
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <TextReveal 
            text="About FinSoul" 
            className="text-4xl font-bold tracking-tight mb-4 text-foreground"
          />
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Redefining the relationship between people and their money
          </motion.p>
        </div>
        <motion.div 
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl border"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              FinSoul was born from a simple belief: financial wellness isn't just about numbers—it's about understanding your emotional relationship with money. We're not another cold, corporate financial platform. We're your compassionate companion on the journey to financial peace.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our mission is to help you build wealth that aligns with your deepest values. Through our unique Soul Scan technology, AI-powered coaching, and values-aligned investment opportunities, we're creating a new paradigm in personal finance—one that honors both your financial goals and your emotional well-being.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-6 pt-6">
              {[
                { icon: Award, title: "Our Vision", desc: "A world where everyone has financial peace and prosperity", color: "text-primary" },
                { icon: Heart, title: "Our Values", desc: "Empathy, transparency, and human-first design", color: "text-pink-500" },
                { icon: TrendingUp, title: "Our Approach", desc: "Blend emotional intelligence with smart investing", color: "text-green-500" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className={`h-10 w-10 ${item.color} mx-auto mb-3`} />
                  </motion.div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
