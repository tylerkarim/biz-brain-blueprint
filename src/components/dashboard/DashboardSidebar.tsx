
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Lightbulb, 
  FileText, 
  Rocket, 
  CheckSquare, 
  History, 
  FolderOpen,
  BarChart3
} from "lucide-react";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  const { user } = useAuth();

  // Fetch counts for each section
  const { data: counts } = useQuery({
    queryKey: ['dashboard-counts', user?.id],
    queryFn: async () => {
      if (!user) return {};

      const [ideas, plans, assets, tasks, history] = await Promise.all([
        supabase.from('business_ideas').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('business_plans').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('launch_assets').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('user_tasks').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('prompt_history').select('id', { count: 'exact' }).eq('user_id', user.id),
      ]);

      return {
        ideas: ideas.count || 0,
        plans: plans.count || 0,
        assets: assets.count || 0,
        tasks: tasks.count || 0,
        history: history.count || 0,
      };
    },
    enabled: !!user
  });

  const sidebarItems = [
    {
      id: 'overview',
      title: 'Dashboard',
      icon: BarChart3,
      count: null,
      isActive: activeSection === 'overview'
    },
    {
      id: 'ideas',
      title: 'AI Business Ideas',
      icon: Lightbulb,
      count: counts?.ideas || 0,
      isActive: activeSection === 'ideas'
    },
    {
      id: 'plans',
      title: 'Business Plans',
      icon: FileText,
      count: counts?.plans || 0,
      isActive: activeSection === 'plans'
    },
    {
      id: 'launch',
      title: 'Launch Toolkit',
      icon: Rocket,
      count: counts?.assets || 0,
      isActive: activeSection === 'launch'
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: CheckSquare,
      count: counts?.tasks || 0,
      isActive: activeSection === 'tasks'
    },
    {
      id: 'history',
      title: 'Prompt History',
      icon: History,
      count: counts?.history || 0,
      isActive: activeSection === 'history'
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: FolderOpen,
      count: 0,
      isActive: activeSection === 'resources'
    },
  ];

  return (
    <div className="w-64 bg-blue-600 min-h-screen text-white flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-xl font-bold">BuildAura</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                  item.isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-100 hover:bg-blue-500/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </div>
                {item.count !== null && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      item.isActive ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {item.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-500">
        <div className="text-xs text-blue-200">
          <p>BuildAura Dashboard</p>
          <p>AI Business Partner</p>
        </div>
      </div>
    </div>
  );
};
