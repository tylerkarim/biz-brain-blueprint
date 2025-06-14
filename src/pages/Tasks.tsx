
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Tasks = () => {
  const [businessGoal, setBusinessGoal] = useState("");
  const [timeframe, setTimeframe] = useState("week");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: tasks, refetch } = useQuery({
    queryKey: ['user-tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const { data: businessIdeas } = useQuery({
    queryKey: ['business-ideas', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('business_ideas')
        .select('id, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user
  });

  const handleGenerateTasks = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate tasks.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-tasks', {
        body: { businessGoal, timeframe }
      });

      if (error) throw error;

      await refetch();
      toast({
        title: "Tasks Generated!",
        description: `Your ${timeframe}ly tasks have been created and saved.`,
      });

      setBusinessGoal("");

    } catch (error) {
      console.error('Error generating tasks:', error);
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      await supabase
        .from('user_tasks')
        .update({ completed })
        .eq('id', taskId)
        .eq('user_id', user?.id);
      
      await refetch();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive"
      });
    }
  };

  const useExistingIdea = (ideaTitle: string) => {
    setBusinessGoal(`Build a business around: ${ideaTitle}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">AI Task Generator</h1>
            <p className="text-xl text-gray-600">Get personalized action items for your business goals</p>
          </div>

          {businessIdeas && businessIdeas.length > 0 && (
            <Card className="p-6 mb-8 border-0 shadow-lg">
              <h2 className="text-lg font-semibold text-navy-900 mb-4">Use an existing business idea:</h2>
              <div className="flex flex-wrap gap-2">
                {businessIdeas.map((idea) => (
                  <Button
                    key={idea.id}
                    variant="outline"
                    size="sm"
                    onClick={() => useExistingIdea(idea.title)}
                    className="text-sm"
                  >
                    {idea.title}
                  </Button>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-8 mb-12 border-0 shadow-lg">
            <form onSubmit={handleGenerateTasks} className="space-y-6">
              <div>
                <label htmlFor="businessGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  What business goal or idea do you want to work on?
                </label>
                <Input
                  id="businessGoal"
                  value={businessGoal}
                  onChange={(e) => setBusinessGoal(e.target.value)}
                  placeholder="e.g., Launch my SaaS product, Start a consulting business..."
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-2">
                  Generate tasks for:
                </label>
                <select
                  id="timeframe"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 py-3"
                disabled={isLoading || !user}
              >
                {isLoading ? "Generating tasks with AI..." : `Generate ${timeframe}ly Tasks`}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 text-center">
                  Please log in to generate tasks.
                </p>
              )}
            </form>
          </Card>

          {tasks && tasks.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-navy-900">Your Tasks</h2>
              
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-6 border-0 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => 
                          handleTaskToggle(task.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-navy-900'}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              task.priority === 'high' ? 'destructive' : 
                              task.priority === 'medium' ? 'default' : 
                              'secondary'
                            }>
                              {task.priority}
                            </Badge>
                            {task.due_date && (
                              <Badge variant="outline">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {task.description && (
                          <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
