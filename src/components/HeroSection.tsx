
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
          {/* Floating Assistant Message */}
          <div className="absolute top-20 left-1/4 hidden lg:block animate-float">
            <Card className="p-3 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <span className="text-sm text-gray-700">I need to launch my startup idea</span>
              </div>
            </Card>
          </div>
          
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
          
          {/* 3D Abstract Shape */}
          <div className="relative mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <div className="w-96 h-96 mx-auto bg-gradient-to-br from-primary via-blue-500 to-blue-600 rounded-3xl shadow-2xl transform rotate-12 opacity-80">
                <div className="absolute inset-4 bg-gradient-to-tl from-white/20 to-white/40 rounded-2xl backdrop-blur-sm"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-primary/60 to-blue-600/60 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
