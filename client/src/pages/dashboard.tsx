import { useEffect, useState, lazy, Suspense } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { ArrowRight, Menu, X, Palette, Heart, Settings as SettingsIcon, Image, Crown, User, Building, Target, Hash } from "lucide-react";
import Navigation from "../components/ui/navigation";
import LoadingSpinner from "../components/ui/loading-spinner";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { isUnauthorizedError } from "../lib/authUtils";
import type { IUser } from "@shared/mongoSchema";

// Lazy load heavy components to reduce initial bundle size
const ImageGenerator = lazy(() => import("../components/ui/image-generator"));
const ImageHistory = lazy(() => import("../components/ui/image-history"));
const CurrentGeneration = lazy(() => import("../components/ui/current-generation"));
const Favorites = lazy(() => import("../components/ui/favorites"));
const Settings = lazy(() => import("../components/ui/settings"));
const FloatingActionButton = lazy(() => import("../components/ui/floating-action-button"));

interface GeneratedImage {
  id: number;
  prompt: string;
  enhancedPrompt: string;
  imageUrl: string;
  platform: string;
  style: string;
  dimensions: string;
  isFavorite: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<'create' | 'history' | 'favorites' | 'settings'>('create');
  const [currentGeneration, setCurrentGeneration] = useState<GeneratedImage | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const queryClient = useQueryClient();
  
  // Personalization state
  const [niche, setNiche] = useState("");
  const [contentType, setContentType] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  
  // Sync personalization fields with user data
  useEffect(() => {
    if (user) {
      const typedUser = user as IUser;
      setNiche(typedUser.niche || "");
      setContentType(typedUser.contentType || "");
      setStylePreference(typedUser.stylePreference || "");
      setBusinessType(typedUser.businessType || "");
      setTargetAudience(typedUser.targetAudience || "");
      setPrimaryGoal(typedUser.primaryGoal || "");
    }
  }, [user]);

