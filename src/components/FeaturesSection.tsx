
import { Card } from "@/components/ui/card";

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
            Unleashing the power of
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI business tools
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Mobile Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-96 bg-navy-900 rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                <div className="bg-primary h-20 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">BuildAura AI</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">AI Suggestion:</div>
                    <div className="font-medium text-navy-900">"Consider a sustainable food delivery service targeting eco-conscious millennials..."</div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Business Plan:</div>
                    <div className="font-medium text-navy-900">Market Analysis: $2.3B opportunity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="space-y-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                  💡
                </div>
                <h3 className="ml-4 text-2xl font-bold text-navy-900">AI Business Idea Generator</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Powerful AI assistant that analyzes your skills and interests to generate 5 tailored startup ideas with market validation.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  📋
                </div>
                <h3 className="ml-4 text-2xl font-bold text-navy-900">Business Plan Builder</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Step-by-step wizard powered by GPT that creates comprehensive business plans, financial projections, and go-to-market strategies.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
