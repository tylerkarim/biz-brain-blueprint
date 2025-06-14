
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { GoBackButton } from "@/components/common/GoBackButton";

export const IdeaGeneratorFlow = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: "",
    problems: "",
    industries: ""
  });
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      generateIdeas();
    }
  };

  const generateIdeas = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate business ideas.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-business-ideas', {
        body: { 
          skills: formData.skills,
          interests: `${formData.problems} ${formData.industries}`,
          problems: formData.problems,
          industries: formData.industries
        }
      });

      if (error) throw error;

      setGeneratedIdeas(data);
      setStep(4);
      toast({
        title: "Ideas Generated!",
        description: "Your personalized business ideas have been created.",
      });

    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    try {
      await supabase
        .from('business_ideas')
        .delete()
        .eq('id', ideaId)
        .eq('user_id', user?.id);
      
      setGeneratedIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      toast({
        title: "Idea Deleted",
        description: "The business idea has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete idea.",
        variant: "destructive"
      });
    }
  };

  if (step === 4) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <GoBackButton />
        <div className="text-center mb-8">
          <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Business Ideas</h1>
          <p className="text-gray-600 font-medium">AI-generated startup concepts tailored to your profile</p>
        </div>

        <div className="grid gap-6">
          {generatedIdeas.map((idea, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{idea.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteIdea(idea.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-700 mb-4 font-medium">{idea.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-bold text-gray-900">Market:</span>
                  <p className="text-gray-600">{idea.market_size || 'TBD'}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Difficulty:</span>
                  <p className="text-gray-600">{idea.difficulty || 'Medium'}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Timeline:</span>
                  <p className="text-gray-600">{idea.time_to_market || '6-12 months'}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-900">Match:</span>
                  <p className="text-green-600 font-medium">High</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => {
              setStep(1);
              setFormData({ skills: "", problems: "", industries: "" });
              setGeneratedIdeas([]);
            }}
            className="bg-blue-600 hover:bg-blue-700 font-medium"
          >
            Generate More Ideas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <GoBackButton />
      
      <div className="text-center mb-8">
        <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Business Idea Generator</h1>
        <p className="text-gray-600 font-medium">Let me understand your background to suggest perfect startup ideas</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-900">Step {step} of 3</span>
          <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <Card className="p-8 border-0 shadow-lg">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What are your skills and expertise?</h2>
            <p className="text-gray-600 font-medium">Tell me about your professional background, technical skills, or areas where you excel.</p>
            <Textarea
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="e.g., Software development, digital marketing, finance, design, sales, project management..."
              className="min-h-32 font-medium"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What problems frustrate you daily?</h2>
            <p className="text-gray-600 font-medium">Think about inefficiencies, pain points, or challenges you've experienced that could be solved with a business.</p>
            <Textarea
              value={formData.problems}
              onChange={(e) => setFormData(prev => ({ ...prev, problems: e.target.value }))}
              placeholder="e.g., Finding reliable contractors, managing remote teams, tracking personal finances, booking appointments..."
              className="min-h-32 font-medium"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Any specific industries that interest you?</h2>
            <p className="text-gray-600 font-medium">Which markets or sectors do you find exciting or want to impact? (Optional but helpful)</p>
            <Textarea
              value={formData.industries}
              onChange={(e) => setFormData(prev => ({ ...prev, industries: e.target.value }))}
              placeholder="e.g., HealthTech, FinTech, EdTech, SaaS, E-commerce, Sustainability, AI/ML..."
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
            disabled={isLoading || (step === 1 && !formData.skills.trim()) || (step === 2 && !formData.problems.trim())}
            className="bg-blue-600 hover:bg-blue-700 font-medium"
          >
            {isLoading ? "Generating Ideas..." : step === 3 ? "Generate Ideas" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
