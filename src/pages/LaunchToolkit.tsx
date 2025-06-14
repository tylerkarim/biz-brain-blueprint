
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LaunchToolkit = () => {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate launch assets.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-launch-toolkit', {
        body: { businessName, industry }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Launch Assets Generated!",
        description: "Your brand assets have been created and saved to your dashboard.",
      });

    } catch (error) {
      console.error('Error generating launch toolkit:', error);
      toast({
        title: "Error",
        description: "Failed to generate launch assets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading || !user}
              >
                {isLoading ? "Generating brand assets with AI..." : "Generate Launch Toolkit"}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 text-center">
                  Please log in to generate launch assets.
                </p>
              )}
            </form>
          </Card>

          {results && (
            <div className="space-y-12">
              {/* Logo Ideas */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-8">Logo Concepts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.logoIdeas?.map((logo: any, index: number) => (
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
                  {results.nameIdeas?.map((name: any, index: number) => (
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
                  {results.brandColors?.map((color: any, index: number) => (
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
                  Assets Saved to Dashboard
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
