import { AnimatedBackground } from "@/components/ui/animated-background";
import { TextReveal } from "@/components/ui/text-reveal";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="container mx-auto px-4 py-20 relative">
      <AnimatedBackground variant="glow" />
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <TextReveal 
            text="Get In Touch" 
            className="text-4xl font-bold tracking-tight mb-4 text-foreground"
          />
          <p className="text-xl text-muted-foreground">We'd love to hear from you. Reach out anytime!</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Mail, title: "Email Us", info: "support@finsoul.com", color: "text-primary" },
            { icon: Phone, title: "Call Us", info: "+91 1800-123-4567", color: "text-green-500" },
            { icon: MapPin, title: "Visit Us", info: "Mumbai, India", color: "text-blue-500" }
          ].map((contact, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05, y: -10 }} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border text-center hover:shadow-xl transition-shadow cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <contact.icon className={`h-10 w-10 ${contact.color} mx-auto mb-4`} />
              </motion.div>
              <h3 className="font-semibold mb-2">{contact.title}</h3>
              <p className="text-sm text-muted-foreground">{contact.info}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
