import { TreeVisualization } from "@/components/TreeVisualization";
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
  { icon: Heart, title: "Peace Meter™", description: "Track your emotional relationship with money in real-time", color: "text-pink-500" },
  { icon: Sparkles, title: "Soul Scan Quiz", description: "Discover your unique financial archetype in 5 minutes", color: "text-purple-500" },
  { icon: Target, title: "Values-Aligned Goals", description: "Set and achieve goals that truly matter to you", color: "text-blue-500" },
  { icon: Leaf, title: "Ethical Investments", description: "Invest in what you believe in with ESG-rated opportunities", color: "text-green-500" },
  { icon: Users, title: "Community Circles", description: "Connect with others on similar financial journeys", color: "text-indigo-500" },
  { icon: Shield, title: "Safe & Secure", description: "Bank-level security with empathetic, human-first design", color: "text-orange-500" },
];

const reviews = [
  { name: "Priya Sharma", role: "Freedom Seeker", text: "FinSoul helped me understand my emotional relationship with money. The Peace Meter is a game-changer!", avatar: "PS" },
  { name: "Rahul Mehta", role: "Legacy Builder", text: "Finally, a financial app that aligns with my values. The ethical investment options are exactly what I needed.", avatar: "RM" },
  { name: "Ananya Desai", role: "Harmony Keeper", text: "The community circles have been incredible. I've learned so much from others on similar journeys.", avatar: "AD" },
  { name: "Vikram Singh", role: "Adventure Investor", text: "The AI Coach provides personalized guidance that actually understands my financial personality. Highly recommend!", avatar: "VS" }
];

const stats = [
  { number: "10,000+", label: "Happy Investors" },
  { number: "₹500Cr+", label: "Assets Managed" },
  { number: "95%", label: "Satisfaction Rate" },
  { number: "50+", label: "ESG Investments" }
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Welcome to FinSoul..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img 
              src="/logo.svg" 
              alt="FinSoul" 
              className="h-8 w-8"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <span className="text-xl font-bold">FinSoul</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-6">
            {["features", "about", "reviews", "contact"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="text-sm hover:text-primary transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.1, color: "var(--color-primary)" }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.a>
            ))}
          </div>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ShareButtons 
              title="Soul Finance - Your Financial Companion"
              description="Discover your financial archetype and build wealth that aligns with your values"
              hashtags={["FinTech", "FinancialWellness", "AI", "PersonalFinance"]}
            />
            <ThemeToggle />
            {isAuthenticated && user ? (
              <Button onClick={() => navigate(user.hasCompletedQuiz ? "/dashboard" : "/soul-scan")}>
                {user.hasCompletedQuiz ? "Dashboard" : "Continue Quiz"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            style={{ opacity, scale }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Finally, Finance That Understands You.
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
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
          >
            <TreeVisualization />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
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

      {/* AI Coach Preview Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="backdrop-blur-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-12 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 relative overflow-hidden">
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-12 w-12 text-indigo-500" />
                  </motion.div>
                  <h2 className="text-4xl font-bold">Meet Your AI Coach</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Get personalized financial guidance 24/7. Our AI Coach understands your unique financial personality and provides compassionate, context-aware advice tailored just for you.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    "Personalized financial guidance",
                    "24/7 availability",
                    "Understands your archetype",
                    "Compassionate & supportive"
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                  className="group"
                >
                  <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  {isAuthenticated ? "Chat with AI Coach" : "Get Started"}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">AI Coach</div>
                        <div className="text-xs text-muted-foreground">Always here to help</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">Hi! I'm your AI Coach. How can I help you with your financial journey today? 💚</p>
                      </div>
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg ml-8">
                        <p className="text-sm">How do I start investing?</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">Great question! Let's explore investment options that align with your values and financial goals...</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-green-500"
                      />
                      Online now
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Anti-Bank App
          </motion.h2>
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

      {/* About Us Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              About FinSoul
            </motion.h2>
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

      {/* Reviews Section */}
      <section id="reviews" className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground">Real stories from real people on their financial journey</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {review.avatar}
                    </motion.div>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Get In Touch</h2>
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="backdrop-blur-sm bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-12 rounded-3xl text-center text-white hover:shadow-2xl transition-shadow"
        >
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Financial Soul Awaits
          </motion.h2>
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

      {/* Footer */}
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
    </div>
  );
}