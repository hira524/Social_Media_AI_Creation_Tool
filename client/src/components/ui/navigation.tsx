import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Zap, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/mongoSchema";

export default function Navigation() {
  const { user, refreshAuth } = useAuth();
  const typedUser = user as User;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
          variant: "success" as const,
        });
        
        // Refresh auth state and redirect
        refreshAuth();
        setLocation("/");
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-gray-800 shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-gradient-primary">AI Creator Studio</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-soft">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <span className="font-bold text-slate-900">{typedUser?.creditsRemaining || 0}</span>
                <span className="text-slate-600 ml-1">credits remaining</span>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 px-4 py-2 h-12 rounded-2xl hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-white">
                  <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                    <AvatarImage src={typedUser?.profileImageUrl || ""} alt="User avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      {typedUser?.firstName?.[0] || typedUser?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-slate-900">{typedUser?.firstName || typedUser?.email || "User"}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="mt-2 bg-gray-900/90 backdrop-blur-xl border border-gray-700 shadow-xl rounded-2xl overflow-hidden"
              >
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}