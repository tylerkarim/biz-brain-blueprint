
export const Footer = () => {
  const footerSections = [{
    title: "Product",
    links: ["AI Business Generator", "Business Plan Builder", "Launch Toolkit", "Pricing", "Free Trial"]
  }, {
    title: "Industry",
    links: ["Healthcare", "E-Commerce", "SaaS", "Sustainability", "All Industries"]
  }, {
    title: "Company",
    links: ["About Us", "Careers", "Contact", "Privacy Policy", "Terms of Service"]
  }, {
    title: "Resources",
    links: ["Blog", "Case Studies", "Help Center", "API Docs", "Community"]
  }];
  return <footer className="bg-navy-900 text-white py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="text-2xl font-bold">BuildAura</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transform your business ideas into reality with AI-powered tools for startup success.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                🔗
              </a>
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section, index) => <div key={index}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>)}
        </div>
        
        {/* Bottom Border */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 BuildAura. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Proudly supported by AI</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-gray-400 text-sm">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
