
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
    <nav className="fixed top-0 left-56 right-0 z-40 bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-sm text-gray-600">
            Welcome back to BuildAura
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/pricing">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-sm font-normal">
              Pricing
            </Button>
          </Link>
          {user && (
            <Button 
              onClick={handleSignOut} 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 text-sm font-normal"
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
