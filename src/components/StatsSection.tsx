
import { Card } from "@/components/ui/card";

const stats = [
  {
    company: "Webflow",
    logo: "🌐",
    percentage: "84%",
    description: "Increase in self-service rate",
    color: "from-purple-500 to-pink-500"
  },
  {
    company: "Dribbble",
    logo: "🎨",
    percentage: "87%",
    description: "Completely automated end-to-end sales",
    color: "from-pink-500 to-purple-500"
  },
  {
    company: "Expedia",
    logo: "✈️",
    percentage: "78%",
    description: "Reduction in agent call volume",
    color: "from-blue-500 to-purple-500"
  }
];

export const StatsSection = () => {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 shadow-lg bg-gradient-to-br from-gray-800 to-gray-900"
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white text-xl`}>
                  {stat.logo}
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-200">{stat.company}</span>
              </div>
              
              <div className="mb-3">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stat.percentage}</span>
              </div>
              
              <p className="text-gray-400 font-medium">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
