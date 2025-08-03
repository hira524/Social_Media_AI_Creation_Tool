import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/mongoSchema";
import { 
  Sparkles, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Download, 
  Copy, 
  Heart, 
  RotateCcw,
  Lightbulb,
  Palette
} from "lucide-react";

interface GenerateRequest {
  prompt: string;
  platform: "instagram" | "linkedin" | "twitter";
  style?: string;
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

const platforms = [
  { value: "instagram", label: "Instagram", icon: Instagram, dimensions: "1080×1080" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, dimensions: "1200×627" },
  { value: "twitter", label: "Twitter", icon: Twitter, dimensions: "1200×675" },
];

const styleOptions = ["Realistic", "Illustration", "Abstract", "Vintage"];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "linkedin" | "twitter">("instagram");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  
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
      setGeneratedImage(data);
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

  const favoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: number; isFavorite: boolean }) => {
      await apiRequest("PATCH", `/api/images/${id}/favorite`, { isFavorite });
    },
    onSuccess: () => {
      toast({
        title: "Updated",
        description: "Image favorite status updated.",
      });
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
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
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
      platform: selectedPlatform,
      style: selectedStyles.join(", "),
    });
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ai-generated-${generatedImage.platform}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded",
        description: "Image downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedImage) return;
    
    try {
      await navigator.clipboard.writeText(generatedImage.imageUrl);
      toast({
        title: "Copied",
        description: "Image URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy image URL.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!generatedImage) return;
    
    favoriteMutation.mutate({
      id: generatedImage.id,
      isFavorite: !generatedImage.isFavorite,
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

            {/* Enhanced Platform Selection */}
            <div className="space-y-6">
              <Label className="text-xl font-bold text-slate-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span>🎯</span>
                </div>
                <span>Choose platform format</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.value;
                  return (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => setSelectedPlatform(platform.value as typeof selectedPlatform)}
                      className={`interactive-card p-8 rounded-3xl border-3 transition-all duration-300 group relative overflow-hidden ${
                        isSelected
                          ? "border-primary bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 shadow-glow-primary"
                          : "border-slate-200 bg-white/70 hover:border-primary/50 hover:bg-white/90"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                      )}
                      <Icon className={`w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                        isSelected ? "text-primary" : "text-slate-600"
                      }`} />
                      <h3 className={`text-xl font-bold mb-2 ${isSelected ? "text-primary" : "text-slate-900"}`}>
                        {platform.label}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">{platform.dimensions}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style Options */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-slate-700 flex items-center space-x-2">
                <Palette className="w-5 h-5 text-primary" />
                <span>Style variations (optional)</span>
              </Label>
              <div className="flex flex-wrap gap-3">
                {styleOptions.map((style) => (
                  <Badge
                    key={style}
                    variant={selectedStyles.includes(style) ? "default" : "secondary"}
                    className={`cursor-pointer px-4 py-2 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 ${
                      selectedStyles.includes(style)
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "bg-white/50 backdrop-blur-sm border border-white/30 text-slate-700 hover:bg-white/80"
                    }`}
                    onClick={() => handleStyleToggle(style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
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

      {/* Generated Image Result */}
      {generatedImage && (
        <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-medium rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your Generated Image</h2>
              </div>
              <p className="text-slate-600 text-lg">
                Generated for <span className="font-semibold text-primary">{generatedImage.platform}</span> • <span className="font-semibold text-secondary">{generatedImage.style}</span> style
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Generated Image Preview */}
              <div className="relative group">
                <img
                  src={generatedImage.imageUrl}
                  alt="AI-generated social media post"
                  className="w-full rounded-2xl shadow-medium group-hover:shadow-intense transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-300"></div>
              </div>

              {/* Image Actions */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center space-x-2">
                    <Download className="w-5 h-5 text-primary" />
                    <span>Download Options</span>
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleDownload} 
                      className="w-full btn-primary py-3 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-3" />
                      Download High Quality
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCopyToClipboard} 
                      className="w-full py-3 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-white/30 hover:bg-white/80 transition-all duration-300"
                    >
                      <Copy className="w-5 h-5 mr-3" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span>Actions</span>
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleFavorite}
                      className="w-full py-3 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-white/30 hover:bg-white/80 transition-all duration-300"
                      disabled={favoriteMutation.isPending}
                    >
                      <Heart className={`w-5 h-5 mr-3 transition-colors ${generatedImage.isFavorite ? 'fill-current text-red-500' : 'text-slate-600'}`} />
                      {generatedImage.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setPrompt(generatedImage.prompt);
                        setGeneratedImage(null);
                      }}
                      className="w-full py-3 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-white/30 hover:bg-white/80 transition-all duration-300"
                    >
                      <RotateCcw className="w-5 h-5 mr-3" />
                      Generate New Image
                    </Button>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl border border-white/30">
                  <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center space-x-2">
                    <span>ℹ️</span>
                    <span>Generation Details</span>
                  </h4>
                  <div className="text-slate-600 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Platform:</span>
                      <span className="font-semibold text-primary">{generatedImage.platform}</span>
                      <span className="text-sm">({generatedImage.dimensions})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Style:</span>
                      <span className="font-semibold text-secondary">{generatedImage.style}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Generated:</span>
                      <span>{new Date(generatedImage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}