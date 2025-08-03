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
    <div className="space-y-8">
      {/* Enhanced Generation Interface */}
      <Card className="glass-card border-0 shadow-strong rounded-3xl overflow-hidden hover-lift">
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg animate-glow">
                <Sparkles className="w-8 h-8 text-white animate-spin" style={{animationDuration: '3s'}} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 text-gradient-primary">Create Your Social Media Image</h1>
                <p className="text-slate-600 text-xl mt-2">Describe what you want to create and our AI will generate it for you</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Enhanced Prompt Input */}
            <div className="space-y-4">
              <Label className="text-xl font-bold text-slate-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span>Describe your image</span>
              </Label>
              <div className="relative">
                <Textarea
                  rows={5}
                  placeholder="A motivational fitness quote with a mountain background, modern typography, and vibrant colors..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="input-modern resize-none text-lg p-6 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                />
                <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                  {prompt.length}/500
                </div>
              </div>
              {typedUser?.niche && typedUser?.stylePreference && (
                <div className="mt-4 p-6 bg-gradient-to-r from-primary/10 via-purple-50 to-pink-50 rounded-2xl border border-primary/20 animate-fade-in">
                  <div className="text-sm text-slate-700 flex items-center">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                      <Lightbulb className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-medium">AI Enhancement:</span>
                    <span className="ml-2">We'll optimize your prompt based on your preferences ({typedUser.niche} • {typedUser.stylePreference})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full btn-primary text-xl py-6 h-16 rounded-2xl shadow-lg hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300"
              disabled={generateMutation.isPending || !typedUser?.creditsRemaining}
            >
              {generateMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  <span>Generating Image...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-3" />
                  <span>Generate Image</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {generateMutation.isPending && (
        <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-medium rounded-2xl overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary rounded-full animate-spin animate-reverse mx-auto"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Creating your image...</h3>
            <p className="text-slate-600 text-lg">This usually takes 10-30 seconds</p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}