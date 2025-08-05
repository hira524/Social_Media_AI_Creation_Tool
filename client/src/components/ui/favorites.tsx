import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Download, Eye, Search, Filter, Trash2, HeartOff } from "lucide-react";
import { useState } from "react";
import type { GeneratedImage } from "@shared/mongoSchema";

export default function Favorites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

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
      toast({
        title: "Success",
        description: "Favorite status updated successfully.",
      });
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      });
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
        description: "Failed to delete image.",
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

  const handleDeleteImage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter to only show favorite images, then apply additional filters
  const typedImages = images as GeneratedImage[];
  const favoriteImages = typedImages.filter(image => image.isFavorite);
  
  const filteredImages = favoriteImages
    .filter((image) => {
      const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter === "all" || image.platform === platformFilter;
      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "platform":
          return a.platform.localeCompare(b.platform);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-xl font-semibold">Favorite Images</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-40 bg-slate-200 rounded-xl mb-3"></div>
              <div className="h-3 bg-slate-200 rounded mb-2"></div>
              <div className="h-2 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-xl font-semibold">Favorite Images</h2>
          <Badge variant="secondary" className="ml-2 text-xs">
            {favoriteImages.length}
          </Badge>
        </div>
        
        {favoriteImages.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search favorite images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40 text-sm">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="platform">Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {favoriteImages.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HeartOff className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No favorites yet</h3>
          <p className="text-slate-600 text-sm mb-4">
            Start adding images to your favorites by clicking the heart icon
          </p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No matches found</h3>
          <p className="text-slate-600 text-sm mb-4">
            No favorite images match your current filters
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setPlatformFilter("all");
              setSortBy("newest");
            }}
            className="text-sm"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="group relative bg-gray-800/70 rounded-xl border border-gray-600 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="relative overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={`Generated image for ${image.platform}`}
                  className="w-full h-40 object-cover transition-transform group-hover:scale-105"
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
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5"
                  >
                    <Heart className="w-3 h-3 fill-current" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Favorite indicator */}
                <div className="absolute top-2 right-2">
                  <div className="bg-red-500 rounded-full p-1 shadow-sm">
                    <Heart className="w-2.5 h-2.5 fill-current text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-slate-900 line-clamp-2 mb-1">
                    {image.prompt}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs capitalize px-2 py-0.5">
                    {image.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {image.style}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{image.dimensions}</span>
                  <span>
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredImages.length > 0 && (
        <div className="mt-4 text-center text-xs text-slate-600">
          Showing {filteredImages.length} of {favoriteImages.length} favorite images
        </div>
      )}
    </div>
  );
}
