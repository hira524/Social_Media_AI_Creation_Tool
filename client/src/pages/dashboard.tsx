import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/ui/navigation";
import ImageGenerator from "@/components/ui/image-generator";
import ImageHistory from "@/components/ui/image-history";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-2">
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-primary bg-indigo-50 rounded-lg font-medium">
                  <span>🎨</span>
                  <span>Create Image</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                  <span>📜</span>
                  <span>History</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                  <span>❤️</span>
                  <span>Favorites</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                  <span>⚙️</span>
                  <span>Settings</span>
                </a>
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-slate-600 mb-3">Unlimited generations and premium features</p>
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium">
                  Upgrade Now
                </button>
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
