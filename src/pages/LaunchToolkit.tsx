
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LaunchToolkit = () => {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedResults = {
        logoIdeas: [
          { concept: "Modern geometric design with blue gradient", style: "Minimalist" },
          { concept: "Circular emblem with tech-inspired iconography", style: "Professional" },
          { concept: "Abstract letter mark with dynamic elements", style: "Creative" }
        ],
        nameIdeas: [
          { name: "TechFlow", domain: "techflow.com", available: false },
          { name: "BuildWise", domain: "buildwise.com", available: true },
          { name: "LaunchGrid", domain: "launchgrid.com", available: true },
          { name: "StartupHub", domain: "startuphub.com", available: false },
          { name: "IdeaForge", domain: "ideaforge.com", available: true }
        ],
        brandColors: [
          { name: "Primary Blue", hex: "#3F82F9", usage: "Main brand color" },
          { name: "Deep Navy", hex: "#0F172A", usage: "Text and headers" },
          { name: "Light Gray", hex: "#F8FAFC", usage: "Backgrounds" }
        ]
      };
      
      setResults(generatedResults);
      setIsLoading(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Launch Toolkit</h1>
            <p className="text-xl text-gray-600">Get logo ideas, name suggestions, and brand assets for your startup</p>
          </div>

          <Card className="p-8 mb-12 border-0 shadow-lg">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name (or working title)
                  </label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry/Category
                  </label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., SaaS, E-commerce, Healthcare"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 py-3"
                disabled={isLoading}
              >
                {isLoading ? "Generating brand assets with AI..." : "Generate Launch Toolkit"}
              </Button>
            </form>
          </Card>

          {results && (
            <div className="space-y-12">
              {/* Logo Ideas */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-8">Logo Concepts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.logoIdeas.map((logo: any, index: number) => (
                    <Card key={index} className="p-6 border-0 shadow-lg">
                      <div className="w-full h-32 bg-gradient-to-br from-primary to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{businessName?.slice(0, 2).toUpperCase() || "LO"}</span>
                      </div>
                      <Badge className="mb-3">{logo.style}</Badge>
                      <p className="text-gray-600">{logo.concept}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Name Ideas */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-8">Name Suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.nameIdeas.map((name: any, index: number) => (
                    <Card key={index} className="p-6 border-0 shadow-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-navy-900">{name.name}</h3>
                          <p className="text-gray-600">{name.domain}</p>
                        </div>
                        <Badge variant={name.available ? "secondary" : "destructive"}>
                          {name.available ? "Available" : "Taken"}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Brand Colors */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-8">Brand Color Palette</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.brandColors.map((color: any, index: number) => (
                    <Card key={index} className="p-6 border-0 shadow-lg">
                      <div 
                        className="w-full h-20 rounded-lg mb-4"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <h3 className="font-bold text-navy-900">{color.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{color.hex}</p>
                      <p className="text-gray-500 text-sm">{color.usage}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button className="bg-primary hover:bg-primary/90 px-8 py-3">
                  Save All Assets to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LaunchToolkit;
