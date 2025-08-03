import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";
import { isUnauthorizedError } from "../lib/authUtils";
import { 
  UserCog, 
  Dumbbell, 
  Utensils, 
  Laptop, 
  Shirt, 
  TrendingUp, 
  Plane,
  CheckCircle
} from "lucide-react";

interface OnboardingData {
  niche: string;
  contentType: string;
  stylePreference: string;
}

const niches = [
  { value: "fitness", label: "Fitness", icon: Dumbbell },
  { value: "food", label: "Food", icon: Utensils },
  { value: "tech", label: "Tech", icon: Laptop },
  { value: "fashion", label: "Fashion", icon: Shirt },
  { value: "business", label: "Business", icon: TrendingUp },
  { value: "travel", label: "Travel", icon: Plane },
];

const contentTypes = [
  {
    value: "quotes",
    label: "Inspirational Quotes",
    description: "Motivational and inspirational quote posts"
  },
  {
    value: "promotions",
    label: "Product Promotions",
    description: "Marketing and promotional content"
  },
  {
    value: "educational",
    label: "Educational Content",
    description: "Tips, tutorials, and how-to guides"
  }
];

const styles = [
  {
    value: "professional",
    label: "Professional",
    description: "Clean, corporate, business-focused"
  },
  {
    value: "fun",
    label: "Fun & Playful",
    description: "Colorful, energetic, casual"
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Premium, elegant, sophisticated"
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Simple, clean, less-is-more"
  }
];

export default function Onboarding() {
  const [formData, setFormData] = useState<OnboardingData>({
    niche: "",
    contentType: "",
    stylePreference: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      await apiRequest("POST", "/api/onboarding", data);
    },
    onSuccess: async () => {
      toast({
        title: "Setup Complete!",
        description: "Your preferences have been saved. Let's start creating!",
      });
      // Immediately invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      
      // Navigate to dashboard immediately after invalidating queries
      setLocation("/dashboard");
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
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.niche || !formData.contentType || !formData.stylePreference) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all sections to continue.",
        variant: "destructive",
      });
      return;
    }

    onboardingMutation.mutate(formData);
  };

  const isFormValid = formData.niche && formData.contentType && formData.stylePreference;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Let's Personalize Your Experience</h2>
            <p className="text-slate-600 mt-2">Help us understand your needs to generate better AI images</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Niche Selection */}
            <div>
              <Label className="text-lg font-semibold text-slate-900 mb-4 block">What's your niche?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {niches.map((niche) => (
                  <Button
                    key={niche.value}
                    type="button"
                    variant={formData.niche === niche.value ? "default" : "outline"}
                    className="p-4 h-auto flex-col space-y-2"
                    onClick={() => setFormData({ ...formData, niche: niche.value })}
                  >
                    <niche.icon className="w-6 h-6" />
                    <span>{niche.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <Label className="text-lg font-semibold text-slate-900 mb-4 block">What type of content do you create?</Label>
              <RadioGroup
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                className="space-y-3"
              >
                {contentTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                      <div className="font-medium text-slate-900">{type.label}</div>
                      <div className="text-sm text-slate-600">{type.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Style Preference */}
            <div>
              <Label className="text-lg font-semibold text-slate-900 mb-4 block">What style do you prefer?</Label>
              <div className="grid grid-cols-2 gap-4">
                {styles.map((style) => (
                  <Button
                    key={style.value}
                    type="button"
                    variant={formData.stylePreference === style.value ? "default" : "outline"}
                    className="p-6 h-auto flex-col space-y-2 text-left"
                    onClick={() => setFormData({ ...formData, stylePreference: style.value })}
                  >
                    <div className="font-semibold">{style.label}</div>
                    <div className="text-sm opacity-80">{style.description}</div>
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={!isFormValid || onboardingMutation.isPending}
            >
              {onboardingMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Setting up your profile...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Setup & Start Creating</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
