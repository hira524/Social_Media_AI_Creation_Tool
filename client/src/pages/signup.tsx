import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Sparkles, ArrowRight, Mail, Lock, User } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refetch } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Send signup data to the server
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Account Created",
          description: "Account created successfully. Let's set up your profile.",
          variant: "success" as const,
        });
        
        // Refresh authentication state before redirecting
        await refetch();
        
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          setLocation("/onboarding");
        }, 500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full mix-blend-screen filter blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
        <div className="bg-grid-pattern opacity-10 absolute inset-0"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-secondary/60 rounded-full animate-bounce-gentle" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Logo with animation */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl animate-glow">
              <Sparkles className="w-8 h-8 text-white animate-spin" style={{animationDuration: '3s'}} />
            </div>
            <span className="font-bold text-3xl text-gradient-primary">AI Creator Studio</span>
          </div>
          <p className="text-gray-300 text-lg animate-fade-in-up" style={{animationDelay: '0.3s'}}>Create your account to start generating amazing images</p>
        </div>

        <Card className="glass-card bg-gray-900/80 border border-gray-700 shadow-strong overflow-hidden animate-scale-in" style={{animationDelay: '0.2s'}}>
          <CardHeader className="text-center pb-6 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-800/30">
            <CardTitle className="text-3xl font-bold text-white mb-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>Create Account</CardTitle>
            <CardDescription className="text-gray-300 text-lg animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              Join thousands of creators using AI to enhance their content
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 animate-slide-in-left" style={{animationDelay: '0.7s'}}>
                  <Label htmlFor="firstName" className="text-gray-300 font-medium flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>
                
                <div className="space-y-2 animate-slide-in-right" style={{animationDelay: '0.8s'}}>
                  <Label htmlFor="lastName" className="text-gray-300 font-medium flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary" />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
                <Label htmlFor="email" className="text-gray-300 font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '1.0s'}}>
                <Label htmlFor="password" className="text-gray-300 font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '1.1s'}}>
                <Label htmlFor="confirmPassword" className="text-gray-300 font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-12 rounded-xl border-2 border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group animate-fade-in-up" 
                style={{animationDelay: '1.2s'}}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-gray-700 mt-6 animate-fade-in-up" style={{animationDelay: '1.3s'}}>
              <p className="text-gray-300 text-lg">
                Already have an account?{" "}
                <button 
                  onClick={handleLoginRedirect}
                  className="text-primary hover:text-primary/80 font-bold transition-all duration-200 hover:scale-105 inline-block hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-gray-400 animate-fade-in-up" style={{animationDelay: '1.4s'}}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span>By creating an account, you agree to our Terms of Service and Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
