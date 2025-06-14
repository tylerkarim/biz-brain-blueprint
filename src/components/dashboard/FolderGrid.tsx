
import { FolderCard } from "./FolderCard";
import { Lightbulb, FileText, Rocket, ListTodo, FileText as HistoryIcon, Folder } from "lucide-react";

interface FolderGridProps {
  onFolderClick: (folderId: string) => void;
  searchQuery: string;
}

export const FolderGrid = ({ onFolderClick, searchQuery }: FolderGridProps) => {
  const folders = [
    {
      id: "ai-ideas",
      title: "AI Business Ideas",
      description: "Generate and save startup ideas",
      icon: Lightbulb,
      count: 0,
      countLabel: "ideas",
      href: "/tools/idea-generator"
    },
    {
      id: "business-plans",
      title: "Business Plans",
      description: "AI-generated business plans and canvas",
      icon: FileText,
      count: 0,
      countLabel: "plans",
      href: "/tools/business-plan"
    },
    {
      id: "launch-toolkit",
      title: "Launch Toolkit",
      description: "Logo ideas, domains, and branding",
      icon: Rocket,
      count: 0,
      countLabel: "assets",
      href: "/tools/launch-toolkit"
    },
    {
      id: "tasks",
      title: "Tasks",
      description: "Weekly goals and action items",
      icon: ListTodo,
      count: 0,
      countLabel: "pending",
      href: "/dashboard/tasks"
    },
    {
      id: "prompt-history",
      title: "Prompt History",
      description: "All your AI interactions",
      icon: HistoryIcon,
      count: 0,
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
      
      {filteredFolders.length > 0 && searchQuery === "" && (
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
