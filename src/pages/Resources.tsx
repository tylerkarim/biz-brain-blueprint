
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Image, Palette, BookOpen, ExternalLink } from "lucide-react";

const Resources = () => {
  const templates = [
    {
      id: 1,
      title: "Business Plan Template",
      description: "Comprehensive business plan template with all essential sections",
      type: "PDF",
      size: "2.4 MB",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Lean Canvas Template",
      description: "One-page business model canvas for quick planning",
      type: "PDF",
      size: "1.2 MB",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Brand Guidelines Template",
      description: "Complete brand identity guide template",
      type: "PDF",
      size: "3.1 MB",
      icon: Palette,
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Startup Checklist",
      description: "Essential steps for launching your startup",
      type: "PDF",
      size: "800 KB",
      icon: BookOpen,
      downloadUrl: "#"
    }
  ];

  const guides = [
    {
      title: "How to Validate Your Business Idea",
      description: "Step-by-step guide to testing your business concept",
      readTime: "8 min read",
      url: "#"
    },
    {
      title: "Building Your MVP",
      description: "Create a minimum viable product efficiently",
      readTime: "12 min read",
      url: "#"
    },
    {
      title: "Finding Your First Customers",
      description: "Strategies for customer acquisition and retention",
      readTime: "10 min read",
      url: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Resources</h1>
            <p className="text-xl text-gray-600">Templates, guides, and tools to help you succeed</p>
          </div>

          <div className="grid gap-12">
            {/* Templates Section */}
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Download Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <Card key={template.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy-900">{template.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">{template.type}</Badge>
                              <span className="text-sm text-gray-500">{template.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Guides Section */}
            <section>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Startup Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide, index) => (
                  <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge variant="outline">{guide.readTime}</Badge>
                    </div>
                    <h3 className="font-semibold text-navy-900 mb-2">{guide.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            {/* Upload Section */}
            <section>
              <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-primary/5 to-blue-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-900 mb-2">Upload Your Own Resources</h3>
                  <p className="text-gray-600 mb-6">
                    Save your own templates, documents, and resources for easy access
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Upload Files
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;
