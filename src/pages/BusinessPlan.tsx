
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const BusinessPlan = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    targetMarket: "",
    problem: "",
    solution: "",
    revenue: "",
    competition: ""
  });

  const steps = [
    { title: "Business Overview", fields: ["businessName", "industry"] },
    { title: "Market Analysis", fields: ["targetMarket", "problem"] },
    { title: "Solution & Revenue", fields: ["solution", "revenue"] },
    { title: "Competition", fields: ["competition"] }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
    }
  };

  const generatePlan = async () => {
    setIsLoading(true);
    // Simulate AI plan generation
    setTimeout(() => {
      setIsLoading(false);
      // Show generated plan
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Business Plan Builder</h1>
            <p className="text-xl text-gray-600">Create a comprehensive business plan with AI guidance</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card className="p-8 border-0 shadow-lg">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Business Overview</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your business name?
                  </label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Enter your business name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What industry are you in?
                  </label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    placeholder="e.g., Technology, Healthcare, E-commerce"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Market Analysis</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who is your target market?
                  </label>
                  <Input
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                    placeholder="Describe your ideal customers"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What problem are you solving?
                  </label>
                  <Input
                    value={formData.problem}
                    onChange={(e) => handleInputChange("problem", e.target.value)}
                    placeholder="Describe the main problem your business addresses"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Solution & Revenue</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your solution?
                  </label>
                  <Input
                    value={formData.solution}
                    onChange={(e) => handleInputChange("solution", e.target.value)}
                    placeholder="Describe how your business solves the problem"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How will you make money?
                  </label>
                  <Input
                    value={formData.revenue}
                    onChange={(e) => handleInputChange("revenue", e.target.value)}
                    placeholder="Describe your revenue model"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Competition</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who are your main competitors?
                  </label>
                  <Input
                    value={formData.competition}
                    onChange={(e) => handleInputChange("competition", e.target.value)}
                    placeholder="List your main competitors and how you're different"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Generating Plan..." : currentStep === steps.length ? "Generate Business Plan" : "Next"}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessPlan;
