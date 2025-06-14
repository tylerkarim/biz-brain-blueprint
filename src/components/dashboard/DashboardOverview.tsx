import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Lightbulb, FileText, Rocket, CheckSquare, History, FolderOpen, Plus, ArrowRight } from "lucide-react";
interface DashboardOverviewProps {
  onToolStart: (toolName: string) => void;
}
export const DashboardOverview = ({
  onToolStart
}: DashboardOverviewProps) => {
  const {
    user
  } = useAuth();

  // Fetch counts for each section
  const {
    data: counts
  } = useQuery({
    queryKey: ['dashboard-counts', user?.id],
    queryFn: async () => {
      if (!user) return {};
      const [ideas, plans, assets, tasks, history] = await Promise.all([supabase.from('business_ideas').select('id', {
        count: 'exact'
      }).eq('user_id', user.id), supabase.from('business_plans').select('id', {
        count: 'exact'
      }).eq('user_id', user.id), supabase.from('launch_assets').select('id', {
        count: 'exact'
      }).eq('user_id', user.id), supabase.from('user_tasks').select('id', {
        count: 'exact'
      }).eq('user_id', user.id), supabase.from('prompt_history').select('id', {
        count: 'exact'
      }).eq('user_id', user.id)]);
      return {
        ideas: ideas.count || 0,
        plans: plans.count || 0,
        assets: assets.count || 0,
        tasks: tasks.count || 0,
        history: history.count || 0
      };
    },
    enabled: !!user
  });
  const tools = [{
    id: 'idea-generator',
    title: 'AI Business Ideas',
    description: 'Generate validated startup ideas',
    icon: Lightbulb,
    count: counts?.ideas || 0,
    color: 'bg-blue-50 text-blue-600',
    iconColor: 'text-blue-600'
  }, {
    id: 'business-plan',
    title: 'Business Plans',
    description: 'Create comprehensive business plans',
    icon: FileText,
    count: counts?.plans || 0,
    color: 'bg-green-50 text-green-600',
    iconColor: 'text-green-600'
  }, {
    id: 'launch-toolkit',
    title: 'Launch Toolkit',
    description: 'Brand assets and launch materials',
    icon: Rocket,
    count: counts?.assets || 0,
    color: 'bg-purple-50 text-purple-600',
    iconColor: 'text-purple-600'
  }, {
    id: 'tasks',
    title: 'Tasks',
    description: 'Action items and milestones',
    icon: CheckSquare,
    count: counts?.tasks || 0,
    color: 'bg-orange-50 text-orange-600',
    iconColor: 'text-orange-600'
  }];
  return <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage your business ideas and projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tools.map(tool => {
          const IconComponent = tool.icon;
          return <div key={tool.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${tool.iconColor}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {tool.count}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">{tool.title}</h3>
                <p className="text-gray-500 text-xs mb-3">{tool.description}</p>
                
              </div>;
        })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900 text-sm">Recent Activity</h2>
          </div>
          <div className="p-4">
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <History className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-gray-400 text-xs mt-1">Start using the tools above to see your activity here</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};