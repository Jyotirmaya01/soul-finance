import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "@/components/ProfileDropdown";

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const freemiumFeatures = [
    "Soul Scan Quiz",
    "Peace Meter tracking",
    "Basic investment recommendations",
    "Community circles access",
    "Money mood journal",
    "Life goals tracking",
    "Financial calculators",
  ];

  const premiumFeatures = [
    "All Freemium features",
    "Daily finance news via email",
    "Exclusive investment recommendations",
    "Advanced analytics & insights",
    "Priority customer support",
    "Early access to new features",
    "Personalized AI coaching",
    "Ad-free experience",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Pricing Plans</h1>
          {isAuthenticated && user ? (
            <ProfileDropdown />
          ) : (
            <div className="w-10" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Choose Your Financial Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade anytime to unlock premium features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Freemium Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 h-full">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="text-blue-500" />
                  Freemium
                </CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {freemiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                >
                  {isAuthenticated ? "Current Plan" : "Get Started Free"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 h-full relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  POPULAR
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="text-yellow-500" />
                  Premium
                </CardTitle>
                <CardDescription>For serious investors</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className={index === 0 ? "font-semibold" : ""}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate(isAuthenticated ? "/profile" : "/auth")}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {isAuthenticated ? "Upgrade to Premium" : "Start Premium Trial"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Cancel anytime • 30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 max-w-3xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold mb-4">Why Choose Premium?</h3>
              <p className="text-muted-foreground mb-6">
                Premium members receive daily curated finance news, exclusive investment opportunities
                tailored to their archetype, and advanced analytics to track their financial journey.
                Our AI-powered insights help you make smarter decisions and achieve your financial goals faster.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
