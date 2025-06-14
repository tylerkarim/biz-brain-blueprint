
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FolderGrid } from "@/components/dashboard/FolderGrid";
import { IdeaGeneratorFlow } from "@/components/guided-flows/IdeaGeneratorFlow";
import { BusinessPlanFlow } from "@/components/guided-flows/BusinessPlanFlow";

type ActiveTool = null | 'idea-generator' | 'business-plan' | 'launch-toolkit' | 'tasks' | 'prompt-history' | 'resources';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);

  const handleToolStart = (toolName: string, idea?: any) => {
    setActiveTool(toolName as ActiveTool);
    if (idea) {
      setSelectedIdea(idea);
    }
  };

  const handleBackToDashboard = () => {
    setActiveTool(null);
    setSelectedIdea(null);
    setActiveSection('overview');
  };

  const handleBackToOverview = () => {
    setActiveSection('overview');
  };

  // Render active tool flow
  if (activeTool === 'idea-generator') {
    return <IdeaGeneratorFlow onBack={handleBackToDashboard} />;
  }

  if (activeTool === 'business-plan') {
    return <BusinessPlanFlow onBack={handleBackToDashboard} selectedIdea={selectedIdea} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navigation />
        
        <main className="flex-1 pt-16 p-8">
          {activeSection === 'overview' ? (
            <div className="max-w-7xl mx-auto">
              <DashboardHeader 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <FolderGrid 
                onFolderClick={setActiveSection}
                searchQuery={searchQuery}
                onToolStart={handleToolStart}
              />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <DashboardTable
                section={activeSection}
                onBack={handleBackToOverview}
                onToolStart={handleToolStart}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
