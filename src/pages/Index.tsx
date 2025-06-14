
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { IndustrySection } from "@/components/IndustrySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <IndustrySection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
