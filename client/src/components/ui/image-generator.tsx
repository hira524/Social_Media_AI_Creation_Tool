import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/mongoSchema";
import { 
  Sparkles, 
  Lightbulb
} from "lucide-react";

interface GenerateRequest {
  prompt: string;
}

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

interface ImageGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void;
}

export default function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Memoize user to prevent unnecessary re-renders
  const typedUser = useMemo(() => user as User, [user]);
  
  // Memoize user preferences to prevent re-calculation
  const userPreferences = useMemo(() => {
    if (!typedUser?.niche || !typedUser?.stylePreference) return null;
    return {
      niche: typedUser.niche,
      stylePreference: typedUser.stylePreference,
      hasCredits: typedUser.creditsRemaining && typedUser.creditsRemaining > 0
    };
  }, [typedUser?.niche, typedUser?.stylePreference, typedUser?.creditsRemaining]);
  
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateRequest) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json();
    },
    onSuccess: (data: GeneratedImage) => {
      if (onImageGenerated) {
        onImageGenerated(data);
      }
      toast({
        title: "Image Generated!",
        description: "Your AI-generated image is ready for download.",
      });
      // Only invalidate auth-user if credits might have changed
      if (typedUser && typedUser.creditsRemaining !== undefined && typedUser.creditsRemaining <= 1) {
        queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (error.message.includes("402")) {
        toast({
          title: "No Credits Remaining",
          description: "You've used all your free generations. Upgrade to continue.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe what you want to create.",
        variant: "destructive",
      });
      return;
    }

    if (!typedUser?.creditsRemaining || typedUser.creditsRemaining <= 0) {
      toast({
        title: "No Credits Remaining",
        description: "You've used all your free generations. Upgrade to continue.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      prompt,
    });
  };

  return (

    <div className="space-y-6">
      {/* Enhanced Generation Interface */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Create Your Image</h1>
              <p className="text-gray-300 text-sm mt-1">Describe what you want to create</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Enhanced Prompt Input */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Lightbulb className="w-3 h-3 text-white" />
              </div>
              Describe your post
            </Label>
            <div className="relative">
              <Textarea
                rows={4}
                placeholder="A motivational fitness quote with a mountain background, modern typography, and vibrant colors..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none p-4 rounded-xl border border-gray-600 bg-gray-800/90 text-white placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-sm hover:bg-gray-800 backdrop-blur-sm"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded-md">
                {prompt.length}/500
              </div>
            </div>
            {userPreferences && (
              <div className="p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl border border-primary/30 transition-all duration-300">
                <div className="text-xs text-gray-200 flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/30 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-2 h-2 text-primary" />
                  </div>
                  <span className="font-medium">AI Enhancement:</span>
                  <span>Optimized for {userPreferences.niche} • {userPreferences.stylePreference}</span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Generate Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium" 
            disabled={generateMutation.isPending || !typedUser?.creditsRemaining}
          >
            {generateMutation.isPending ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating Magic...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            )}
          </Button>
        </form>
      </div>

      {/* Enhanced Loading State */}
      {generateMutation.isPending && (
        <div className="glass-card bg-gray-900/90 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-8 text-center animate-fade-in-up">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-600 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-secondary rounded-full animate-spin animate-reverse"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white animate-pulse">Creating your masterpiece...</h3>
              <p className="text-gray-300 text-sm">AI is crafting something amazing • Usually takes 10-30 seconds</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}