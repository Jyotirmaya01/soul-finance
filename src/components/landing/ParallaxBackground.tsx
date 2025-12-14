import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function ParallaxBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPct = e.clientX / innerWidth - 0.5;
      const yPct = e.clientY / innerHeight - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const moveX1 = useTransform(x, [-0.5, 0.5], [-20, 20]);
  const moveY1 = useTransform(y, [-0.5, 0.5], [-20, 20]);
  
  const moveX2 = useTransform(x, [-0.5, 0.5], [30, -30]);
  const moveY2 = useTransform(y, [-0.5, 0.5], [30, -30]);

  const moveX3 = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const moveY3 = useTransform(y, [-0.5, 0.5], [-10, 10]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient Orb 1 */}
      <motion.div
        style={{ x: moveX1, y: moveY1 }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]"
      />
      
      {/* Gradient Orb 2 */}
      <motion.div
        style={{ x: moveX2, y: moveY2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]"
      />

      {/* Grid Pattern */}
      <motion.div 
        style={{ x: moveX3, y: moveY3 }}
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </motion.div>
    </div>
  );
}
