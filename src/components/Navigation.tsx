
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signup');
  };

  // Determine the home route based on authentication status
  const homeRoute = user ? "/dashboard" : "/";

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={homeRoute} className="flex items-center">
            <img 
              src="/lovable-uploads/73116177-a30a-4ace-9d48-59b070782d28.png" 
              alt="BuildAura Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          {isLandingPage && !user ? (
            <>
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-900 text-xs md:text-sm font-medium px-2 md:px-3" 
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    fontWeight: '500'
                  }}
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-white text-xs md:text-sm font-medium px-3 md:px-4" 
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                    fontWeight: '500'
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/pricing" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm font-normal text-navy-500">
                  Pricing
                </Button>
              </Link>
              {user && (
                <Button 
                  onClick={handleSignOut} 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs md:text-sm font-normal text-red-600"
                >
                  Sign Out
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
