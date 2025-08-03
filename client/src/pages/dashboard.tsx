import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import Navigation from "../components/ui/navigation";
import ImageGenerator from "../components/ui/image-generator";
import ImageHistory from "../components/ui/image-history";
import CurrentGeneration from "../components/ui/current-generation";
import Favorites from "../components/ui/favorites";
import Settings from "../components/ui/settings";
import FloatingActionButton from "../components/ui/floating-action-button";
import LoadingSpinner from "../components/ui/loading-spinner";

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
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<'create' | 'history' | 'favorites' | 'settings'>('create');
  const [currentGeneration, setCurrentGeneration] = useState<GeneratedImage | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Loading your dashboard..." 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="bg-grid-pattern opacity-20 absolute inset-0"></div>
      </div>
      
      <Navigation />
      
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-24 left-4 z-50 bg-white/80 backdrop-blur-xl border border-white/20 shadow-medium rounded-2xl p-3 hover:shadow-lg transition-all duration-300 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Enhanced Sidebar Navigation - Collapsible */}
          <div className={`${sidebarOpen ? 'lg:col-span-3' : 'lg:col-span-1'} transition-all duration-300`}>
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block fixed top-24 left-4 z-50 bg-white/80 backdrop-blur-xl border border-white/20 shadow-medium rounded-2xl p-3 hover:shadow-lg transition-all duration-300"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <nav className={`glass-card p-6 sticky top-24 animate-slide-in-left transition-all duration-300 z-50 ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0'
            } ${sidebarOpen ? '' : 'lg:w-16 lg:p-3'} ${sidebarOpen ? 'lg:relative' : ''} ${!sidebarOpen ? 'lg:relative' : 'lg:relative md:fixed md:left-4 md:top-24 md:w-80'}`}>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveView('create')}
                  aria-label="Create new AI-generated image"
                  className={`w-full flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 ${
                    activeView === 'create' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover-glow group`}
                  title={!sidebarOpen ? "Create Image" : ""}
                >
                  <span className="text-2xl group-hover:animate-bounce-gentle">🎨</span>
                  {sidebarOpen && (
                    <>
                      <span>Create Image</span>
                      {activeView === 'create' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setActiveView('favorites')}
                  aria-label="View favorite images"
                  className={`w-full interactive-card flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 ${
                    activeView === 'favorites' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl transition-all duration-300 group`}
                  title={!sidebarOpen ? "Favorites" : ""}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform group-hover:animate-heartbeat">❤️</span>
                  {sidebarOpen && (
                    <>
                      <span>Favorites</span>
                      {activeView === 'favorites' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setActiveView('settings')}
                  aria-label="Open settings"
                  className={`w-full interactive-card flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 ${
                    activeView === 'settings' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl transition-all duration-300 group`}
                  title={!sidebarOpen ? "Settings" : ""}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform group-hover:animate-rotate">⚙️</span>
                  {sidebarOpen && (
                    <>
                      <span>Settings</span>
                      {activeView === 'settings' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setActiveView('history')}
                  aria-label="View recent generations"
                  className={`w-full interactive-card flex items-center ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-2'} py-3 ${
                    activeView === 'history' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl transition-all duration-300 group`}
                  title={!sidebarOpen ? "Recent Generations" : ""}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🖼️</span>
                  {sidebarOpen && (
                    <>
                      <span>Recent Generations</span>
                      {activeView === 'history' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                    </>
                  )}
                </button>
              </div>
              
              {sidebarOpen && (
                <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 via-purple-100/50 to-pink-100/50 rounded-2xl border border-white/30 backdrop-blur-sm hover-lift">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-glow">
                      <span className="text-2xl animate-bounce-gentle">⭐</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Upgrade to Pro</h3>
                    <p className="text-sm text-slate-600 mb-4">Unlimited generations and premium features</p>
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-semibold group">
                      Upgrade Now
                      <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Enhanced Main Content Area */}
          <div className={`${sidebarOpen ? 'lg:col-span-9' : 'lg:col-span-11'} mt-8 lg:mt-0 space-y-8 transition-all duration-300`}>
            {activeView === 'create' && (
              <>
                {currentGeneration && (
                  <div className="animate-fade-in-up">
                    <CurrentGeneration 
                      generatedImage={currentGeneration}
                      onGenerateNew={() => setCurrentGeneration(null)}
                    />
                  </div>
                )}
                <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <ImageGenerator onImageGenerated={setCurrentGeneration} />
                </div>
              </>
            )}
            
            {activeView === 'history' && (
              <div className="animate-fade-in-up">
                <ImageHistory />
              </div>
            )}
            
            {activeView === 'favorites' && (
              <div className="animate-fade-in-up">
                <Favorites />
              </div>
            )}
            
            {activeView === 'settings' && (
              <div className="animate-fade-in-up">
                <Settings />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Floating Action Button */}
      <FloatingActionButton 
        onActionSelect={(action) => {
          // Handle different actions
          console.log('Action selected:', action);
          // Navigate to create view if action is selected
          if (action && activeView !== 'create') {
            setActiveView('create');
          }
        }}
      />
    </div>
  );
}
