
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LaunchToolkitFlowProps {
  onBack: () => void;
}

export const LaunchToolkitFlow = ({ onBack }: LaunchToolkitFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    targetCustomer: "",
    brandVibe: "",
    styleInspiration: "",
    colorPreferences: ""
  });

  const generateToolkit = async () => {
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
          businessType: formData.businessType,
          targetCustomer: formData.targetCustomer,
          brandVibe: formData.brandVibe,
          styleInspiration: formData.styleInspiration,
          colorPreferences: formData.colorPreferences
        }
      });

      if (error) throw error;

      setResults(data);
      setCurrentStep(6); // Results step
      
      toast({
        title: "Launch Toolkit Generated!",
        description: "Your brand assets have been created.",
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-navy-900 mb-2">What's your business name?</h2>
              <p className="text-gray-600">This will be the foundation of your brand identity.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Business name (or working title)
              </label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="e.g., TechFlow, GreenSpace, UrbanFit..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Don't worry if it's not final - I can suggest alternatives too.</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-navy-900 mb-2">What type of business are you launching?</h2>
              <p className="text-gray-600">This helps me understand your industry and create relevant branding.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Business type and industry
              </label>
              <Input
                value={formData.businessType}
                onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                placeholder="e.g., SaaS productivity tool, Eco-friendly clothing brand, Local coffee shop..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Be specific about what you do and your industry.</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-navy-900 mb-2">Who's your target customer?</h2>
              <p className="text-gray-600">Understanding your audience helps create the right brand appeal.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target customer description
              </label>
              <Input
                value={formData.targetCustomer}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCustomer: e.target.value }))}
                placeholder="e.g., Tech professionals 25-40, Small business owners, Health-conscious millennials..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Think about demographics, interests, and pain points.</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-navy-900 mb-2">What's your brand's vibe?</h2>
              <p className="text-gray-600">This personality will guide all visual and messaging decisions.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Brand personality and vibe
              </label>
              <Input
                value={formData.brandVibe}
                onChange={(e) => setFormData(prev => ({ ...prev, brandVibe: e.target.value }))}
                placeholder="e.g., Fun and playful, Luxury and sophisticated, Eco-conscious and earthy, Tech-forward and minimal..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">How should customers feel when they interact with your brand?</p>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-navy-900 mb-2">Any style preferences or inspiration?</h2>
              <p className="text-gray-600">Share any visual styles, colors, or brands you admire.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visual style inspiration
                </label>
                <Input
                  value={formData.styleInspiration}
                  onChange={(e) => setFormData(prev => ({ ...prev, styleInspiration: e.target.value }))}
                  placeholder="e.g., Apple's minimalism, Nike's boldness, Patagonia's outdoorsy feel..."
                  className="w-full h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color preferences (optional)
                </label>
                <Input
                  value={formData.colorPreferences}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorPreferences: e.target.value }))}
                  placeholder="e.g., Ocean blues, Forest greens, Warm oranges, or 'surprise me'..."
                  className="w-full h-12"
                />
                <p className="text-sm text-gray-500 mt-2">Leave blank if you want me to suggest colors based on your brand vibe.</p>
              </div>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-navy-900 mb-2">Your Launch Toolkit</h2>
              <p className="text-gray-600">Complete brand package for {formData.businessName}</p>
            </div>
            
            {results && (
              <div className="space-y-8">
                {/* Name Alternatives */}
                {results.nameAlternatives && (
                  <Card className="p-6 border-0 shadow-lg">
                    <h3 className="text-xl font-medium text-navy-900 mb-4">Business Name Options</h3>
                    <div className="grid gap-4">
                      {results.nameAlternatives.map((name: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{name.name}</div>
                            <div className="text-sm text-gray-600">{name.rationale}</div>
                            <div className="text-xs text-gray-500">{name.domain}</div>
                          </div>
                          <Badge variant={name.available ? "secondary" : "destructive"}>
                            {name.available ? "Available" : "Taken"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Logo Concepts */}
                {results.logoIdeas && (
                  <Card className="p-6 border-0 shadow-lg">
                    <h3 className="text-xl font-medium text-navy-900 mb-4">Logo Concepts</h3>
                    <div className="grid gap-4">
                      {results.logoIdeas.map((logo: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="font-medium mb-2">{logo.style} Style</div>
                          <div className="text-gray-700 mb-2">{logo.concept}</div>
                          <div className="text-sm text-gray-500">{logo.elements}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Brand Colors */}
                {results.brandColors && (
                  <Card className="p-6 border-0 shadow-lg">
                    <h3 className="text-xl font-medium text-navy-900 mb-4">Brand Color Palette</h3>
                    <div className="grid gap-4">
                      {results.brandColors.map((color: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div 
                            className="w-16 h-16 rounded-lg border"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div>
                            <div className="font-medium">{color.name}</div>
                            <div className="text-sm text-gray-600">{color.hex}</div>
                            <div className="text-xs text-gray-500">{color.usage}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Taglines */}
                {results.taglines && (
                  <Card className="p-6 border-0 shadow-lg">
                    <h3 className="text-xl font-medium text-navy-900 mb-4">Tagline Options</h3>
                    <div className="grid gap-2">
                      {results.taglines.map((tagline: string, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg font-medium">
                          "{tagline}"
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Brand Voice */}
                {results.brandVoice && (
                  <Card className="p-6 border-0 shadow-lg">
                    <h3 className="text-xl font-medium text-navy-900 mb-4">Brand Voice</h3>
                    <div className="space-y-2">
                      <div><strong>Tone:</strong> {results.brandVoice.tone}</div>
                      <div><strong>Style:</strong> {results.brandVoice.style}</div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          {currentStep < 6 && (
            <div className="flex items-center text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          )}
        </div>

        <Card className="p-8 border-0 shadow-lg">
          {renderStep()}
          
          {currentStep < 6 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={currentStep === 5 ? generateToolkit : () => setCurrentStep(currentStep + 1)}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Generating Toolkit..." : currentStep === 5 ? "Generate Brand Toolkit" : "Next"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
