
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  // Determine the home route based on authentication status
  const homeRoute = user ? "/dashboard" : "/";
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to={homeRoute} className="text-2xl font-bold">
                <span className="text-black">Build</span>
                <span className="text-blue-600">Aura</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/pricing" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">Pricing</Link>
              {!user && (
                <>
                  <Link to="/tools" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">Tools</Link>
                  <Link to="/about" className="text-gray-700 hover:text-primary transition-colors px-3 py-2 text-sm font-medium">About</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button onClick={handleSignOut} variant="outline" className="hidden sm:inline-flex">
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="hidden sm:inline-flex">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90">
                    Start for Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
