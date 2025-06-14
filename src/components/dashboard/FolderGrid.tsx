
import { FolderCard } from "./FolderCard";
import { Lightbulb, FileText, Rocket, ListTodo, FileText as HistoryIcon, Folder } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FolderGridProps {
  onFolderClick: (folderId: string) => void;
  searchQuery: string;
}

export const FolderGrid = ({ onFolderClick, searchQuery }: FolderGridProps) => {
  const { user } = useAuth();

  const { data: folderCounts } = useQuery({
    queryKey: ['folder-counts', user?.id],
    queryFn: async () => {
      if (!user) return {};

      const [ideas, plans, assets, tasks, history] = await Promise.all([
        supabase.from('business_ideas').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('business_plans').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('launch_assets').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('user_tasks').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('prompt_history').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      return {
        'ai-ideas': ideas.count || 0,
        'business-plans': plans.count || 0,
        'launch-toolkit': assets.count || 0,
        'tasks': tasks.count || 0,
        'prompt-history': history.count || 0,
        'resources': 0
      };
    },
    enabled: !!user
  });

  const folders = [
    {
      id: "ai-ideas",
      title: "AI Business Ideas",
      description: "Generate and save startup ideas",
      icon: Lightbulb,
      count: folderCounts?.['ai-ideas'] || 0,
      countLabel: "ideas",
      href: "/tools/idea-generator"
    },
    {
      id: "business-plans",
      title: "Business Plans",
      description: "AI-generated business plans and canvas",
      icon: FileText,
      count: folderCounts?.['business-plans'] || 0,
      countLabel: "plans",
      href: "/tools/business-plan"
    },
    {
      id: "launch-toolkit",
      title: "Launch Toolkit",
      description: "Logo ideas, domains, and branding",
      icon: Rocket,
      count: folderCounts?.['launch-toolkit'] || 0,
      countLabel: "assets",
      href: "/tools/launch-toolkit"
    },
    {
      id: "tasks",
      title: "Tasks",
      description: "Weekly goals and action items",
      icon: ListTodo,
      count: folderCounts?.['tasks'] || 0,
      countLabel: "pending",
      href: "/dashboard/tasks"
    },
    {
      id: "prompt-history",
      title: "Prompt History",
      description: "All your AI interactions",
      icon: HistoryIcon,
      count: folderCounts?.['prompt-history'] || 0,
      countLabel: "prompts",
      href: "/prompt-history"
    },
    {
      id: "resources",
      title: "Resources",
      description: "Templates and downloadable assets",
      icon: Folder,
      count: 0,
      countLabel: "files",
      href: "/resources"
    }
  ];

  const filteredFolders = folders.filter(folder =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {filteredFolders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No folders match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => onFolderClick(folder.id)}
            />
          ))}
        </div>
      )}
      
      {filteredFolders.length > 0 && searchQuery === "" && !user && (
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Ready to get started?</h3>
            <p className="text-gray-600 mb-4">Please log in to start generating AI-powered business content.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Log In to Start
            </button>
          </div>
        </div>
      )}
      
      {filteredFolders.length > 0 && searchQuery === "" && user && (
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">Ready to get started?</h3>
            <p className="text-gray-600 mb-4">Your folders are empty. Create your first business idea to begin.</p>
            <button
              onClick={() => onFolderClick("ai-ideas")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start your first idea
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
