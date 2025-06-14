
import { Card } from "@/components/ui/card";
import { Hospital, ShoppingCart } from "lucide-react";

const industries = [
  {
    title: "Healthcare",
    icon: Hospital,
    description: "AI-powered healthcare delivery solutions with automated appointment scheduling and patient engagement.",
    companies: ["Johnson & Johnson", "Pfizer", "Mayo Clinic"],
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "E-Commerce",
    icon: ShoppingCart,
    description: "Deliver tailored, contact-aware shopping experiences with scalable customer support automation.",
    companies: ["eBay", "Shopify", "Walmart"],
    color: "from-green-500 to-green-600"
  }
];

export const IndustrySection = () => {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            Empowering many industries with
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              smarter AI business solutions
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {industries.map((industry, index) => (
            <Card 
              key={index}
              className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${industry.color} rounded-2xl flex items-center justify-center text-white`}>
                  <industry.icon className="w-8 h-8" />
                </div>
                <h3 className="ml-4 text-2xl font-bold text-navy-900">{industry.title}</h3>
              </div>
              
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {industry.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {industry.companies.map((company, companyIndex) => (
                  <span 
                    key={companyIndex}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
