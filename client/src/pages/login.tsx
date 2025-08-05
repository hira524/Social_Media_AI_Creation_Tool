import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refetch } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Welcome back! 🎉",
          description: "You've been successfully logged in.",
        });
        
        // Wait for refetch to complete before navigation
        await refetch();
        
        // Check if user needs onboarding
        if (result.user && !result.user.onboardingCompleted) {
          setLocation("/onboarding");
        } else {
          setLocation("/dashboard");
        }
      } else {
        // Handle error response
        throw new Error(result.message || result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background elements for black theme */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="bg-grid-pattern opacity-10 absolute inset-0"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Enhanced login card */}
        <Card className="glass-card bg-gray-900/80 border border-gray-700 shadow-strong overflow-hidden animate-scale-in">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl animate-glow">
                <Sparkles className="w-10 h-10 text-white animate-spin" style={{animationDuration: '3s'}} />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gradient-primary mb-3">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Sign in to continue creating amazing content
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-white flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-white flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-primary" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation("/signup")}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
