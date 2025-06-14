
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GoBackButton } from "@/components/common/GoBackButton";
import { useQuery } from "@tanstack/react-query";

export const BusinessPlanFlow = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    targetCustomer: "",
    uniqueAdvantage: "",
    solution: "",
    revenueChannels: ""
  });
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: existingIdeas } = useQuery({
    queryKey: ['business-ideas-for-plan', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('business_ideas')
        .select('id, title, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user && step === 1
  });

  const generateBusinessPlan = async () => {
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
          businessName: formData.businessName || selectedIdea,
          industry: "General",
          targetMarket: formData.targetCustomer,
          problem: "Customer pain points",
          solution: formData.solution,
          revenue: formData.revenueChannels,
          competition: formData.uniqueAdvantage
        }
      });

      if (error) throw error;

      setGeneratedPlan(data.plan);
      setStep(6);
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

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      generateBusinessPlan();
    }
  };

  if (step === 6 && generatedPlan) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <GoBackButton />
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Business Plan</h1>
          <p className="text-gray-600 font-medium">AI-generated comprehensive plan for {formData.businessName || selectedIdea}</p>
        </div>

        <div className="space-y-6">
          {Object.entries(generatedPlan).map(([section, content]) => (
            <Card key={section} className="p-6 border-0 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{section}</h2>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-gray-700 font-medium whitespace-pre-line">{content as string}</div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => {
              setStep(1);
              setFormData({
                businessName: "",
                targetCustomer: "",
                uniqueAdvantage: "",
                solution: "",
                revenueChannels: ""
              });
              setGeneratedPlan(null);
              setSelectedIdea("");
            }}
            className="bg-green-600 hover:bg-green-700 font-medium"
          >
            Create Another Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <GoBackButton />
      
      <div className="text-center mb-8">
        <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Plan Builder</h1>
        <p className="text-gray-600 font-medium">Let's create a comprehensive business plan step by step</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-900">Step {step} of 5</span>
          <span className="text-sm font-medium text-gray-600">{Math.round((step / 5) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
      </div>

      <Card className="p-8 border-0 shadow-lg">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose your business idea</h2>
            <p className="text-gray-600 font-medium">Select an existing idea or describe a new one:</p>
            
            {existingIdeas && existingIdeas.length > 0 && (
              <div className="space-y-3">
                <p className="font-bold text-gray-900">Your existing ideas:</p>
                {existingIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedIdea === idea.title ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedIdea(idea.title);
                      setFormData(prev => ({ ...prev, businessName: idea.title }));
                    }}
                  >
                    <h3 className="font-bold text-gray-900">{idea.title}</h3>
                    <p className="text-sm text-gray-600 font-medium">{idea.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3">
              <p className="font-bold text-gray-900">Or enter a new business idea:</p>
              <Textarea
                value={formData.businessName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, businessName: e.target.value }));
                  setSelectedIdea("");
                }}
                placeholder="Describe your business idea..."
                className="min-h-24 font-medium"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Who is your target customer?</h2>
            <p className="text-gray-600 font-medium">Be specific about demographics, needs, and behaviors.</p>
            <Textarea
              value={formData.targetCustomer}
              onChange={(e) => setFormData(prev => ({ ...prev, targetCustomer: e.target.value }))}
              placeholder="e.g., Small business owners aged 25-45 who struggle with managing finances and need simple accounting solutions..."
              className="min-h-32 font-medium"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What's your unique advantage?</h2>
            <p className="text-gray-600 font-medium">What makes you different from competitors? What's your unfair advantage?</p>
            <Textarea
              value={formData.uniqueAdvantage}
              onChange={(e) => setFormData(prev => ({ ...prev, uniqueAdvantage: e.target.value }))}
              placeholder="e.g., 10 years experience in the industry, proprietary technology, exclusive partnerships, unique approach..."
              className="min-h-32 font-medium"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Describe your solution in action</h2>
            <p className="text-gray-600 font-medium">How does your product/service work? What's the user experience?</p>
            <Textarea
              value={formData.solution}
              onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
              placeholder="e.g., Users sign up, connect their bank account, our AI categorizes expenses automatically, generates reports..."
              className="min-h-32 font-medium"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">How will you make money?</h2>
            <p className="text-gray-600 font-medium">Describe your main revenue streams and pricing strategy.</p>
            <Textarea
              value={formData.revenueChannels}
              onChange={(e) => setFormData(prev => ({ ...prev, revenueChannels: e.target.value }))}
              placeholder="e.g., Monthly subscription $29/month, transaction fees 2.9%, enterprise plans $199/month, affiliate commissions..."
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
            disabled={isLoading || (step === 1 && !formData.businessName.trim() && !selectedIdea)}
            className="bg-green-600 hover:bg-green-700 font-medium"
          >
            {isLoading ? "Generating Plan..." : step === 5 ? "Generate Business Plan" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
