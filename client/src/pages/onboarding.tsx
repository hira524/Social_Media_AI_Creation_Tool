import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
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
  CheckCircle,
  Users,
  Target,
  Clock,
  Palette,
  Globe,
  Heart,
  Building,
  Camera,
  Gamepad2,
  BookOpen,
  Music,
  Car,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface OnboardingData {
  // Basic info (Step 1)
  niche: string;
  contentType: string;
  stylePreference: string;
  
  // Business info (Step 2)
  businessType: string;
  targetAudience: string;
  audienceAge: string;
  
  // Content goals (Step 3)
  primaryGoal: string;
  postingFrequency: string;
  contentThemes: string[];
  
  // Brand personality (Step 4)
  brandPersonality: string;
  colorPreferences: string[];
  brandKeywords: string;
  
  // Platform focus (Step 5)
  primaryPlatforms: string[];
  contentFormats: string[];
  specialRequirements: string;
}

const niches = [
  { value: "fitness", label: "Fitness & Health", icon: Dumbbell },
  { value: "food", label: "Food & Cooking", icon: Utensils },
  { value: "tech", label: "Technology", icon: Laptop },
  { value: "fashion", label: "Fashion & Style", icon: Shirt },
  { value: "business", label: "Business & Finance", icon: TrendingUp },
  { value: "travel", label: "Travel & Adventure", icon: Plane },
  { value: "lifestyle", label: "Lifestyle", icon: Heart },
  { value: "education", label: "Education", icon: BookOpen },
  { value: "entertainment", label: "Entertainment", icon: Gamepad2 },
  { value: "music", label: "Music & Arts", icon: Music },
  { value: "automotive", label: "Automotive", icon: Car },
  { value: "realestate", label: "Real Estate", icon: Home },
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
  },
  {
    value: "announcements",
    label: "Announcements",
    description: "Company news and updates"
  },
  {
    value: "behind-scenes",
    label: "Behind the Scenes",
    description: "Process, team, and company culture content"
  },
  {
    value: "user-generated",
    label: "User-Generated Content",
    description: "Customer testimonials and reviews"
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
  },
  {
    value: "bold",
    label: "Bold & Vibrant",
    description: "High contrast, eye-catching"
  },
  {
    value: "vintage",
    label: "Vintage",
    description: "Retro, classic, nostalgic"
  }
];

const businessTypes = [
  { value: "startup", label: "Startup", icon: TrendingUp },
  { value: "smallbusiness", label: "Small Business", icon: Building },
  { value: "corporation", label: "Corporation", icon: Building },
  { value: "nonprofit", label: "Non-Profit", icon: Heart },
  { value: "freelancer", label: "Freelancer", icon: Users },
  { value: "influencer", label: "Influencer", icon: Camera },
  { value: "personal", label: "Personal Brand", icon: UserCog },
];

const targetAudiences = [
  { value: "b2b", label: "Businesses (B2B)", description: "Targeting other businesses" },
  { value: "b2c", label: "Consumers (B2C)", description: "Targeting individual consumers" },
  { value: "millennials", label: "Millennials", description: "Ages 27-42" },
  { value: "genz", label: "Gen Z", description: "Ages 18-26" },
  { value: "genx", label: "Gen X", description: "Ages 43-58" },
  { value: "professionals", label: "Professionals", description: "Career-focused individuals" },
  { value: "students", label: "Students", description: "Academic and learning community" },
];

const contentGoals = [
  { value: "brand-awareness", label: "Brand Awareness", description: "Increase visibility and recognition" },
  { value: "lead-generation", label: "Lead Generation", description: "Generate potential customers" },
  { value: "sales", label: "Direct Sales", description: "Drive immediate purchases" },
  { value: "engagement", label: "Community Engagement", description: "Build relationships with audience" },
  { value: "education", label: "Education", description: "Inform and teach your audience" },
  { value: "thought-leadership", label: "Thought Leadership", description: "Establish expertise in your field" },
];

const postingFrequencies = [
  { value: "daily", label: "Daily", description: "7 posts per week" },
  { value: "frequent", label: "Frequent", description: "4-6 posts per week" },
  { value: "regular", label: "Regular", description: "2-3 posts per week" },
  { value: "weekly", label: "Weekly", description: "1 post per week" },
  { value: "bi-weekly", label: "Bi-weekly", description: "Every 2 weeks" },
  { value: "monthly", label: "Monthly", description: "Once per month" },
];

const brandPersonalities = [
  { value: "professional", label: "Professional", description: "Serious, trustworthy, expert" },
  { value: "friendly", label: "Friendly", description: "Approachable, warm, conversational" },
  { value: "innovative", label: "Innovative", description: "Cutting-edge, forward-thinking" },
  { value: "authentic", label: "Authentic", description: "Genuine, transparent, honest" },
  { value: "inspiring", label: "Inspiring", description: "Motivational, uplifting, empowering" },
  { value: "fun", label: "Fun", description: "Playful, entertaining, lighthearted" },
];

