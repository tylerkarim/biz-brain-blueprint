import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    navigate('/signup');
  };

  // Determine the home route based on authentication status
  const homeRoute = user ? "/dashboard" : "/";

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";
  return <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={homeRoute} className="text-2xl font-bold">
            <span className="text-black">Build</span>
            <span className="text-blue-600">Aura</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {isLandingPage && !user ? <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 text-sm font-medium" style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}>
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-sm font-medium" style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}>
                  Sign Up
                </Button>
              </Link>
            </> : <>
              <Link to="/pricing">
                <Button variant="ghost" size="sm" className="text-sm font-normal text-navy-500">
                  Pricing
                </Button>
              </Link>
              {user && <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-sm font-normal text-red-600">
                  Sign Out
                </Button>}
            </>}
        </div>
      </div>
    </nav>;
};