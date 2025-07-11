
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { IdeaGeneratorFlow } from "@/components/guided-flows/IdeaGeneratorFlow";
import { BusinessPlanFlow } from "@/components/guided-flows/BusinessPlanFlow";
import { LaunchToolkitFlow } from "@/components/guided-flows/LaunchToolkitFlow";
import { TasksFlow } from "@/components/guided-flows/TasksFlow";

type ActiveTool = null | 'idea-generator' | 'business-plan' | 'launch-toolkit' | 'tasks' | 'prompt-history' | 'resources';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
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

  // Render active tool flow - these should take full screen without sidebar
  if (activeTool === 'idea-generator') {
    return <IdeaGeneratorFlow onBack={handleBackToDashboard} />;
  }

  if (activeTool === 'business-plan') {
    return <BusinessPlanFlow onBack={handleBackToDashboard} selectedIdea={selectedIdea} />;
  }

  if (activeTool === 'launch-toolkit') {
    return <LaunchToolkitFlow onBack={handleBackToDashboard} />;
  }

  if (activeTool === 'tasks') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16">
          <TasksFlow onBack={handleBackToDashboard} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-dm-sans">
      {/* Sidebar - Hidden on mobile, shown as overlay */}
      <DashboardSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:ml-0">
        <Navigation />
        
        <main className="flex-1 pt-16 bg-gray-50 px-4 md:px-0">
          {activeSection === 'overview' ? (
            <DashboardOverview onToolStart={handleToolStart} />
          ) : (
            <DashboardTable
              section={activeSection}
              onBack={handleBackToOverview}
              onToolStart={handleToolStart}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
