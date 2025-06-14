
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
    brandFeeling: "",
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
          brandFeeling: formData.brandFeeling,
          colorPreferences: formData.colorPreferences
        }
      });

      if (error) throw error;

      setResults(data);
      setCurrentStep(4); // Results step
      
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
              <h2 className="text-2xl font-bold text-navy-900 mb-2">What's your business name?</h2>
              <p className="text-gray-600">I'll help you create a complete brand identity around this name.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Business name (or working title)
              </label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="e.g., BuildAura, TechFlow, GreenSpace..."
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
              <h2 className="text-2xl font-bold text-navy-900 mb-2">What feeling should your brand create?</h2>
              <p className="text-gray-600">This helps me design a brand that connects with your audience.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Brand personality and impression
              </label>
              <Input
                value={formData.brandFeeling}
                onChange={(e) => setFormData(prev => ({ ...prev, brandFeeling: e.target.value }))}
                placeholder="e.g., Professional and trustworthy, Modern and innovative, Friendly and approachable..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Think about how you want customers to feel when they see your brand.</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Any color preferences?</h2>
              <p className="text-gray-600">I'll create a complete color palette based on your preferences.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Colors, tones, or visual style
              </label>
              <Input
                value={formData.colorPreferences}
                onChange={(e) => setFormData(prev => ({ ...prev, colorPreferences: e.target.value }))}
                placeholder="e.g., Blues and whites, Earthy greens, Bold and vibrant, Minimal black/white..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Or leave blank and I'll suggest colors that match your brand feeling.</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Your Launch Toolkit</h2>
              <p className="text-gray-600">Complete brand package for {formData.businessName}</p>
            </div>
            
            {results && (
              <div className="space-y-8">
                {/* Name Alternatives */}
                {results.nameAlternatives && (
                  <Card className="p-6 border-0 shadow-lg">
                    <h3 className="text-xl font-bold text-navy-900 mb-4">Business Name Options</h3>
                    <div className="grid gap-4">
                      {results.nameAlternatives.map((name: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold">{name.name}</div>
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
                    <h3 className="text-xl font-bold text-navy-900 mb-4">Logo Concepts</h3>
                    <div className="grid gap-4">
                      {results.logoIdeas.map((logo: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="font-semibold mb-2">{logo.style} Style</div>
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
                    <h3 className="text-xl font-bold text-navy-900 mb-4">Brand Color Palette</h3>
                    <div className="grid gap-4">
                      {results.brandColors.map((color: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div 
                            className="w-16 h-16 rounded-lg border"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div>
                            <div className="font-semibold">{color.name}</div>
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
                    <h3 className="text-xl font-bold text-navy-900 mb-4">Tagline Options</h3>
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
                    <h3 className="text-xl font-bold text-navy-900 mb-4">Brand Voice</h3>
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
          
          {currentStep < 4 && (
            <div className="flex items-center text-sm text-gray-500">
              Step {currentStep} of 3
            </div>
          )}
        </div>

        <Card className="p-8 border-0 shadow-lg">
          {renderStep()}
          
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={currentStep === 3 ? generateToolkit : () => setCurrentStep(currentStep + 1)}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Generating Toolkit..." : currentStep === 3 ? "Generate Brand Toolkit" : "Next"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
