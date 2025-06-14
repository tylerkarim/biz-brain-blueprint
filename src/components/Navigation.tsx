
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-navy-900">LaunchBuddy</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">Solutions</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">Resources</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">Pricing</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex">
              Log in/Sign up
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Get a Free Trial
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
