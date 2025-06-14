
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface IdeaGeneratorFlowProps {
  onBack: () => void;
}

interface GeneratedIdea {
  id: string;
  name: string;
  description: string;
  problem: string;
  solution: string;
  targetAudience: string;
  monetization: string;
  whyMatch: string;
  created_at: string;
}

export const IdeaGeneratorFlow = ({ onBack }: IdeaGeneratorFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    skills: "",
    problems: "",
    industries: ""
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
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
          problems: formData.problems,
          industries: formData.industries
        }
      });

      if (error) throw error;

      setGeneratedIdeas(data.ideas);
      setCurrentStep(4); // Results step
      
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
      console.error('Error deleting idea:', error);
      toast({
        title: "Error",
        description: "Failed to delete idea.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Let's discover your strengths</h2>
              <p className="text-gray-600">I'll help you identify business opportunities that match your unique skills.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What are your core skills, expertise, or professional background?
              </label>
              <Input
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="e.g., Software development, digital marketing, graphic design, project management..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Think about what you're naturally good at or have years of experience doing.</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">What problems do you want to solve?</h2>
              <p className="text-gray-600">Great businesses solve real problems that people face every day.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What frustrations, inefficiencies, or gaps do you notice in your daily life or work?
              </label>
              <Input
                value={formData.problems}
                onChange={(e) => setFormData(prev => ({ ...prev, problems: e.target.value }))}
                placeholder="e.g., Time management, finding reliable services, communication between teams..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">What makes you think 'there has to be a better way to do this'?</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Which industries interest you?</h2>
              <p className="text-gray-600">Let's focus on markets where you'd be excited to build something.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Are there specific industries, markets, or customer types you're passionate about?
              </label>
              <Input
                value={formData.industries}
                onChange={(e) => setFormData(prev => ({ ...prev, industries: e.target.value }))}
                placeholder="e.g., Healthcare, education, sustainability, small businesses, remote work..."
                className="w-full h-12"
              />
              <p className="text-sm text-gray-500 mt-2">Think about areas where you'd love to make an impact or have personal experience.</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Your Personalized Business Ideas</h2>
              <p className="text-gray-600">Based on your skills and interests, here are AI-generated startup opportunities.</p>
            </div>
            
            <div className="grid gap-6">
              {generatedIdeas.map((idea) => (
                <Card key={idea.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-navy-900">{idea.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteIdea(idea.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{idea.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Problem</h4>
                      <p className="text-sm text-gray-600">{idea.problem}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Solution</h4>
                      <p className="text-sm text-gray-600">{idea.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Target Market</h4>
                      <p className="text-sm text-gray-600">{idea.targetAudience}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Revenue Model</h4>
                      <p className="text-sm text-gray-600">{idea.monetization}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-1">Why This Matches You</h4>
                    <p className="text-sm text-blue-700">{idea.whyMatch}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Badge variant="secondary">
                      Created {new Date(idea.created_at).toLocaleDateString()}
                    </Badge>
                    <Button className="bg-primary hover:bg-primary/90">
                      Build Business Plan →
                    </Button>
                  </div>
                </Card>
              ))}
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
                onClick={handleNext}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Generating Ideas..." : currentStep === 3 ? "Generate My Ideas" : "Next"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
