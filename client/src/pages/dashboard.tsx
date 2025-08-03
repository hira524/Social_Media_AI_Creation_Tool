import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "../components/ui/navigation";
import ImageGenerator from "../components/ui/image-generator";
import ImageHistory from "../components/ui/image-history";
import History from "../components/ui/history";
import Favorites from "../components/ui/favorites";
import Settings from "../components/ui/settings";
import FloatingActionButton from "../components/ui/floating-action-button";
import LoadingSpinner from "../components/ui/loading-spinner";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<'create' | 'history' | 'favorites' | 'settings'>('create');

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
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav className="glass-card p-6 sticky top-24 animate-slide-in-left">
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveView('create')}
                  aria-label="Create new AI-generated image"
                  className={`w-full flex items-center space-x-3 px-4 py-3 ${
                    activeView === 'create' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover-glow group`}
                >
                  <span className="text-2xl group-hover:animate-bounce-gentle">🎨</span>
                  <span>Create Image</span>
                  {activeView === 'create' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                </button>
                <button 
                  onClick={() => setActiveView('history')}
                  aria-label="View generation history"
                  className={`w-full interactive-card flex items-center space-x-3 px-4 py-3 ${
                    activeView === 'history' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl transition-all duration-300 group`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
                  <span>History</span>
                  {activeView === 'history' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                </button>
                <button 
                  onClick={() => setActiveView('favorites')}
                  aria-label="View favorite images"
                  className={`w-full interactive-card flex items-center space-x-3 px-4 py-3 ${
                    activeView === 'favorites' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl transition-all duration-300 group`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform group-hover:animate-heartbeat">❤️</span>
                  <span>Favorites</span>
                  {activeView === 'favorites' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                </button>
                <button 
                  onClick={() => setActiveView('settings')}
                  aria-label="Open settings"
                  className={`w-full interactive-card flex items-center space-x-3 px-4 py-3 ${
                    activeView === 'settings' 
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
                      : 'text-slate-600 hover:text-primary hover:bg-white/50'
                  } rounded-xl transition-all duration-300 group`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform group-hover:animate-rotate">⚙️</span>
                  <span>Settings</span>
                  {activeView === 'settings' && <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                </button>
              </div>
              
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
            </nav>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-9 mt-8 lg:mt-0 space-y-8">
            {activeView === 'create' && (
              <>
                <div className="animate-fade-in-up">
                  <ImageGenerator />
                </div>
                <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <ImageHistory />
                </div>
              </>
            )}
            
            {activeView === 'history' && (
              <div className="animate-fade-in-up">
                <History />
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
