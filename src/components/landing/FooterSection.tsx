import { ShareButtons } from "@/components/ShareButtons";
import { motion } from "framer-motion";

export function FooterSection() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left text-sm text-muted-foreground">
            <p>© 2024 FinSoul. Made with 💚 for mindful investors.</p>
            <p className="mt-2">Powered by FinSoul • Secured by FinSoul</p>
          </div>
          <div className="flex items-center gap-4">
            <ShareButtons 
              title="Soul Finance - Your Financial Companion"
              description="Discover your financial archetype and build wealth that aligns with your values"
              hashtags={["FinTech", "FinancialWellness", "AI", "PersonalFinance"]}
            />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
