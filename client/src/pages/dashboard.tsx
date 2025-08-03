import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navigation from "@/components/ui/navigation";
import ImageGenerator from "@/components/ui/image-generator";
import ImageHistory from "@/components/ui/image-history";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="flex flex-col items-center space-y-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary rounded-full animate-spin animate-reverse"></div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">AI Creator Studio</span>
            </div>
            <p className="text-slate-600 animate-pulse-slow">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-medium border border-white/20 p-6 sticky top-24">
              <div className="space-y-2">
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-primary bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                  <span className="text-2xl">🎨</span>
                  <span>Create Image</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-white/50 rounded-xl transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
                  <span>History</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-white/50 rounded-xl transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">❤️</span>
                  <span>Favorites</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-white/50 rounded-xl transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">⚙️</span>
                  <span>Settings</span>
                </a>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 via-purple-100/50 to-pink-100/50 rounded-2xl border border-white/30 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-slate-600 mb-4">Unlimited generations and premium features</p>
                  <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-semibold">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 mt-8 lg:mt-0 space-y-8">
            <ImageGenerator />
            <ImageHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
