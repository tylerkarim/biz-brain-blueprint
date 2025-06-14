
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { IdeaGeneratorFlow } from "@/components/flows/IdeaGeneratorFlow";

const IdeaGenerator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 bg-white">
          <IdeaGeneratorFlow />
        </main>
      </div>
    </div>
  );
};

export default IdeaGenerator;
