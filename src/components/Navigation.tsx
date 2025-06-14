
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                BuildAura
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/pricing" className="text-gray-300 hover:text-purple-400 transition-colors px-3 py-2 text-sm font-medium">Pricing</Link>
              <Link to="/tools" className="text-gray-300 hover:text-purple-400 transition-colors px-3 py-2 text-sm font-medium">Tools</Link>
              <Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors px-3 py-2 text-sm font-medium">About</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="hidden sm:inline-flex border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Start for Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
