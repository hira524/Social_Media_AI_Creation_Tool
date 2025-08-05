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
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
          <h2 className="text-xl font-semibold text-white">Favorite Images</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-40 bg-gray-700/50 rounded-xl mb-3"></div>
              <div className="h-3 bg-gray-700/50 rounded mb-2"></div>
              <div className="h-2 bg-gray-700/50 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-gray-700/50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 animate-fade-in-up hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6 animate-slide-in-left">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
          <h2 className="text-xl font-semibold text-white">Favorite Images</h2>
          <Badge variant="secondary" className="ml-2 text-xs bg-gray-800 text-gray-300 border-gray-600">
            {favoriteImages.length}
          </Badge>
        </div>
        
        {favoriteImages.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search favorite images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-40 text-sm bg-gray-800 border-gray-600 text-white focus:border-primary">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Platforms</SelectItem>
                <SelectItem value="instagram" className="text-white hover:bg-gray-700">Instagram</SelectItem>
                <SelectItem value="linkedin" className="text-white hover:bg-gray-700">LinkedIn</SelectItem>
                <SelectItem value="twitter" className="text-white hover:bg-gray-700">Twitter</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32 text-sm bg-gray-800 border-gray-600 text-white focus:border-primary">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="newest" className="text-white hover:bg-gray-700">Newest</SelectItem>
                <SelectItem value="oldest" className="text-white hover:bg-gray-700">Oldest</SelectItem>
                <SelectItem value="platform" className="text-white hover:bg-gray-700">Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {favoriteImages.length === 0 ? (
        <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="w-16 h-16 bg-gray-800/60 rounded-xl flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <HeartOff className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No favorites yet</h3>
          <p className="text-gray-300 text-sm mb-4">
            Start adding images to your favorites by clicking the heart icon
          </p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="w-16 h-16 bg-gray-800/60 rounded-xl flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
          <p className="text-gray-300 text-sm mb-4">
            No favorite images match your current filters
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setPlatformFilter("all");
              setSortBy("newest");
            }}
            className="text-sm bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-300"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          {filteredImages.map((image, index) => (
            <div key={image.id} className="group relative glass-card bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-600 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in" style={{animationDelay: `${0.5 + index * 0.1}s`}}>
              <div className="relative overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={`Generated image for ${image.platform}`}
                  className="w-full h-40 object-cover transition-transform group-hover:scale-110 duration-300"
                />
                
                {/* Enhanced Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewImage(image)}
                    className="p-2 bg-gray-800/90 hover:bg-gray-700 text-white border-gray-600 hover:scale-110 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(image)}
                    className="p-2 bg-gray-800/90 hover:bg-gray-700 text-white border-gray-600 hover:scale-110 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleToggleFavorite(image)}
                    disabled={favoriteMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 border-red-500 hover:scale-110 transition-all duration-200"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 hover:scale-110 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Enhanced Favorite indicator */}
                <div className="absolute top-2 right-2 animate-pulse-gentle">
                  <div className="bg-red-500 rounded-full p-1.5 shadow-lg">
                    <Heart className="w-3 h-3 fill-current text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-800/80">
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-white line-clamp-2 mb-1">
                    {image.prompt}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs capitalize px-2 py-0.5 bg-primary/20 text-primary border-primary/30">
                    {image.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-300 border-gray-600">
                    {image.style}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
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
        <div className="mt-6 text-center text-xs text-gray-400 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          Showing {filteredImages.length} of {favoriteImages.length} favorite images
        </div>
      )}
    </div>
  );
}
