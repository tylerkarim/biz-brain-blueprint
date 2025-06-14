
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GoBackButton } from "@/components/common/GoBackButton";

const LaunchToolkit = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    brandFeeling: "",
    preferences: ""
  });
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      generateAssets();
    }
  };

  const generateAssets = async () => {
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
        body: { 
          businessName: formData.businessName,
          brandFeeling: formData.brandFeeling,
          preferences: formData.preferences
        }
      });

      if (error) throw error;

      setResults(data);
      setStep(4);
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

  const deleteAsset = async (assetId: string) => {
    try {
      await supabase.from('launch_assets').delete().eq('id', assetId).eq('user_id', user?.id);
      toast({
        title: "Asset Deleted",
        description: "The launch asset has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete asset.",
        variant: "destructive"
      });
    }
  };

  if (step === 4 && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="pt-16 flex">
          <Sidebar />
          
          <main className="flex-1 bg-white">
            <div className="max-w-4xl mx-auto p-6">
              <GoBackButton />
              
              <div className="text-center mb-8">
                <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Launch Assets</h1>
                <p className="text-gray-600 font-medium">AI-generated branding materials for {formData.businessName}</p>
              </div>

              <div className="space-y-12">
                {/* Logo Ideas */}
                {results.logoIdeas && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Logo Concepts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results.logoIdeas.map((logo: any, index: number) => (
                        <Card key={index} className="p-6 border-0 shadow-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{logo.style}</h3>
                            <Button variant="ghost" size="sm" onClick={() => deleteAsset(logo.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{formData.businessName?.slice(0, 2).toUpperCase() || "LO"}</span>
                          </div>
                          <p className="text-gray-600 font-medium">{logo.concept}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Name Ideas */}
                {results.nameIdeas && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Name Suggestions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.nameIdeas.map((name: any, index: number) => (
                        <Card key={index} className="p-6 border-0 shadow-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{name.name}</h3>
                              <p className="text-gray-600 font-medium">{name.domain}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={name.available ? "secondary" : "destructive"}>
                                {name.available ? "Available" : "Taken"}
                              </Badge>
                              <Button variant="ghost" size="sm" onClick={() => deleteAsset(name.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand Colors */}
                {results.brandColors && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Brand Color Palette</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results.brandColors.map((color: any, index: number) => (
                        <Card key={index} className="p-6 border-0 shadow-lg">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900">{color.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => deleteAsset(color.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div 
                            className="w-full h-20 rounded-lg mb-4"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <p className="text-gray-600 text-sm mb-2 font-medium">{color.hex}</p>
                          <p className="text-gray-500 text-sm font-medium">{color.usage}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    onClick={() => {
                      setStep(1);
                      setFormData({ businessName: "", brandFeeling: "", preferences: "" });
                      setResults(null);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 font-medium"
                  >
                    Generate More Assets
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 bg-white">
          <div className="max-w-2xl mx-auto p-6">
            <GoBackButton />
            
            <div className="text-center mb-8">
              <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Launch Toolkit Builder</h1>
              <p className="text-gray-600 font-medium">Let's create your brand identity step by step</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-900">Step {step} of 3</span>
                <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            </div>

            <Card className="p-8 border-0 shadow-lg">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">What's the name of your business?</h2>
                  <p className="text-gray-600 font-medium">Enter your business name or a working title to get started.</p>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="e.g., TechFlow, MindMate, EcoClean..."
                    className="font-medium"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">What feeling should your brand give?</h2>
                  <p className="text-gray-600 font-medium">Describe the impression you want customers to have when they see your brand.</p>
                  <Textarea
                    value={formData.brandFeeling}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandFeeling: e.target.value }))}
                    placeholder="e.g., Professional and trustworthy, Fun and approachable, Innovative and cutting-edge..."
                    className="min-h-32 font-medium"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Any preferred colors, tone, or visuals?</h2>
                  <p className="text-gray-600 font-medium">Share any specific preferences for your brand identity (optional but helpful).</p>
                  <Textarea
                    value={formData.preferences}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                    placeholder="e.g., Blue and white colors, minimalist design, tech-focused, avoid overly playful elements..."
                    className="min-h-32 font-medium"
                  />
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="font-medium"
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={isLoading || (step === 1 && !formData.businessName.trim())}
                  className="bg-purple-600 hover:bg-purple-700 font-medium"
                >
                  {isLoading ? "Generating Assets..." : step === 3 ? "Generate Assets" : "Next"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LaunchToolkit;
