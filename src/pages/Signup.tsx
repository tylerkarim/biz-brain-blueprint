
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useFormValidation } from "@/hooks/useFormValidation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { errors, validateField, clearError, isValidPassword } = useFormValidation();

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (!password) return { strength: "", color: "" };
    if (password.length < 6) return { strength: "Weak", color: "text-red-500" };
    if (password.length < 8 || !isValidPassword(password)) return { strength: "Medium", color: "text-yellow-500" };
    return { strength: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    
    // Validate form
    const emailValid = validateField('email', email, { required: true, email: true });
    const passwordValid = validateField('password', password, { required: true, password: true });
    
    if (!emailValid || !passwordValid) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('User already registered')) {
          setError("An account with this email already exists. Please sign in instead.");
        } else if (error.message.includes('Password')) {
          setError("Password does not meet security requirements. Please choose a stronger password.");
        } else {
          setError("Unable to create account. Please try again later.");
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
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
          <p className="text-gray-600 mt-2">Create your free account</p>
        </div>

        <Card className="p-8 shadow-xl border-0">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <AlertDescription>
                Account created successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSignup} className="space-y-6">
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
              {password && (
                <div className="mt-1 flex justify-between items-center">
                  <span className={`text-sm ${passwordStrength.color}`}>
                    {passwordStrength.strength && `Password strength: ${passwordStrength.strength}`}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Start Free Trial"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
