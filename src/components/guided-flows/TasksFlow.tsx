
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface TasksFlowProps {
  onBack: () => void;
}

export const TasksFlow = ({ onBack }: TasksFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    weeklyGoal: "",
    availableHours: "",
    focusType: "execution"
  });

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
          weeklyGoal: formData.weeklyGoal,
          availableHours: formData.availableHours,
          focusType: formData.focusType
        }
      });

      if (error) throw error;

      setGeneratedTasks(data.tasks);
      setCurrentStep(4); // Results step
      
      toast({
        title: "Weekly Tasks Generated!",
        description: "Your action plan has been created.",
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
      
      setGeneratedTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );
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
      
      setGeneratedTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Deleted",
        description: "The task has been removed.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-navy-900 mb-2">What do you want to accomplish this week?</h2>
              <p className="text-sm md:text-base text-gray-600">I'll create a strategic action plan to help you achieve this goal.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your primary weekly goal
              </label>
              <Input
                value={formData.weeklyGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyGoal: e.target.value }))}
                placeholder="e.g., Launch my MVP, validate my business idea, get first 10 customers..."
                className="w-full h-12 text-sm md:text-base"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-2">Be specific about what success looks like this week.</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-navy-900 mb-2">How much time can you dedicate?</h2>
              <p className="text-sm md:text-base text-gray-600">This helps me create a realistic action plan that fits your schedule.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available hours this week
              </label>
              <Input
                value={formData.availableHours}
                onChange={(e) => setFormData(prev => ({ ...prev, availableHours: e.target.value }))}
                placeholder="e.g., 10 hours, 20 hours, 5 hours on weekends..."
                className="w-full h-12 text-sm md:text-base"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-2">Include evenings, weekends, or any time you can work on this.</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-navy-900 mb-2">What type of work do you need?</h2>
              <p className="text-sm md:text-base text-gray-600">This determines whether I focus on planning or hands-on tasks.</p>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Focus area for this week
              </label>
              <div className="grid grid-cols-1 gap-4">
                <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="focusType"
                    value="strategy"
                    checked={formData.focusType === "strategy"}
                    onChange={(e) => setFormData(prev => ({ ...prev, focusType: e.target.value }))}
                    className="text-primary mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm md:text-base">Strategy & Planning</div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">Research, validation, business planning, market analysis</div>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="focusType"
                    value="execution"
                    checked={formData.focusType === "execution"}
                    onChange={(e) => setFormData(prev => ({ ...prev, focusType: e.target.value }))}
                    className="text-primary mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm md:text-base">Execution & Building</div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">Development, marketing, sales, product creation</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-navy-900 mb-2">Your Weekly Action Plan</h2>
              <p className="text-sm md:text-base text-gray-600 px-2">Strategic tasks to achieve: {formData.weeklyGoal}</p>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {generatedTasks.map((task) => (
                <Card key={task.id} className="p-3 md:p-4 border-0 shadow-lg">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => 
                        handleTaskToggle(task.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                        <h3 className={`font-semibold text-sm md:text-base ${task.completed ? 'line-through text-gray-500' : 'text-navy-900'} pr-2`}>
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={
                            task.priority === 'high' ? 'destructive' : 
                            task.priority === 'medium' ? 'default' : 
                            'secondary'
                          } className="text-xs">
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <Badge variant="outline" className="text-xs">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {task.description && (
                        <p className={`text-xs md:text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-0 sm:mr-4 w-fit"
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

      <Card className="p-4 md:p-8 border-0 shadow-lg">
        {renderStep()}
        
        {currentStep < 4 && (
          <div className="flex flex-col sm:flex-row justify-between mt-6 md:mt-8 space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Previous
            </Button>
            <Button
              onClick={currentStep === 3 ? generateTasks : () => setCurrentStep(currentStep + 1)}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? "Generating Tasks..." : currentStep === 3 ? "Generate Action Plan" : "Next"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
