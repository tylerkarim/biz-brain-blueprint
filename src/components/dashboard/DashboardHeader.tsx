
import { Search } from "lucide-react";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DashboardHeader = ({ searchQuery, onSearchChange }: DashboardHeaderProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-navy-900 mb-2">Dashboard</h1>
          <p className="text-xl text-gray-600">Organize and manage your business ideas</p>
        </div>
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search tools and content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
};
