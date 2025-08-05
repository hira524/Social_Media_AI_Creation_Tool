import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import type { User } from "../../shared/mongoSchema";
import LoadingSpinner from "./components/ui/loading-spinner";

// Lazy load pages to reduce initial bundle size
const NotFound = lazy(() => import("./pages/not-found"));
const Landing = lazy(() => import("./pages/landing"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Onboarding = lazy(() => import("./pages/onboarding"));
const SignUp = lazy(() => import("./pages/signup"));
const Login = lazy(() => import("./pages/login"));

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const typedUser = user as User;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          message="Initializing your creative workspace..." 
        />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading page..." />
      </div>
    }>
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
    </Suspense>
  );
}

function App() {
  // Apply black theme globally
  React.useEffect(() => {
    document.documentElement.className = '';
    document.body.className = 'bg-black text-white';
  }, []);

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
