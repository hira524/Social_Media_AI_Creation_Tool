import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Download, Eye, Search, Filter, Trash2, Calendar } from "lucide-react";
import { useState } from "react";
import type { GeneratedImage } from "@shared/mongoSchema";

export default function History() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["/api/images"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/images/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({
        title: "Image Deleted",
        description: "Image deleted successfully.",
        variant: "success" as const,
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

  const handleDeleteImage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter and sort images
  const typedImages = images as GeneratedImage[];
  const filteredImages = typedImages
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Generation History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Generation History</span>
        </CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="platform">Platform</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {typedImages.length === 0 ? "No images yet" : "No images match your filters"}
            </h3>
            <p className="text-slate-600 mb-4">
              {typedImages.length === 0 
                ? "Create your first AI-generated image to see it here"
                : "Try adjusting your search terms or filters"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="group relative bg-gray-800 rounded-lg border border-gray-600 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={`Generated image for ${image.platform}`}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
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
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Favorite indicator */}
                  {image.isFavorite && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-4 h-4 fill-current text-red-500" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">
                      {image.prompt}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {image.enhancedPrompt}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {image.platform}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {image.style}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{image.dimensions}</span>
                    <span>
                      {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredImages.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-600">
            Showing {filteredImages.length} of {typedImages.length} images
          </div>
        )}
      </CardContent>
    </Card>
  );
}