const colorOptions = [
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-500" },
  { value: "black", label: "Black", color: "bg-black" },
  { value: "white", label: "White", color: "bg-white border" },
  { value: "gray", label: "Gray", color: "bg-gray-500" },
];

const platforms = [
  { value: "instagram", label: "Instagram", description: "Visual storytelling" },
  { value: "linkedin", label: "LinkedIn", description: "Professional networking" },
  { value: "twitter", label: "Twitter/X", description: "Real-time updates" },
  { value: "facebook", label: "Facebook", description: "Community building" },
  { value: "tiktok", label: "TikTok", description: "Short-form video" },
  { value: "youtube", label: "YouTube", description: "Long-form content" },
];

const contentFormats = [
  { value: "single-image", label: "Single Images", description: "Standard posts" },
  { value: "carousel", label: "Carousel Posts", description: "Multiple images" },
  { value: "stories", label: "Stories", description: "Temporary content" },
  { value: "videos", label: "Videos", description: "Motion content" },
  { value: "infographics", label: "Infographics", description: "Data visualization" },
  { value: "testimonials", label: "Testimonials", description: "Customer reviews" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<OnboardingData>({
    // Basic info (Step 1)
    niche: "",
    contentType: "",
    stylePreference: "",
    
    // Business info (Step 2)
    businessType: "",
    targetAudience: "",
    audienceAge: "",
    
    // Content goals (Step 3)
    primaryGoal: "",
    postingFrequency: "",
    contentThemes: [],
    
    // Brand personality (Step 4)
    brandPersonality: "",
    colorPreferences: [],
    brandKeywords: "",
    
    // Platform focus (Step 5)
    primaryPlatforms: [],
    contentFormats: [],
    specialRequirements: "",
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
    
    if (!isFormValid()) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required sections to continue.",
        variant: "destructive",
      });
      return;
    }

    onboardingMutation.mutate(formData);
  };

  const isFormValid = () => {
    // Step 1 validation
    if (!formData.niche || !formData.contentType || !formData.stylePreference) return false;
    // Step 2 validation
    if (!formData.businessType || !formData.targetAudience) return false;
    // Step 3 validation
    if (!formData.primaryGoal || !formData.postingFrequency) return false;
    // Step 4 validation
    if (!formData.brandPersonality || formData.colorPreferences.length === 0) return false;
    // Step 5 validation
    if (formData.primaryPlatforms.length === 0 || formData.contentFormats.length === 0) return false;
    
    return true;
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.niche && formData.contentType && formData.stylePreference;
      case 2:
        return formData.businessType && formData.targetAudience;
      case 3:
        return formData.primaryGoal && formData.postingFrequency;
      case 4:
        return formData.brandPersonality && formData.colorPreferences.length > 0;
      case 5:
        return formData.primaryPlatforms.length > 0 && formData.contentFormats.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!isStepValid(currentStep)) {
      toast({
        title: "Please complete this step",
        description: "Fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMultiSelect = (field: keyof OnboardingData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [field]: newArray });
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Business Details";
      case 3: return "Content Goals";
      case 4: return "Brand Personality";
      case 5: return "Platform Strategy";
      default: return "";
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return "Tell us about your niche and content preferences";
      case 2: return "Help us understand your business and target audience";
      case 3: return "Define your content goals and posting strategy";
      case 4: return "Establish your brand's personality and visual identity";
      case 5: return "Choose your platforms and content formats";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Let's Personalize Your Experience</h2>
            <p className="text-slate-600 mt-2">{getStepDescription(currentStep)}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">
                Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
              </span>
              <span className="text-sm text-slate-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Niche Selection */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What's your niche? *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {niches.map((niche) => (
                      <Button
                        key={niche.value}
                        type="button"
                        variant={formData.niche === niche.value ? "default" : "outline"}
                        className="p-4 h-auto flex-col space-y-2 text-center"
                        onClick={() => setFormData({ ...formData, niche: niche.value })}
                      >
                        <niche.icon className="w-6 h-6" />
                        <span className="text-sm">{niche.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Content Type */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What type of content do you create? *</Label>
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
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What style do you prefer? *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-8">
                {/* Business Type */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What type of business are you? *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {businessTypes.map((business) => (
                      <Button
                        key={business.value}
                        type="button"
                        variant={formData.businessType === business.value ? "default" : "outline"}
                        className="p-4 h-auto flex-col space-y-2"
                        onClick={() => setFormData({ ...formData, businessType: business.value })}
                      >
                        <business.icon className="w-6 h-6" />
                        <span className="text-sm">{business.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">Who is your target audience? *</Label>
                  <RadioGroup
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                    className="space-y-3"
                  >
                    {targetAudiences.map((audience) => (
                      <div key={audience.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={audience.value} id={audience.value} />
                        <Label htmlFor={audience.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-slate-900">{audience.label}</div>
                          <div className="text-sm text-slate-600">{audience.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Audience Age */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">Primary age range of your audience</Label>
                  <Input
                    placeholder="e.g., 25-35, 18-24, 35-50"
                    value={formData.audienceAge}
                    onChange={(e) => setFormData({ ...formData, audienceAge: e.target.value })}
                    className="max-w-md"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Content Goals */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Primary Goal */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What's your primary content goal? *</Label>
                  <RadioGroup
                    value={formData.primaryGoal}
                    onValueChange={(value) => setFormData({ ...formData, primaryGoal: value })}
                    className="space-y-3"
                  >
                    {contentGoals.map((goal) => (
                      <div key={goal.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={goal.value} id={goal.value} />
                        <Label htmlFor={goal.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-slate-900">{goal.label}</div>
                          <div className="text-sm text-slate-600">{goal.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Posting Frequency */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">How often do you plan to post? *</Label>
                  <RadioGroup
                    value={formData.postingFrequency}
                    onValueChange={(value) => setFormData({ ...formData, postingFrequency: value })}
                    className="space-y-3"
                  >
                    {postingFrequencies.map((frequency) => (
                      <div key={frequency.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={frequency.value} id={frequency.value} />
                        <Label htmlFor={frequency.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-slate-900">{frequency.label}</div>
                          <div className="text-sm text-slate-600">{frequency.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Content Themes */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What themes interest your audience? (Select multiple)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Motivation", "Tips & Tricks", "Industry News", "Personal Stories", "Product Features", "Customer Success", "Behind the Scenes", "Trends", "How-to Guides"].map((theme) => (
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox
                          id={theme}
                          checked={formData.contentThemes.includes(theme)}
                          onCheckedChange={() => handleMultiSelect("contentThemes", theme)}
                        />
                        <Label htmlFor={theme} className="text-sm cursor-pointer">{theme}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Brand Personality */}
            {currentStep === 4 && (
              <div className="space-y-8">
                {/* Brand Personality */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">How would you describe your brand personality? *</Label>
                  <RadioGroup
                    value={formData.brandPersonality}
                    onValueChange={(value) => setFormData({ ...formData, brandPersonality: value })}
                    className="space-y-3"
                  >
                    {brandPersonalities.map((personality) => (
                      <div key={personality.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={personality.value} id={personality.value} />
                        <Label htmlFor={personality.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-slate-900">{personality.label}</div>
                          <div className="text-sm text-slate-600">{personality.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Color Preferences */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What colors represent your brand? * (Select 2-4)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.value}
                        type="button"
                        variant="outline"
                        className={`p-3 h-auto flex-col space-y-2 ${
                          formData.colorPreferences.includes(color.value) ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleMultiSelect("colorPreferences", color.value)}
                      >
                        <div className={`w-8 h-8 rounded-full ${color.color}`} />
                        <span className="text-xs">{color.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Brand Keywords */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">Brand keywords (comma-separated)</Label>
                  <Textarea
                    placeholder="e.g., innovative, reliable, premium, eco-friendly, cutting-edge"
                    value={formData.brandKeywords}
                    onChange={(e) => setFormData({ ...formData, brandKeywords: e.target.value })}
                    className="max-w-2xl"
                    rows={3}
                  />
                  <p className="text-sm text-slate-500 mt-2">These keywords will help personalize your content generation</p>
                </div>
              </div>
            )}

            {/* Step 5: Platform Strategy */}
            {currentStep === 5 && (
              <div className="space-y-8">
                {/* Primary Platforms */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">Which platforms will you focus on? * (Select multiple)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {platforms.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.value}
                          checked={formData.primaryPlatforms.includes(platform.value)}
                          onCheckedChange={() => handleMultiSelect("primaryPlatforms", platform.value)}
                        />
                        <Label htmlFor={platform.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-slate-900">{platform.label}</div>
                          <div className="text-sm text-slate-600">{platform.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Formats */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">What content formats interest you? * (Select multiple)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {contentFormats.map((format) => (
                      <div key={format.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={format.value}
                          checked={formData.contentFormats.includes(format.value)}
                          onCheckedChange={() => handleMultiSelect("contentFormats", format.value)}
                        />
                        <Label htmlFor={format.value} className="flex-1 cursor-pointer">
                          <div className="font-medium text-slate-900">{format.label}</div>
                          <div className="text-sm text-slate-600">{format.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <Label className="text-lg font-semibold text-slate-900 mb-4 block">Any special requirements or preferences?</Label>
                  <Textarea
                    placeholder="e.g., Always include company logo, specific font preferences, avoid certain colors, accessibility requirements..."
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    className="max-w-2xl"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={!isFormValid() || onboardingMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  {onboardingMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Setting up your profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete Setup & Start Creating</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
