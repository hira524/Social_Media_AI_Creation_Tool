import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Heart, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

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

interface CurrentGenerationProps {
  generatedImage: GeneratedImage | null;
  onGenerateNew: () => void;
}

export default function CurrentGeneration({
  generatedImage,
  onGenerateNew
}: CurrentGenerationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  if (!generatedImage) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-medium rounded-2xl overflow-hidden animate-fade-in-up">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Your Latest Generation</h2>
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
                  onClick={onGenerateNew}
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
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Prompt:</span>
                  <span className="text-sm bg-white/70 p-3 rounded-lg">{generatedImage.prompt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
