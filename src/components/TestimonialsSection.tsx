
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Sarah Chen",
    company: "Flipr",
    industry: "E-commerce",
    content: "BuildAura helped us validate and launch our marketplace idea in just 30 days. The AI-generated business plan was incredibly detailed and actionable.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    company: "TechFlow",
    industry: "SaaS",
    content: "The AI business idea generator suggested 3 concepts that we're now actively pursuing. It's like having a seasoned entrepreneur as your advisor 24/7.",
    rating: 5
  },
  {
    name: "Emily Watson",
    company: "GreenStart",
    industry: "Sustainability",
    content: "From idea to launch in 45 days. The launch toolkit saved us weeks of work on branding and naming. Absolutely game-changing for first-time founders.",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            Trusted by innovative
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              entrepreneurs worldwide
            </span>
          </h2>
        </div>
        
        <div className="relative">
          <Card className="p-12 border-0 shadow-xl bg-white text-center">
            <div className="mb-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">⭐</span>
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed mb-8">
                "{testimonials[currentIndex].content}"
              </blockquote>
            </div>
            
            <div className="border-t pt-8">
              <div className="font-bold text-lg text-navy-900">{testimonials[currentIndex].name}</div>
              <div className="text-gray-600">{testimonials[currentIndex].company} • {testimonials[currentIndex].industry}</div>
            </div>
          </Card>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
