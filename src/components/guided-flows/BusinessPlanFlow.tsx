
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BusinessPlanFlowProps {
  onBack: () => void;
  selectedIdea?: any;
}

export const BusinessPlanFlow = ({ onBack, selectedIdea }: BusinessPlanFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    targetCustomer: "",
    uniqueAdvantage: "",
    solutionDetails: "",
    revenueChannels: ""
  });

  const generatePlan = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate a business plan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-business-plan', {
        body: { 
          ...formData,
          ideaContext: selectedIdea
        }
      });

      if (error) throw error;

      setGeneratedPlan(data.plan);
      setCurrentStep(5); // Results step
      
      toast({
        title: "Business Plan Generated!",
        description: "Your comprehensive business plan has been created.",
      });

    } catch (error) {
      console.error('Error generating business plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate business plan. Please try again.",
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
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Who is your target customer?</h2>
              <p className="text-gray-600">Let's define exactly who will benefit most from your solution.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Describe your ideal customer in detail
              </label>
              <Input
                value={formData.targetCustomer}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCustomer: e.target.value }))}
                placeholder="e.g., Small business owners with 5-50 employees who struggle with project management..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Include demographics, pain points, and current behavior patterns.</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">What's your unique advantage?</h2>
              <p className="text-gray-600">What makes your approach different and better than alternatives?</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What unique value do you bring to this problem?
              </label>
              <Input
                value={formData.uniqueAdvantage}
                onChange={(e) => setFormData(prev => ({ ...prev, uniqueAdvantage: e.target.value }))}
                placeholder="e.g., AI-powered automation, industry expertise, proprietary technology..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Think about your competitive moats and differentiation factors.</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">What does your solution look like?</h2>
              <p className="text-gray-600">Describe how customers will actually use your product or service.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Walk me through the customer experience
              </label>
              <Input
                value={formData.solutionDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, solutionDetails: e.target.value }))}
                placeholder="e.g., Customers sign up, connect their tools, AI analyzes workflow, provides recommendations..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Focus on the user journey and key features they'll interact with.</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">How will you make money?</h2>
              <p className="text-gray-600">Let's define your revenue streams and pricing strategy.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What are your main revenue channels?
              </label>
              <Input
                value={formData.revenueChannels}
                onChange={(e) => setFormData(prev => ({ ...prev, revenueChannels: e.target.value }))}
                placeholder="e.g., Monthly subscriptions $50/month, one-time setup fees, commission on transactions..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Include pricing models, payment frequency, and potential upsells.</p>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Your Business Plan</h2>
              <p className="text-gray-600">A comprehensive plan based on your inputs</p>
            </div>
            
            {generatedPlan && Object.entries(generatedPlan).map(([section, content]) => (
              <Card key={section} className="p-6 border-0 shadow-lg">
                <h3 className="text-xl font-bold text-navy-900 mb-4">{section}</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{content as string}</div>
              </Card>
            ))}
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Export PDF
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Create Launch Toolkit →
              </Button>
            </div>
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
          
          {currentStep < 5 && (
            <div className="flex items-center text-sm text-gray-500">
              Step {currentStep} of 4
            </div>
          )}
        </div>

        {selectedIdea && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Building plan for: {selectedIdea.title}</h3>
                <p className="text-sm text-blue-700">{selectedIdea.description}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8 border-0 shadow-lg">
          {renderStep()}
          
          {currentStep < 5 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={currentStep === 4 ? generatePlan : () => setCurrentStep(currentStep + 1)}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Generating Plan..." : currentStep === 4 ? "Generate Business Plan" : "Next"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
