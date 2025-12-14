import { ScrollStory } from "@/components/ScrollStory";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { StatsSection } from "@/components/landing/StatsSection";
import { AICoachPreviewSection } from "@/components/landing/AICoachPreviewSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Landing() {
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      <ScrollProgress />
      <BackToTop />
      
      <LandingNavbar />

      <HeroSection />

      <ScrollStory />

      <StatsSection />

      <AICoachPreviewSection />

      <FeaturesSection />

      <AboutSection />

      <ReviewsSection />

      <ContactSection />

      <CTASection />

      <FooterSection />
    </div>
  );
}