
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BusinessPlanFlow } from "@/components/flows/BusinessPlanFlow";

const BusinessPlan = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 bg-white">
          <BusinessPlanFlow />
        </main>
      </div>
    </div>
  );
};

export default BusinessPlan;
