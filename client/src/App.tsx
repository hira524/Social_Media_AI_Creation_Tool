import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/mongoSchema";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import SignUp from "@/pages/signup";
import Login from "@/pages/login";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const typedUser = user as User;

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
            <p className="text-slate-600 animate-pulse-slow">Initializing your creative workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        {!isAuthenticated ? (
          <Landing />
        ) : typedUser && !typedUser.onboardingCompleted ? (
          <Onboarding />
        ) : (
          <Dashboard />
        )}
      </Route>
      <Route path="/onboarding">
        {!isAuthenticated ? (
          <Landing />
        ) : (
          <Onboarding />
        )}
      </Route>
      <Route path="/landing" component={Landing} />
      <Route path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
