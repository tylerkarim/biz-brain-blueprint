
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const IdeaGenerator = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedIdeas = [
        {
          title: "Eco-Friendly Meal Kit Service",
          description: "A subscription service delivering organic, locally-sourced ingredients with zero-waste packaging to environmentally conscious consumers.",
          market: "$15.7B",
          difficulty: "Medium",
          timeToMarket: "6-9 months"
        },
        {
          title: "AI-Powered Fitness Coach App",
          description: "Personalized workout and nutrition plans using computer vision to analyze form and provide real-time feedback.",
          market: "$4.4B",
          difficulty: "High",
          timeToMarket: "12-18 months"
        },
        {
          title: "Remote Team Collaboration Platform",
          description: "A virtual office space with spatial audio, gesture recognition, and seamless integration with productivity tools.",
          market: "$8.9B",
          difficulty: "High",
          timeToMarket: "15-24 months"
        },
        {
          title: "Smart Home Energy Optimizer",
          description: "IoT devices that learn household patterns and automatically optimize energy consumption to reduce bills.",
          market: "$2.3B",
          difficulty: "Medium",
          timeToMarket: "9-12 months"
        },
        {
          title: "Micro-Learning Language App",
          description: "Bite-sized language lessons integrated into daily apps and workflows for busy professionals.",
          market: "$1.8B",
          difficulty: "Low",
          timeToMarket: "3-6 months"
        }
      ];
      
      setIdeas(generatedIdeas);
      setIsLoading(false);
    }, 3000);
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
                disabled={isLoading}
              >
                {isLoading ? "Generating ideas with AI..." : "Generate 5 Business Ideas"}
              </Button>
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
                  
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Save to Dashboard & Create Business Plan
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
