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
      {/* Subtle background elements for black theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <Navigation />
      
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-6 z-50 bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-sm rounded-xl p-2.5 hover:bg-gray-700 hover:shadow-md transition-all duration-200 lg:hidden"
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex fixed top-20 left-6 z-50 bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-sm rounded-xl p-2.5 hover:bg-gray-700 hover:shadow-md transition-all duration-200 items-center justify-center"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
            </button>
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <nav className={`bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-4 sticky top-24 transition-all duration-300 z-50 ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full lg:opacity-100 lg:translate-x-0'
            } ${!sidebarOpen ? 'lg:w-16 lg:p-3' : ''} ${sidebarOpen ? 'lg:relative' : ''} ${!sidebarOpen ? 'lg:relative' : 'lg:relative md:fixed md:left-6 md:top-24 md:w-72'}`}>
              <div className="space-y-1">
                <button 
                  onClick={() => setActiveView('create')}
                  aria-label="Create new AI-generated image"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'create' 
                      ? 'text-slate-900 bg-slate-100/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                  } rounded-xl font-medium transition-all duration-200 text-sm`}
                  title={!sidebarOpen ? "Create Image" : ""}
                >
                  <span className="text-lg">🎨</span>
                  {sidebarOpen && <span>Create Image</span>}
                </button>
                
                <button 
                  onClick={() => setActiveView('favorites')}
                  aria-label="View favorite images"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'favorites' 
                      ? 'text-slate-900 bg-slate-100/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                  } rounded-xl font-medium transition-all duration-200 text-sm`}
                  title={!sidebarOpen ? "Favorites" : ""}
                >
                  <span className="text-lg">❤️</span>
                  {sidebarOpen && <span>Favorites</span>}
                </button>
                
                <button 
                  onClick={() => setActiveView('settings')}
                  aria-label="Open settings"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'settings' 
                      ? 'text-slate-900 bg-slate-100/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                  } rounded-xl font-medium transition-all duration-200 text-sm`}
                  title={!sidebarOpen ? "Settings" : ""}
                >
                  <span className="text-lg">⚙️</span>
                  {sidebarOpen && <span>Settings</span>}
                </button>
                
                <button 
                  onClick={() => setActiveView('history')}
                  aria-label="View recent generations"
                  className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5'} ${
                    activeView === 'history' 
                      ? 'text-white bg-gray-700/80' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                  } rounded-xl font-medium transition-all duration-200 text-sm`}
                  title={!sidebarOpen ? "Recent Generations" : ""}
                >
                  <span className="text-lg">🖼️</span>
                  {sidebarOpen && <span>Recent Generations</span>}
                </button>
              </div>
              
              {sidebarOpen && (
                <div className="mt-6 p-4 bg-gradient-to-br from-gray-800 to-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg">⭐</span>
                    </div>
                    <h3 className="font-semibold text-white mb-1 text-sm">Upgrade to Pro</h3>
                    <p className="text-xs text-gray-300 mb-3">Unlimited generations</p>
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 text-xs font-medium flex items-center justify-center gap-1">
                      Upgrade Now
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Clean Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
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
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onActionSelect={(action) => {
          console.log('Action selected:', action);
          if (action && activeView !== 'create') {
            setActiveView('create');
          }
        }}
      />
    </div>
  );
}
