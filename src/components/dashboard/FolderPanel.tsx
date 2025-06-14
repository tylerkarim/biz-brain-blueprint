
import { X, ExternalLink, Edit, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FolderPanelProps {
  folderId: string;
  onClose: () => void;
}

export const FolderPanel = ({ folderId, onClose }: FolderPanelProps) => {
  const { user } = useAuth();

  const { data: folderContent, isLoading } = useQuery({
    queryKey: ['folder-content', folderId, user?.id],
    queryFn: async () => {
      if (!user) return null;

      switch (folderId) {
        case 'ai-ideas':
          const { data: ideas } = await supabase
            .from('business_ideas')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          return {
            title: "AI Business Ideas",
            description: "Your generated startup ideas",
            items: ideas || [],
            isEmpty: !ideas || ideas.length === 0
          };
          
        case 'business-plans':
          const { data: plans } = await supabase
            .from('business_plans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          return {
            title: "Business Plans",
            description: "Your business plans and canvases",
            items: plans || [],
            isEmpty: !plans || plans.length === 0
          };
          
        case 'launch-toolkit':
          const { data: assets } = await supabase
            .from('launch_assets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          return {
            title: "Launch Toolkit",
            description: "Logo designs, domain suggestions, and branding assets",
            items: assets || [],
            isEmpty: !assets || assets.length === 0
          };
          
        case 'tasks':
          const { data: tasks } = await supabase
            .from('user_tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          return {
            title: "Tasks",
            description: "AI-generated weekly goals and action items",
            items: tasks || [],
            isEmpty: !tasks || tasks.length === 0
          };
          
        case 'prompt-history':
          const { data: history } = await supabase
            .from('prompt_history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          return {
            title: "Prompt History",
            description: "All your AI conversations and prompts",
            items: history || [],
            isEmpty: !history || history.length === 0
          };
          
        default:
          return {
            title: "Resources",
            description: "Templates, guides, and downloadable files",
            items: [],
            isEmpty: true
          };
      }
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-navy-900">Loading...</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!folderContent) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-navy-900">Folder</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-600">Please log in to view folder contents.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getItemTitle = (item: any) => {
    if (folderId === 'ai-ideas' || folderId === 'business-plans' || folderId === 'launch-toolkit') {
      return item.title || item.business_name;
    }
    if (folderId === 'tasks') {
      return item.title;
    }
    if (folderId === 'prompt-history') {
      return `${item.tool_name} - ${item.prompt.substring(0, 50)}...`;
    }
    return 'Item';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-navy-900">{folderContent.title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-gray-600 mb-6">{folderContent.description}</p>
      
      {folderContent.isEmpty ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">This folder is empty</p>
          <Button className="bg-primary hover:bg-primary/90">
            Create your first item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {folderContent.items.map((item: any, index: number) => (
            <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-navy-900">{getItemTitle(item)}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
