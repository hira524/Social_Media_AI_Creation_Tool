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
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Your Latest Generation</h2>
        </div>
        <p className="text-slate-600 text-sm">
          Generated for <span className="font-medium text-primary">{generatedImage.platform}</span> • <span className="font-medium text-secondary">{generatedImage.style}</span> style
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Generated Image Preview */}
        <div className="relative group">
          <img
            src={generatedImage.imageUrl}
            alt="AI-generated social media post"
            className="w-full rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200"
          />
        </div>

        {/* Image Actions */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-slate-900 mb-3 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span>Download Options</span>
            </h3>
            <div className="space-y-2">
              <Button 
                onClick={handleDownload} 
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-xl text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download High Quality
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCopyToClipboard} 
                className="w-full py-2.5 rounded-xl bg-white/50 border border-slate-200 hover:bg-slate-50 text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-3 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Actions</span>
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleToggleFavorite}
                className="w-full py-2.5 rounded-xl bg-white/50 border border-slate-200 hover:bg-slate-50 text-sm"
                disabled={favoriteMutation.isPending}
              >
                <Heart className={`w-4 h-4 mr-2 transition-colors ${generatedImage.isFavorite ? 'fill-current text-red-500' : 'text-slate-600'}`} />
                {generatedImage.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onGenerateNew}
                className="w-full py-2.5 rounded-xl bg-white/50 border border-slate-200 hover:bg-slate-50 text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Generate New Image
              </Button>
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/50">
            <h4 className="font-medium text-slate-900 mb-3 text-sm flex items-center gap-2">
              <span>ℹ️</span>
              <span>Generation Details</span>
            </h4>
            <div className="text-slate-600 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium">Platform:</span>
                <span className="font-medium text-primary">{generatedImage.platform}</span>
                <span className="text-slate-500">({generatedImage.dimensions})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Style:</span>
                <span className="font-medium text-secondary">{generatedImage.style}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Generated:</span>
                <span>{new Date(generatedImage.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Prompt:</span>
                <span className="text-xs bg-white/70 p-2 rounded-lg leading-relaxed">{generatedImage.prompt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
