import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import type { User } from "../../shared/mongoSchema";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Onboarding from "./pages/onboarding";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import LoadingSpinner from "./components/ui/loading-spinner";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const typedUser = user as User;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Initializing your creative workspace..." 
        />
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
