import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Download, Eye } from "lucide-react";
import type { GeneratedImage } from "@shared/mongoSchema";

export default function ImageHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["/api/images"],
    retry: false,
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      await apiRequest("PATCH", `/api/images/${id}/favorite`, { isFavorite });
    },
    onSuccess: () => {
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

  const handleToggleFavorite = (image: GeneratedImage) => {
    favoriteMutation.mutate({
      id: image.id,
      isFavorite: !image.isFavorite,
    });
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `ai-generated-${image.platform}-${image.id}.png`;
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

  const handleViewImage = (image: GeneratedImage) => {
    window.open(image.imageUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Recent Generations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-28 bg-slate-200 rounded-xl mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-1"></div>
              <div className="h-2 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const typedImages = images as GeneratedImage[];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Recent Generations</h2>
        {typedImages.length > 8 && (
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        )}
      </div>

      {typedImages.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Eye className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No images yet</h3>
          <p className="text-slate-600 text-sm mb-4">Create your first AI-generated image to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {typedImages.slice(0, 8).map((image) => (
            <div key={image.id} className="group relative">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={image.imageUrl}
                  alt={`Generated image for ${image.platform}`}
                  className="w-full h-28 object-cover transition-transform group-hover:scale-105"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewImage(image)}
                    className="p-1.5"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(image)}
                    className="p-1.5"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggleFavorite(image)}
                    disabled={favoriteMutation.isPending}
                    className="p-1.5"
                  >
                    <Heart 
                      className={`w-3 h-3 ${image.isFavorite ? 'fill-current text-red-500' : ''}`} 
                    />
                  </Button>
                </div>
                
                {/* Favorite indicator */}
                {image.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Heart className="w-3 h-3 fill-current text-red-500" />
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <div className="text-xs font-medium text-slate-900 truncate mb-1">
                  {image.prompt.length > 25 
                    ? `${image.prompt.substring(0, 25)}...` 
                    : image.prompt
                  }
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {image.platform}
                  </Badge>
                  <div className="text-xs text-slate-500">
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}