
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
    <div className="w-64 bg-blue-600 min-h-screen text-white flex flex-col font-dm-sans">
      {/* Logo/Brand */}
      <div className="px-6 py-5 border-b border-blue-500/30">
        <h1 className="text-xl font-medium text-white">BuildAura</h1>
        <p className="text-xs text-blue-100 mt-1 font-normal">AI Business Partner</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  item.isActive 
                    ? 'bg-blue-500/90 text-white shadow-sm' 
                    : 'text-blue-100/90 hover:bg-blue-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-4 w-4 ${item.isActive ? 'text-white' : 'text-blue-200'}`} />
                  <span className="text-sm font-normal">{item.title}</span>
                </div>
                {item.count !== null && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-0.5 rounded-full font-normal ${
                      item.isActive 
                        ? 'bg-white/20 text-white border-0' 
                        : 'bg-blue-500/30 text-blue-100 border-0'
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
      <div className="px-4 py-4 border-t border-blue-500/30">
        <div className="text-xs text-blue-200/80 font-normal">
          <p className="font-medium text-blue-100">BuildAura Dashboard</p>
          <p className="mt-0.5">Your AI Business Cofounder</p>
        </div>
      </div>
    </div>
  );
};
