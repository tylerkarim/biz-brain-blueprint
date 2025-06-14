
import { Card } from "@/components/ui/card";
import { Globe, Palette, Plane } from "lucide-react";

const stats = [
  {
    company: "Webflow",
    icon: Globe,
    percentage: "84%",
    description: "Increase in self-service rate",
    color: "from-blue-500 to-blue-600"
  },
  {
    company: "Dribbble",
    icon: Palette,
    percentage: "87%",
    description: "Completely automated end-to-end sales",
    color: "from-pink-500 to-pink-600"
  },
  {
    company: "Expedia",
    icon: Plane,
    percentage: "78%",
    description: "Reduction in agent call volume",
    color: "from-yellow-500 to-orange-500"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-700">{stat.company}</span>
              </div>
              
              <div className="mb-3">
                <span className="text-4xl font-bold text-navy-900">{stat.percentage}</span>
              </div>
              
              <p className="text-gray-600 font-medium">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
