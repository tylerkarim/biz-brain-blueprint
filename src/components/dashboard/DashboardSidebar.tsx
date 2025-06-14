import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  FileText, 
  Rocket, 
  CheckSquare, 
  History, 
  FolderOpen,
  BarChart3,
  X,
  Menu
} from "lucide-react";

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const queryClient = useQueryClient();

  // Set up real-time subscriptions to invalidate counts when data changes
  useEffect(() => {
    if (!user) return;

    const channels = [
      supabase
        .channel('business_ideas_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'business_ideas' }, () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-counts', user.id] });
        })
        .subscribe(),

      supabase
        .channel('business_plans_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'business_plans' }, () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-counts', user.id] });
        })
        .subscribe(),

      supabase
        .channel('launch_assets_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'launch_assets' }, () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-counts', user.id] });
        })
        .subscribe(),

      supabase
        .channel('user_tasks_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_tasks' }, () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-counts', user.id] });
        })
        .subscribe(),

      supabase
        .channel('prompt_history_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'prompt_history' }, () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-counts', user.id] });
        })
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, queryClient]);

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

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-20 left-4 z-50 md:hidden bg-white shadow-lg border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-64 md:w-56 bg-blue-600 text-white flex flex-col font-dm-sans
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-blue-500/20">
          <h1 className="text-lg font-medium text-white">BuildAura</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="text-white hover:bg-blue-500/40"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:block px-4 py-4 border-b border-blue-500/20">
          <h1 className="text-lg font-medium text-white">BuildAura</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 md:py-2 rounded-md text-left transition-all duration-150 group text-sm ${
                    item.isActive 
                      ? 'bg-blue-500/80 text-white' 
                      : 'text-blue-100 hover:bg-blue-500/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="font-normal">{item.title}</span>
                  </div>
                  {item.count !== null && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-1.5 py-0.5 rounded-full font-normal border-0 ${
                        item.isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-500/30 text-blue-100'
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
      </div>
    </>
  );
};
