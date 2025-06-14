
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FolderCardProps {
  folder: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    count: number;
    countLabel: string;
    href: string;
  };
  onClick: () => void;
}

export const FolderCard = ({ folder, onClick }: FolderCardProps) => {
  const IconComponent = folder.icon;
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="text-sm text-gray-500">
          {folder.count} {folder.countLabel}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-navy-900 mb-2 group-hover:text-primary transition-colors">
        {folder.title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed">
        {folder.description}
      </p>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          to={folder.href}
          className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Open →
        </Link>
      </div>
    </div>
  );
};