  // Personalization update mutation
  const updatePersonalizationMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Personalization Updated",
        description: "Your preferences have been saved successfully.",
        variant: "success" as const,
      });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePersonalizationSave = () => {
    updatePersonalizationMutation.mutate({
      niche,
      contentType,
      stylePreference,
      businessType,
      targetAudience,
      primaryGoal,
    });
  };

  // Use effect to handle authentication redirect - only run once on initial load
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, toast, setLocation]);

  // Prevent unnecessary re-renders of active view changes
  const handleViewChange = (view: 'create' | 'history' | 'favorites' | 'settings') => {
    setActiveView(view);
  };

  // Prevent unnecessary re-renders of sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  // Handle mobile overlay close
  const handleMobileOverlayClose = () => {
    setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Loading your dashboard..." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Enhanced background elements for black theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-primary/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-purple-500/15 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
        <div className="bg-grid-pattern opacity-5 absolute inset-0"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-primary/40 rounded-full animate-bounce-gentle"></div>
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-purple-400/50 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-pink-400/30 rounded-full animate-bounce-gentle" style={{animationDelay: '4s'}}></div>
      </div>
      
      <Navigation />
      
      {/* Animated Sidebar Toggle Button */}
      <button
        onClick={handleSidebarToggle}
        className="fixed top-20 left-6 z-40 bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-lg rounded-xl p-2.5 hover:bg-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 lg:hidden animate-fade-in-up"
        style={{animationDelay: '0.2s'}}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
      </button>
      
      <div className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Clean Sidebar Navigation */}
          <div className={`${sidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 ease-in-out flex-shrink-0`}>
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={handleSidebarToggle}
              className="hidden lg:flex fixed top-20 left-6 z-40 bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-sm rounded-xl p-2.5 hover:bg-gray-700 hover:shadow-md transition-all duration-200 items-center justify-center"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
            </button>
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleMobileOverlayClose}
              />
            )}
            
            <nav className={`glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-4 sticky top-24 transition-all duration-300 z-30 animate-slide-in-left ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0'
            } ${!sidebarOpen ? 'lg:w-16 lg:p-3' : ''} ${sidebarOpen ? 'lg:relative' : ''} ${!sidebarOpen ? 'lg:relative' : 'lg:relative md:fixed md:left-6 md:top-24 md:w-72'}`}
            style={{animationDelay: '0.3s'}}>
              <div className="space-y-1">
                <button 
                  onClick={() => handleViewChange('create')}
                  aria-label="Create new AI-generated image"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'create' 
                      ? 'text-white bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80 hover:scale-105'
                  } rounded-xl font-medium transition-all duration-300 text-sm group`}
                  title={!sidebarOpen ? "Create Image" : ""}
                >
                  <Palette className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {sidebarOpen && <span>Create Image</span>}
                </button>
                
                <button 
                  onClick={() => handleViewChange('favorites')}
                  aria-label="View favorite images"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'favorites' 
                      ? 'text-white bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80 hover:scale-105'
                  } rounded-xl font-medium transition-all duration-300 text-sm group`}
                  title={!sidebarOpen ? "Favorites" : ""}
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {sidebarOpen && <span>Favorites</span>}
                </button>
                
                <button 
                  onClick={() => handleViewChange('settings')}
                  aria-label="Open settings"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'settings' 
                      ? 'text-white bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80 hover:scale-105'
                  } rounded-xl font-medium transition-all duration-300 text-sm group`}
                  title={!sidebarOpen ? "Settings" : ""}
                >
                  <SettingsIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {sidebarOpen && <span>Settings</span>}
                </button>
                
                <button 
                  onClick={() => handleViewChange('history')}
                  aria-label="View recent generations"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'history' 
                      ? 'text-white bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80 hover:scale-105'
                  } rounded-xl font-medium transition-all duration-300 text-sm group`}
                  title={!sidebarOpen ? "Recent Generations" : ""}
                >
                  <Image className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {sidebarOpen && <span>Recent Generations</span>}
                </button>
              </div>
              
              {/* Personalization Section */}
              {sidebarOpen && (
                <div className="mt-6 space-y-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center gap-2 px-2">
                    <User className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-medium text-white">Quick Personalization</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Niche</Label>
                      <Select value={niche} onValueChange={setNiche}>
                        <SelectTrigger className="h-8 text-xs bg-gray-800/80 border-gray-600 text-white focus:border-primary">
                          <SelectValue placeholder="Select niche" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="fitness" className="text-white hover:bg-gray-700">Fitness</SelectItem>
                          <SelectItem value="food" className="text-white hover:bg-gray-700">Food</SelectItem>
                          <SelectItem value="tech" className="text-white hover:bg-gray-700">Technology</SelectItem>
                          <SelectItem value="fashion" className="text-white hover:bg-gray-700">Fashion</SelectItem>
                          <SelectItem value="business" className="text-white hover:bg-gray-700">Business</SelectItem>
                          <SelectItem value="travel" className="text-white hover:bg-gray-700">Travel</SelectItem>
                          <SelectItem value="lifestyle" className="text-white hover:bg-gray-700">Lifestyle</SelectItem>
                          <SelectItem value="education" className="text-white hover:bg-gray-700">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Content Type</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger className="h-8 text-xs bg-gray-800/80 border-gray-600 text-white focus:border-primary">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="quotes" className="text-white hover:bg-gray-700">Quotes</SelectItem>
                          <SelectItem value="promotions" className="text-white hover:bg-gray-700">Promotions</SelectItem>
                          <SelectItem value="educational" className="text-white hover:bg-gray-700">Educational</SelectItem>
                          <SelectItem value="announcements" className="text-white hover:bg-gray-700">Announcements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Style</Label>
                      <Select value={stylePreference} onValueChange={setStylePreference}>
                        <SelectTrigger className="h-8 text-xs bg-gray-800/80 border-gray-600 text-white focus:border-primary">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="professional" className="text-white hover:bg-gray-700">Professional</SelectItem>
                          <SelectItem value="fun" className="text-white hover:bg-gray-700">Fun & Playful</SelectItem>
                          <SelectItem value="luxury" className="text-white hover:bg-gray-700">Luxury</SelectItem>
                          <SelectItem value="minimalist" className="text-white hover:bg-gray-700">Minimalist</SelectItem>
                          <SelectItem value="bold" className="text-white hover:bg-gray-700">Bold</SelectItem>
                          <SelectItem value="vintage" className="text-white hover:bg-gray-700">Vintage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300">Business</Label>
                        <Select value={businessType} onValueChange={setBusinessType}>
                          <SelectTrigger className="h-8 text-xs bg-gray-800/80 border-gray-600 text-white focus:border-primary">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="startup" className="text-white hover:bg-gray-700">Startup</SelectItem>
                            <SelectItem value="smallbusiness" className="text-white hover:bg-gray-700">Small Biz</SelectItem>
                            <SelectItem value="enterprise" className="text-white hover:bg-gray-700">Enterprise</SelectItem>
                            <SelectItem value="freelancer" className="text-white hover:bg-gray-700">Freelancer</SelectItem>
                            <SelectItem value="personal" className="text-white hover:bg-gray-700">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300">Goal</Label>
                        <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                          <SelectTrigger className="h-8 text-xs bg-gray-800/80 border-gray-600 text-white focus:border-primary">
                            <SelectValue placeholder="Goal" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="brand-awareness" className="text-white hover:bg-gray-700">Awareness</SelectItem>
                            <SelectItem value="lead-generation" className="text-white hover:bg-gray-700">Leads</SelectItem>
                            <SelectItem value="sales" className="text-white hover:bg-gray-700">Sales</SelectItem>
                            <SelectItem value="engagement" className="text-white hover:bg-gray-700">Engagement</SelectItem>
                            <SelectItem value="education" className="text-white hover:bg-gray-700">Education</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Target Audience</Label>
                      <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger className="h-8 text-xs bg-gray-800/80 border-gray-600 text-white focus:border-primary">
                          <SelectValue placeholder="Select your audience" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="b2b" className="text-white hover:bg-gray-700">Businesses (B2B)</SelectItem>
                          <SelectItem value="b2c" className="text-white hover:bg-gray-700">Consumers (B2C)</SelectItem>
                          <SelectItem value="millennials" className="text-white hover:bg-gray-700">Millennials (27-42)</SelectItem>
                          <SelectItem value="genz" className="text-white hover:bg-gray-700">Gen Z (18-26)</SelectItem>
                          <SelectItem value="genx" className="text-white hover:bg-gray-700">Gen X (43-58)</SelectItem>
                          <SelectItem value="professionals" className="text-white hover:bg-gray-700">Professionals</SelectItem>
                          <SelectItem value="students" className="text-white hover:bg-gray-700">Students</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handlePersonalizationSave}
                      disabled={updatePersonalizationMutation.isPending}
                      className="w-full h-8 bg-gradient-to-r from-primary/80 to-secondary/80 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs font-medium"
                    >
                      {updatePersonalizationMutation.isPending ? (
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {sidebarOpen && (
                <div className="mt-6 p-4 bg-gradient-to-br from-gray-800 to-gray-700/50 rounded-xl border border-gray-600 shadow-lg animate-fade-in-up hover:shadow-xl transition-all duration-300 group" style={{animationDelay: '0.5s'}}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-primary/30 group-hover:scale-110 transition-all duration-300">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-1 text-sm">Upgrade to Pro</h3>
                    <p className="text-xs text-gray-300 mb-3">Unlimited generations & premium features</p>
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs font-medium flex items-center justify-center gap-2 group">
                      Upgrade Now
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="flex-1 min-w-0 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner size="md" message="Loading component..." />}>
                {activeView === 'create' && (
                  <>
                    {currentGeneration && (
                      <div className="animate-scale-in" style={{animationDelay: '0.6s'}}>
                        <CurrentGeneration 
                          generatedImage={currentGeneration}
                          onGenerateNew={() => setCurrentGeneration(null)}
                        />
                      </div>
                    )}
                    <div className="animate-fade-in-up" style={{animationDelay: currentGeneration ? '0.8s' : '0.6s'}}>
                      <ImageGenerator onImageGenerated={setCurrentGeneration} />
                    </div>
                  </>
                )}
                
                {activeView === 'history' && (
                  <div className="animate-scale-in" style={{animationDelay: '0.6s'}}>
                    <ImageHistory />
                  </div>
                )}
                
                {activeView === 'favorites' && (
                  <div className="animate-slide-in-right" style={{animationDelay: '0.6s'}}>
                    <Favorites />
                  </div>
                )}
                
                {activeView === 'settings' && (
                  <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                    <Settings />
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <Suspense fallback={null}>
        <FloatingActionButton 
          onActionSelect={(action) => {
            console.log('Action selected:', action);
            if (action && activeView !== 'create') {
              handleViewChange('create');
            }
          }}
        />
      </Suspense>
    </div>
  );
}
