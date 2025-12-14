import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="py-20 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <motion.div style={{ opacity }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Your Journey to Financial Freedom
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div style={{ y: y1 }} className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border shadow-lg">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-2">Plant the Seed</h3>
            <p className="text-muted-foreground">Start with small, consistent investments aligned with your values.</p>
          </motion.div>
          
          <motion.div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border shadow-lg mt-12 md:mt-0">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-bold mb-2">Nurture Growth</h3>
            <p className="text-muted-foreground">Watch your wealth grow with compound interest and smart choices.</p>
          </motion.div>
          
          <motion.div style={{ y: y2 }} className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border shadow-lg">
            <div className="text-4xl mb-4">🌳</div>
            <h3 className="text-xl font-bold mb-2">Harvest Abundance</h3>
            <p className="text-muted-foreground">Achieve financial independence and leave a lasting legacy.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
