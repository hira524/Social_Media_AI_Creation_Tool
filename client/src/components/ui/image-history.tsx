import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Download, Eye } from "lucide-react";
import type { GeneratedImage } from "@shared/schema";

export default function ImageHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["/api/images"],
    retry: false,
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: number; isFavorite: boolean }) => {
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
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Generations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-32 bg-slate-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const typedImages = images as GeneratedImage[];

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Generations</h2>
          {typedImages.length > 8 && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>

        {typedImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No images yet</h3>
            <p className="text-slate-600 mb-4">Create your first AI-generated image to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {typedImages.slice(0, 8).map((image) => (
              <div key={image.id} className="group relative">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={image.imageUrl}
                    alt={`Generated image for ${image.platform}`}
                    className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewImage(image)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(image)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleToggleFavorite(image)}
                      disabled={favoriteMutation.isPending}
                    >
                      <Heart 
                        className={`w-4 h-4 ${image.isFavorite ? 'fill-current text-red-500' : ''}`} 
                      />
                    </Button>
                  </div>
                  
                  {/* Favorite indicator */}
                  {image.isFavorite && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-4 h-4 fill-current text-red-500" />
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {image.prompt.length > 30 
                        ? `${image.prompt.substring(0, 30)}...` 
                        : image.prompt
                      }
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {image.platform}
                    </Badge>
                    <div className="text-xs text-slate-600">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}