
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  const tools = [
    {
      title: "AI Business Idea Generator",
      description: "Generate 5 tailored startup ideas based on your skills and interests",
      icon: "💡",
      href: "/tools/idea-generator",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Business Plan Builder",
      description: "Create comprehensive business plans with AI-powered step-by-step guidance",
      icon: "📋",
      href: "/tools/business-plan",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Launch Toolkit",
      description: "Get logo ideas, name suggestions, and domain availability checks",
      icon: "🚀",
      href: "/tools/launch-toolkit",
      color: "from-blue-500 to-blue-600"
    }
  ];

  const recentIdeas = [
    { title: "Eco-friendly food delivery", created: "2 days ago", status: "In Progress" },
    { title: "AI-powered fitness app", created: "1 week ago", status: "Planning" },
    { title: "Sustainable fashion marketplace", created: "2 weeks ago", status: "Completed" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Welcome back!</h1>
            <p className="text-xl text-gray-600">Ready to build your next big idea?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {tools.map((tool, index) => (
              <Link key={index} to={tool.href}>
                <Card className="p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white cursor-pointer">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center text-white text-2xl`}>
                      {tool.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{tool.title}</h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <Button className="mt-auto bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Ideas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-lg">
              <h3 className="text-2xl font-bold text-navy-900 mb-6">My Recent Ideas</h3>
              <div className="space-y-4">
                {recentIdeas.map((idea, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-navy-900">{idea.title}</h4>
                      <p className="text-sm text-gray-600">{idea.created}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      idea.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      idea.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {idea.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h3 className="text-2xl font-bold text-navy-900 mb-6">Weekly Tasks</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Research target market demographics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 text-primary" defaultChecked />
                  <span className="text-gray-700 line-through">Create social media presence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Develop MVP wireframes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Contact potential customers</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
