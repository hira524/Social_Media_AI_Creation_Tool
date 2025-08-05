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
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-6 ${className}`}>
      {/* Clean loading animation */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-3 border-gray-600 border-t-primary rounded-full animate-spin`}></div>
      </div>
      
      {/* Loading message */}
      <div className="text-center space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">AI Creator Studio</span>
        </div>
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    </div>
  );
}
