import { useState } from "react";
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
  const typedUser = user as User;
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
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
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
      {/* Clean Generation Interface */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Create Your Image</h1>
              <p className="text-slate-600 text-sm mt-1">Describe what you want to create</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Clean Prompt Input */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-3 h-3 text-white" />
              </div>
              Describe your image
            </Label>
            <div className="relative">
              <Textarea
                rows={4}
                placeholder="A motivational fitness quote with a mountain background, modern typography, and vibrant colors..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none p-4 rounded-xl border border-gray-600 bg-gray-800 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                {prompt.length}/500
              </div>
            </div>
            {typedUser?.niche && typedUser?.stylePreference && (
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/50">
                <div className="text-xs text-slate-700 flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-2 h-2 text-primary" />
                  </div>
                  <span className="font-medium">AI Enhancement:</span>
                  <span>Optimized for {typedUser.niche} • {typedUser.stylePreference}</span>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl hover:shadow-md transition-all duration-200 font-medium"
            disabled={generateMutation.isPending || !typedUser?.creditsRemaining}
          >
            {generateMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate Image</span>
              </div>
            )}
          </Button>
        </form>
      </div>

      {/* Clean Loading State */}
      {generateMutation.isPending && (
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Creating your image...</h3>
          <p className="text-slate-600 text-sm">This usually takes 10-30 seconds</p>
        </div>
      )}
    </div>
  );
}