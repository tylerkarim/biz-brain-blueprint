
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useFormValidation } from "@/hooks/useFormValidation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { errors, validateField, clearError } = useFormValidation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Validate form
    const emailValid = validateField('email', email, { required: true, email: true });
    const passwordValid = validateField('password', password, { required: true });
    
    if (!emailValid || !passwordValid) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Provide user-friendly error messages without exposing system details
        if (error.message.includes('Invalid login credentials')) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (error.message.includes('Email not confirmed')) {
          setError("Please check your email and click the confirmation link before signing in.");
        } else {
          setError("Unable to sign in. Please try again later.");
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold">
            <span className="text-black">Build</span>
            <span className="text-blue-600">Aura</span>
          </Link>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <Card className="p-8 shadow-xl border-0">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                placeholder="Enter your email"
                required
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
                placeholder="Enter your password"
                required
                className={`w-full ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
              Sign up for free
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
