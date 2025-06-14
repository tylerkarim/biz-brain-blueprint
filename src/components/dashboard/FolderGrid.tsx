
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FolderCard } from "./FolderCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Lightbulb, 
  FileText, 
  Rocket, 
  CheckSquare, 
  History, 
  FolderOpen,
  Play,
  Trash2,
  Eye
} from "lucide-react";

interface FolderGridProps {
  onFolderClick: (folderId: string) => void;
  searchQuery: string;
  onToolStart: (toolName: string, idea?: any) => void;
}

export const FolderGrid = ({ onFolderClick, searchQuery, onToolStart }: FolderGridProps) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<string>('overview');

  // Fetch user data for each section
  const { data: businessIdeas } = useQuery({
    queryKey: ['business-ideas', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('business_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const { data: businessPlans } = useQuery({
    queryKey: ['business-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('business_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  const { data: tasks } = useQuery({
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

  const folders = [
    {
      id: "ideas",
      title: "AI Business Ideas",
      description: "Generate startup concepts",
      icon: Lightbulb,
      color: "bg-blue-500",
      count: businessIdeas?.length || 0,
      lastUpdated: "2 hours ago"
    },
    {
      id: "plans",
      title: "Business Plans",
      description: "Comprehensive planning",
      icon: FileText,
      color: "bg-green-500", 
      count: businessPlans?.length || 0,
      lastUpdated: "1 day ago"
    },
    {
      id: "launch",
      title: "Launch Toolkit",
      description: "Branding & assets",
      icon: Rocket,
      color: "bg-purple-500",
      count: 0,
      lastUpdated: "Never"
    },
    {
      id: "tasks",
      title: "Tasks",
      description: "Action items & goals",
      icon: CheckSquare,
      color: "bg-orange-500",
      count: tasks?.length || 0,
      lastUpdated: "3 hours ago"
    },
    {
      id: "history",
      title: "Prompt History",
      description: "AI conversation log",
      icon: History,
      color: "bg-gray-500",
      count: 0,
      lastUpdated: "1 hour ago"
    },
    {
      id: "resources",
      title: "Resources",
      description: "Templates & files",
      icon: FolderOpen,
      color: "bg-indigo-500",
      count: 0,
      lastUpdated: "Never"
    }
  ];

  const filteredFolders = folders.filter(folder =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteIdea = async (ideaId: string) => {
    await supabase
      .from('business_ideas')
      .delete()
      .eq('id', ideaId)
      .eq('user_id', user?.id);
  };

  const deletePlan = async (planId: string) => {
    await supabase
      .from('business_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', user?.id);
  };

  if (activeView === 'ideas') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="text-gray-600"
          >
            ← Back to Dashboard
          </Button>
          <Button 
            onClick={() => onToolStart('idea-generator')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Start with AI
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">AI Business Ideas</h2>
            
            {businessIdeas && businessIdeas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Idea Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessIdeas.map((idea, index) => (
                    <TableRow key={idea.id}>
                      <TableCell className="font-mono text-sm">#{(index + 1).toString().padStart(3, '0')}</TableCell>
                      <TableCell className="font-medium">{idea.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Startup</Badge>
                      </TableCell>
                      <TableCell>{new Date(idea.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">New</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onToolStart('business-plan', idea)}
                            title="Create Business Plan"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteIdea(idea.id)}
                            className="text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No business ideas yet</h3>
                <p className="text-gray-500 mb-6">Start generating AI-powered startup ideas</p>
                <Button 
                  onClick={() => onToolStart('idea-generator')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Generate Your First Ideas
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (activeView === 'plans') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="text-gray-600"
          >
            ← Back to Dashboard
          </Button>
          <Button 
            onClick={() => onToolStart('business-plan')}
            className="bg-green-500 hover:bg-green-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Start with AI
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Business Plans</h2>
            
            {businessPlans && businessPlans.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#ID</TableHead>
                    <TableHead>Plan Title</TableHead>
                    <TableHead>Based on Idea</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessPlans.map((plan, index) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono text-sm">#{(index + 201).toString()}</TableCell>
                      <TableCell className="font-medium">{plan.business_name}</TableCell>
                      <TableCell>{plan.business_name}</TableCell>
                      <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">Complete</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" title="View Plan">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deletePlan(plan.id)}
                            className="text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No business plans yet</h3>
                <p className="text-gray-500 mb-6">Create comprehensive business plans with AI guidance</p>
                <Button 
                  onClick={() => onToolStart('business-plan')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Create Your First Plan
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Default overview with folder grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFolders.map((folder) => (
        <div key={folder.id} className="relative">
          <FolderCard
            {...folder}
            onClick={() => setActiveView(folder.id)}
          />
          
          {/* Start with AI Button */}
          <div className="absolute top-4 right-4">
            <Button 
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                if (folder.id === 'ideas') {
                  onToolStart('idea-generator');
                } else if (folder.id === 'plans') {
                  onToolStart('business-plan');
                }
              }}
              className="bg-white/90 hover:bg-white text-primary border shadow-sm"
            >
              <Play className="h-3 w-3 mr-1" />
              Start with AI
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
