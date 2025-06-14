
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "7 days",
      description: "Perfect for testing our AI tools",
      features: [
        "3 AI business ideas",
        "1 business plan",
        "Basic launch toolkit",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "month",
      description: "Best for individual entrepreneurs",
      features: [
        "Unlimited AI business ideas",
        "Unlimited business plans",
        "Complete launch toolkit",
        "Weekly task generation",
        "Priority support",
        "Export to PDF"
      ],
      cta: "Get Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "month",
      description: "For teams and agencies",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom AI training",
        "White-label reports",
        "Dedicated success manager",
        "API access"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for you. All plans include our core AI tools to help you build and launch your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-primary transform scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="mb-4 bg-primary text-white">Most Popular</Badge>
                )}
                
                <h3 className="text-2xl font-bold text-navy-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-navy-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>

          {/* Special Offers */}
          <div className="text-center mb-16">
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-primary to-blue-600 text-white max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">🎉 Early Bird Special</h2>
              <p className="text-xl mb-6">
                Get lifetime access to BuildAura Pro for a one-time payment of $59. 
                Limited time offer for our first 1000 customers!
              </p>
              <Button className="bg-white text-primary hover:bg-gray-100">
                Claim Lifetime Deal
              </Button>
            </Card>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="text-xl font-bold text-navy-900 mb-3">Can I cancel anytime?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
              </Card>
              
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="text-xl font-bold text-navy-900 mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600">We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.</p>
              </Card>
              
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="text-xl font-bold text-navy-900 mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards and PayPal. Enterprise customers can also pay by invoice.</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
