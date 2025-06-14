
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 bg-white">
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
