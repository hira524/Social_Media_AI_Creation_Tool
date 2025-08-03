import { Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  message = "Loading...", 
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-6 p-8 ${className}`}>
      {/* Enhanced loading animation */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}></div>
        
        {/* Inner ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-secondary rounded-full animate-spin`} 
             style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      {/* Loading message */}
      <div className="text-center space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">AI Creator Studio</span>
        </div>
        <p className="text-slate-600 animate-pulse text-lg">{message}</p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}
