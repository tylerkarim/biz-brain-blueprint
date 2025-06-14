
import { X, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderPanelProps {
  folderId: string;
  onClose: () => void;
}

export const FolderPanel = ({ folderId, onClose }: FolderPanelProps) => {
  const getFolderContent = (id: string) => {
    const contents = {
      "ai-ideas": {
        title: "AI Business Ideas",
        description: "Your generated startup ideas will appear here",
        isEmpty: true,
        items: []
      },
      "business-plans": {
        title: "Business Plans",
        description: "Your business plans and canvases will be stored here",
        isEmpty: true,
        items: []
      },
      "launch-toolkit": {
        title: "Launch Toolkit",
        description: "Logo designs, domain suggestions, and branding assets",
        isEmpty: true,
        items: []
      },
      "tasks": {
        title: "Tasks",
        description: "AI-generated weekly goals and action items",
        isEmpty: true,
        items: []
      },
      "prompt-history": {
        title: "Prompt History",
        description: "All your AI conversations and prompts",
        isEmpty: true,
        items: []
      },
      "resources": {
        title: "Resources",
        description: "Templates, guides, and downloadable files",
        isEmpty: true,
        items: []
      }
    };
    
    return contents[id as keyof typeof contents] || contents["ai-ideas"];
  };

  const content = getFolderContent(folderId);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-navy-900">{content.title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-gray-600 mb-6">{content.description}</p>
      
      {content.isEmpty ? (
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
          {content.items.map((item: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-navy-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.date}</p>
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
