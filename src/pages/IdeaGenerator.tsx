
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const IdeaGenerator = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        body: { skills, interests }
      });

      if (error) throw error;

      setIdeas(data);
      toast({
        title: "Ideas Generated!",
        description: "Your personalized business ideas have been created and saved.",
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

  const handleSaveIdea = async (idea: any) => {
    if (!user) return;

    try {
      toast({
        title: "Idea Saved!",
        description: "This idea has been saved to your dashboard.",
      });
    } catch (error) {
      console.error('Error saving idea:', error);
      toast({
        title: "Error",
        description: "Failed to save idea.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">AI Business Idea Generator</h1>
            <p className="text-xl text-gray-600">Get 5 personalized startup ideas based on your skills and interests</p>
          </div>

          <Card className="p-8 mb-12 border-0 shadow-lg">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  What are your skills? (e.g., programming, marketing, design)
                </label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="JavaScript, UI/UX design, digital marketing..."
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
                  What are you passionate about? (e.g., sustainability, fitness, education)
                </label>
                <Input
                  id="interests"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Environmental protection, health & wellness, productivity..."
                  required
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 py-3"
                disabled={isLoading || !user}
              >
                {isLoading ? "Generating ideas with AI..." : "Generate 5 Business Ideas"}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 text-center">
                  Please log in to generate personalized business ideas.
                </p>
              )}
            </form>
          </Card>

          {ideas.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-navy-900 text-center">Your Personalized Business Ideas</h2>
              
              {ideas.map((idea, index) => (
                <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-navy-900">{idea.title}</h3>
                    <Badge variant={idea.difficulty === 'Low' ? 'secondary' : idea.difficulty === 'Medium' ? 'default' : 'destructive'}>
                      {idea.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">{idea.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{idea.market}</div>
                      <div className="text-sm text-gray-600">Market Size</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{idea.timeToMarket}</div>
                      <div className="text-sm text-gray-600">Time to Market</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">#{index + 1}</div>
                      <div className="text-sm text-gray-600">Idea Rank</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleSaveIdea(idea)}
                  >
                    Saved to Dashboard - Create Business Plan
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IdeaGenerator;
