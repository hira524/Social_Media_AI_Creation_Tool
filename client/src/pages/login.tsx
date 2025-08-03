import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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
      // Send login data to the server
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
      
      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        
        // Refresh authentication state before redirecting
        await refetch();
        
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          setLocation("/dashboard");
        }, 500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    setLocation("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 slide-in-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-3xl text-slate-900 text-gradient-primary">AI Creator Studio</span>
          </div>
          <p className="text-slate-600 text-lg">Welcome back! Sign in to continue creating</p>
        </div>

        <Card className="shadow-intense border-0 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden slide-in-up" style={{animationDelay: '0.2s'}}>
          <CardHeader className="text-center pb-6 bg-gradient-to-br from-white via-white to-indigo-50/30">
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">Sign In</CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-modern pl-12 h-14 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-modern pl-12 h-14 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-slate-300 text-primary focus:ring-primary focus:ring-2 transition-all duration-200" 
                  />
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                <button 
                  type="button" 
                  className="text-primary hover:text-primary/80 font-medium transition-all duration-200 hover:scale-105"
                >
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary text-lg py-4 h-14 rounded-2xl shadow-lg hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-slate-200 mt-6">
              <p className="text-slate-600 text-lg">
                Don't have an account?{" "}
                <button 
                  onClick={handleSignUpRedirect}
                  className="text-primary hover:text-primary/80 font-bold transition-all duration-200 hover:scale-105 inline-block"
                >
                  Create one here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-slate-500 slide-in-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure login powered by industry-standard encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
