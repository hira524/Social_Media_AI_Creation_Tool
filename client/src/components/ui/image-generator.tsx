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
  Lightbulb
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
    <div className="space-y-6">
      {/* Generation Interface */}
      <Card>
        <CardContent className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Your Social Media Image</h1>
            <p className="text-slate-600">Describe what you want to create and our AI will generate it for you</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Prompt Input */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Describe your image</Label>
              <Textarea
                rows={4}
                placeholder="A motivational fitness quote with a mountain background, modern typography, and vibrant colors..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none"
              />
              {typedUser?.niche && typedUser?.stylePreference && (
                <div className="mt-2 text-sm text-slate-500 flex items-center">
                  <Lightbulb className="w-4 h-4 text-accent mr-1" />
                  We'll enhance your prompt based on your preferences ({typedUser.niche} • {typedUser.stylePreference})
                </div>
              )}
            </div>

            {/* Platform Selection */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Choose platform format</Label>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map((platform) => (
                  <Button
                    key={platform.value}
                    type="button"
                    variant={selectedPlatform === platform.value ? "default" : "outline"}
                    className="p-4 h-auto flex-col space-y-2"
                    onClick={() => setSelectedPlatform(platform.value as any)}
                  >
                    <platform.icon className="w-6 h-6" />
                    <div className="font-medium">{platform.label}</div>
                    <div className="text-xs opacity-70">{platform.dimensions}</div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Style Options */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">Style variations (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {styleOptions.map((style) => (
                  <Badge
                    key={style}
                    variant={selectedStyles.includes(style) ? "default" : "secondary"}
                    className="cursor-pointer"
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
              className="w-full"
              disabled={generateMutation.isPending || !typedUser?.creditsRemaining}
            >
              {generateMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating Image...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {generateMutation.isPending && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Creating your image...</h3>
            <p className="text-slate-600">This usually takes 10-30 seconds</p>
          </CardContent>
        </Card>
      )}

      {/* Generated Image Result */}
      {generatedImage && (
        <Card>
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Your Generated Image</h2>
              <p className="text-slate-600">
                Generated for {generatedImage.platform} • {generatedImage.style} style
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Generated Image Preview */}
              <div>
                <img
                  src={generatedImage.imageUrl}
                  alt="AI-generated social media post"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Image Actions */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Download Options</h3>
                  <div className="space-y-2">
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download High Quality
                    </Button>
                    <Button variant="outline" onClick={handleCopyToClipboard} className="w-full">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleFavorite}
                      className="w-full"
                      disabled={favoriteMutation.isPending}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${generatedImage.isFavorite ? 'fill-current text-red-500' : ''}`} />
                      {generatedImage.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setGeneratedImage(null)}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Generate New Image
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Generation Details</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>Platform: {generatedImage.platform} ({generatedImage.dimensions})</div>
                    <div>Style: {generatedImage.style}</div>
                    <div>Generated: {new Date(generatedImage.createdAt).toLocaleString()}</div>
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