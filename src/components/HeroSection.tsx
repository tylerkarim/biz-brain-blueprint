
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Main Content */}
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-navy-900 mb-6 leading-tight">
              The fastest, most precise
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AI business tool ever
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your business ideas into reality with AI-powered tools for startup creation, business planning, and launch execution.
            </p>
            
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Start for Free
              </Button>
            </Link>
          </div>
          
          {/* Flowing Lines Abstract Shape */}
          <div className="relative mt-16">
            <div className="w-96 h-96 mx-auto relative">
              <img 
                src="/lovable-uploads/73116177-a30a-4ace-9d48-59b070782d28.png" 
                alt="Flowing lines abstract design" 
                className="w-full h-full object-contain opacity-80 animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
