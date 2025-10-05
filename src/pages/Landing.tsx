import { TreeVisualization } from "@/components/TreeVisualization";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Leaf, Shield, Sparkles, Target, Users, Mail, MapPin, Phone, Star, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="FinSoul" className="h-8 w-8" />
            <span className="text-xl font-bold">FinSoul</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-sm hover:text-primary transition-colors">About</a>
            <a href="#reviews" className="text-sm hover:text-primary transition-colors">Reviews</a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Finally, Finance That Understands You.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              FinSoul is your values-driven financial companion. We blend emotional intelligence with smart money management to help you grow wealth that feels right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Free Soul Scan
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✨ No credit card required • 5-minute setup • Join 10,000+ mindful investors
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <TreeVisualization />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl text-center border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">The Anti-Bank App</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Warm, wise, and wonderfully human. Finance that nurtures your soul, not just your wallet.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border-2 border-transparent hover:border-primary transition-all cursor-pointer">
              <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">About FinSoul</h2>
            <p className="text-xl text-muted-foreground">Redefining the relationship between people and their money</p>
          </div>
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl border">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>FinSoul was born from a simple belief: financial wellness isn't just about numbers—it's about understanding your emotional relationship with money. We're not another cold, corporate financial platform. We're your compassionate companion on the journey to financial peace.</p>
              <p>Our mission is to help you build wealth that aligns with your deepest values. Through our unique Soul Scan technology, AI-powered coaching, and values-aligned investment opportunities, we're creating a new paradigm in personal finance—one that honors both your financial goals and your emotional well-being.</p>
              <div className="grid md:grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <Award className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Our Vision</h4>
                  <p className="text-sm">A world where everyone has financial peace and prosperity</p>
                </div>
                <div className="text-center">
                  <Heart className="h-10 w-10 text-pink-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Our Values</h4>
                  <p className="text-sm">Empathy, transparency, and human-first design</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-4">Our Approach</h4>
                  <p className="text-sm">Blend emotional intelligence with smart investing</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground">Real stories from real people on their financial journey</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
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
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground">We'd love to hear from you. Reach out anytime!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border text-center">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground">support@finsoul.com</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border text-center">
              <Phone className="h-10 w-10 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border text-center">
              <MapPin className="h-10 w-10 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-sm text-muted-foreground">Mumbai, India</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="backdrop-blur-sm bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-12 rounded-3xl text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Your Financial Soul Awaits</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands discovering a healthier relationship with money</p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Begin Your Journey
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 FinSoul. Made with 💚 for mindful investors.</p>
          <p className="mt-2">Powered by FinSoul • Secured by FinSoul</p>
        </div>
      </footer>
    </div>
  );
}