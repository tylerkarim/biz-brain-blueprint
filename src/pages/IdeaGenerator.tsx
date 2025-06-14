import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { IdeasTable } from "@/components/ideas/IdeasTable";
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

  const handleGenerateIdeas = async (e: React.FormEvent) => {
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
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Business Ideas</h1>
                <p className="text-gray-600">{ideas?.length || 0} ideas found</p>
              </div>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border rounded-lg text-sm">
                  <option>All status</option>
                  <option>New</option>
                  <option>Drafted</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Search ideas..."
                  className="px-3 py-2 border rounded-lg text-sm w-64"
                />
              </div>
            </div>

            {/* Generate Ideas Form */}
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-3">Generate New Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., Programming, Marketing, Design"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Interests</label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., Health, Technology, Education"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <Button 
                onClick={handleGenerateIdeas} 
                disabled={isLoading || !skills.trim() || !interests.trim()}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Generating Ideas...' : 'Generate AI Ideas'}
              </Button>
            </div>

            <IdeasTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default IdeaGenerator;
