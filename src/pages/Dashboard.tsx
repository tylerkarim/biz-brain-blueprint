
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FolderGrid } from "@/components/dashboard/FolderGrid";
import { FolderPanel } from "@/components/dashboard/FolderPanel";

const Dashboard = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleClosePanel = () => {
    setSelectedFolder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <div className="flex gap-8">
            <div className={`transition-all duration-300 ${selectedFolder ? 'w-2/3' : 'w-full'}`}>
              <FolderGrid 
                onFolderClick={handleFolderClick}
                searchQuery={searchQuery}
              />
            </div>
            
            {selectedFolder && (
              <div className="w-1/3">
                <FolderPanel 
                  folderId={selectedFolder}
                  onClose={handleClosePanel}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
