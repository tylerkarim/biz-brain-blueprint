
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListTodo, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { GoBackButton } from "@/components/common/GoBackButton";

const Tasks = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: "",
    hours: "",
    focusType: "strategy"
  });
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

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      generateTasks();
    }
  };

  const generateTasks = async () => {
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
        body: { 
          goal: formData.goal,
          hours: formData.hours,
          focusType: formData.focusType
        }
      });

      if (error) throw error;

      await refetch();
      setStep(4);
      toast({
        title: "Tasks Generated!",
        description: "Your weekly action plan has been created.",
      });

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

  const deleteTask = async (taskId: string) => {
    try {
      await supabase
        .from('user_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user?.id);
      
      await refetch();
      toast({
        title: "Task Deleted",
        description: "The task has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
    }
  };

  const useExistingIdea = (ideaTitle: string) => {
    setFormData(prev => ({ ...prev, goal: `Build a business around: ${ideaTitle}` }));
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="pt-16 flex">
          <Sidebar />
          
          <main className="flex-1 bg-white">
            <div className="max-w-4xl mx-auto p-6">
              <GoBackButton />
              
              <div className="text-center mb-8">
                <ListTodo className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Action Plan</h1>
                <p className="text-gray-600 font-medium">AI-generated weekly tasks to achieve your goal</p>
              </div>

              <div className="grid gap-4">
                {tasks?.map((task) => (
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
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
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
                            <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {task.description && (
                          <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button 
                  onClick={() => {
                    setStep(1);
                    setFormData({ goal: "", hours: "", focusType: "strategy" });
                  }}
                  className="bg-orange-600 hover:bg-orange-700 font-medium"
                >
                  Generate More Tasks
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 bg-white">
          <div className="max-w-2xl mx-auto p-6">
            <GoBackButton />
            
            <div className="text-center mb-8">
              <ListTodo className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Task Generator</h1>
              <p className="text-gray-600 font-medium">Let me create a personalized action plan for your goals</p>
            </div>

            {businessIdeas && businessIdeas.length > 0 && step === 1 && (
              <Card className="p-6 mb-8 border-0 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Use an existing business idea:</h2>
                <div className="flex flex-wrap gap-2">
                  {businessIdeas.map((idea) => (
                    <Button
                      key={idea.id}
                      variant="outline"
                      size="sm"
                      onClick={() => useExistingIdea(idea.title)}
                      className="text-sm font-medium"
                    >
                      {idea.title}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-900">Step {step} of 3</span>
                <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            </div>

            <Card className="p-8 border-0 shadow-lg">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">What do you want to accomplish this week?</h2>
                  <p className="text-gray-600 font-medium">Describe your main business goal or objective for this week.</p>
                  <Input
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    placeholder="e.g., Launch my SaaS product, Validate my business idea, Build my MVP..."
                    className="font-medium"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">How many hours can you dedicate?</h2>
                  <p className="text-gray-600 font-medium">This helps me create realistic tasks that fit your schedule.</p>
                  <Input
                    value={formData.hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                    placeholder="e.g., 5-10 hours, 20+ hours, 2-3 hours daily..."
                    className="font-medium"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Do you need strategy or execution steps?</h2>
                  <p className="text-gray-600 font-medium">Choose the type of tasks that would help you most right now.</p>
                  <div className="space-y-3">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.focusType === 'strategy' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, focusType: 'strategy' }))}
                    >
                      <h3 className="font-bold text-gray-900">Strategy & Planning</h3>
                      <p className="text-sm text-gray-600 font-medium">Market research, business planning, validation</p>
                    </div>
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.focusType === 'execution' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, focusType: 'execution' }))}
                    >
                      <h3 className="font-bold text-gray-900">Execution & Building</h3>
                      <p className="text-sm text-gray-600 font-medium">Development, design, marketing, launch activities</p>
                    </div>
                  </div>
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
                  disabled={isLoading || (step === 1 && !formData.goal.trim())}
                  className="bg-orange-600 hover:bg-orange-700 font-medium"
                >
                  {isLoading ? "Generating Tasks..." : step === 3 ? "Generate Tasks" : "Next"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
