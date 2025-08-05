import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  CreditCard, 
  Bell, 
  AlertTriangle,
  Check,
  Trash2,
  Crown,
  Building,
  Target,
  Palette,
  Globe,
  Users,
  Clock,
  Hash
} from "lucide-react";
import { useState, useEffect } from "react";
import type { User } from "@shared/mongoSchema";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Personal information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  // Content preferences
  const [niche, setNiche] = useState("");
  const [contentType, setContentType] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  
  // Business information
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [audienceAge, setAudienceAge] = useState("");
  
  // Content goals
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [postingFrequency, setPostingFrequency] = useState("");
  const [contentThemes, setContentThemes] = useState<string[]>([]);
  
  // Brand personality
  const [brandPersonality, setBrandPersonality] = useState("");
  const [colorPreferences, setColorPreferences] = useState<string[]>([]);
  const [brandKeywords, setBrandKeywords] = useState("");
  
  // Platform strategy
  const [primaryPlatforms, setPrimaryPlatforms] = useState<string[]>([]);
  const [contentFormats, setContentFormats] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState("");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Sync with user data
  useEffect(() => {
    if (user) {
      // Personal information
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      
      // Content preferences
      setNiche(user.niche || "");
      setContentType(user.contentType || "");
      setStylePreference(user.stylePreference || "");
      
      // Business information
      setBusinessType(user.businessType || "");
      setTargetAudience(user.targetAudience || "");
      setAudienceAge(user.audienceAge || "");
      
      // Content goals
      setPrimaryGoal(user.primaryGoal || "");
      setPostingFrequency(user.postingFrequency || "");
      setContentThemes(user.contentThemes || []);
      
      // Brand personality
      setBrandPersonality(user.brandPersonality || "");
      setColorPreferences(user.colorPreferences || []);
      setBrandKeywords(user.brandKeywords || "");
      
      // Platform strategy
      setPrimaryPlatforms(user.primaryPlatforms || []);
      setContentFormats(user.contentFormats || []);
      setSpecialRequirements(user.specialRequirements || "");
    }
  }, [user]);

  const saveProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveChanges = () => {
    saveProfileMutation.mutate({
      // Personal information
      firstName,
      lastName,
      email,
      
      // Content preferences
      niche,
      contentType,
      stylePreference,
      
      // Business information
      businessType,
      targetAudience,
      audienceAge,
      
      // Content goals
      primaryGoal,
      postingFrequency,
      contentThemes,
      
      // Brand personality
      brandPersonality,
      colorPreferences,
      brandKeywords,
      
      // Platform strategy
      primaryPlatforms,
      contentFormats,
      specialRequirements,
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <p className="text-sm text-gray-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Enhanced Profile Settings */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <UserIcon className="w-3 h-3 text-primary" />
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <UserIcon className="w-3 h-3 text-primary" />
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Content Preferences */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Content Preferences</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm font-medium text-gray-300">Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness & Health</SelectItem>
                  <SelectItem value="food">Food & Cooking</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="fashion">Fashion & Style</SelectItem>
                  <SelectItem value="business">Business & Finance</SelectItem>
                  <SelectItem value="travel">Travel & Adventure</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="music">Music & Arts</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="realestate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentType" className="text-sm font-medium text-gray-300">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quotes">Inspirational Quotes</SelectItem>
                  <SelectItem value="promotions">Product Promotions</SelectItem>
                  <SelectItem value="educational">Educational Content</SelectItem>
                  <SelectItem value="announcements">Announcements</SelectItem>
                  <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                  <SelectItem value="user-generated">User-Generated Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stylePreference" className="text-sm font-medium text-gray-300">Style Preference</Label>
              <Select value={stylePreference} onValueChange={setStylePreference}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="fun">Fun & Playful</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="bold">Bold & Vibrant</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Business Information</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-sm font-medium text-gray-300">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="smallbusiness">Small Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="personal">Personal Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-300">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Young professionals, Fitness enthusiasts"
                className="bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audienceAge" className="text-sm font-medium text-gray-300">Audience Age Range</Label>
              <Select value={audienceAge} onValueChange={setAudienceAge}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24 years</SelectItem>
                  <SelectItem value="25-34">25-34 years</SelectItem>
                  <SelectItem value="35-44">35-44 years</SelectItem>
                  <SelectItem value="45-54">45-54 years</SelectItem>
                  <SelectItem value="55-64">55-64 years</SelectItem>
                  <SelectItem value="65+">65+ years</SelectItem>
                  <SelectItem value="all">All ages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Goals */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Content Goals</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryGoal" className="text-sm font-medium text-gray-300">Primary Goal</Label>
              <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="Select primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                  <SelectItem value="lead-generation">Lead Generation</SelectItem>
                  <SelectItem value="sales">Drive Sales</SelectItem>
                  <SelectItem value="engagement">Increase Engagement</SelectItem>
                  <SelectItem value="education">Educate Audience</SelectItem>
                  <SelectItem value="community">Build Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postingFrequency" className="text-sm font-medium text-gray-300">Posting Frequency</Label>
              <Select value={postingFrequency} onValueChange={setPostingFrequency}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                  <SelectValue placeholder="How often do you post?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="few-times-week">Few times a week</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="irregular">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Content Themes</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Tips & Tutorials",
                "Behind the Scenes", 
                "Product Features",
                "Industry News",
                "Customer Stories",
                "Team Culture",
                "Events & Announcements",
                "Seasonal Content",
                "User-Generated Content"
              ].map((theme) => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox
                    id={theme}
                    checked={contentThemes.includes(theme)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setContentThemes([...contentThemes, theme]);
                      } else {
                        setContentThemes(contentThemes.filter(t => t !== theme));
                      }
                    }}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={theme} className="text-sm text-gray-300 cursor-pointer">
                    {theme}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Personality */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Hash className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Brand Personality</h3>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandPersonality" className="text-sm font-medium text-gray-300">Brand Personality</Label>
            <Select value={brandPersonality} onValueChange={setBrandPersonality}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-primary">
                <SelectValue placeholder="How would you describe your brand?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional & Authoritative</SelectItem>
                <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                <SelectItem value="innovative">Innovative & Forward-thinking</SelectItem>
                <SelectItem value="playful">Playful & Fun</SelectItem>
                <SelectItem value="sophisticated">Sophisticated & Elegant</SelectItem>
                <SelectItem value="trustworthy">Trustworthy & Reliable</SelectItem>
                <SelectItem value="energetic">Energetic & Dynamic</SelectItem>
                <SelectItem value="caring">Caring & Compassionate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Color Preferences</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: "Blue", value: "blue", color: "bg-blue-500" },
                { name: "Red", value: "red", color: "bg-red-500" },
                { name: "Green", value: "green", color: "bg-green-500" },
                { name: "Purple", value: "purple", color: "bg-purple-500" },
                { name: "Orange", value: "orange", color: "bg-orange-500" },
                { name: "Pink", value: "pink", color: "bg-pink-500" },
                { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
                { name: "Gray", value: "gray", color: "bg-gray-500" },
                { name: "Black", value: "black", color: "bg-black" },
                { name: "White", value: "white", color: "bg-white" },
                { name: "Gold", value: "gold", color: "bg-yellow-400" },
                { name: "Silver", value: "silver", color: "bg-gray-400" }
              ].map((color) => (
                <div key={color.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={color.value}
                    checked={colorPreferences.includes(color.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setColorPreferences([...colorPreferences, color.value]);
                      } else {
                        setColorPreferences(colorPreferences.filter(c => c !== color.value));
                      }
                    }}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className={`w-4 h-4 rounded-full ${color.color} border border-gray-600`}></div>
                  <Label htmlFor={color.value} className="text-sm text-gray-300 cursor-pointer">
                    {color.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brandKeywords" className="text-sm font-medium text-gray-300">Brand Keywords</Label>
            <Textarea
              id="brandKeywords"
              value={brandKeywords}
              onChange={(e) => setBrandKeywords(e.target.value)}
              placeholder="Enter keywords that describe your brand (e.g., innovative, sustainable, premium, reliable)"
              className="bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Platform Strategy */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Platform Strategy</h3>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Primary Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Instagram",
                "Facebook", 
                "Twitter/X",
                "LinkedIn",
                "TikTok",
                "YouTube",
                "Pinterest",
                "Snapchat"
              ].map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={primaryPlatforms.includes(platform)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPrimaryPlatforms([...primaryPlatforms, platform]);
                      } else {
                        setPrimaryPlatforms(primaryPlatforms.filter(p => p !== platform));
                      }
                    }}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={platform} className="text-sm text-gray-300 cursor-pointer">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Content Formats</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Square Posts",
                "Story Format", 
                "Carousel Posts",
                "Video Content",
                "Infographics",
                "Quote Cards",
                "Product Showcases",
                "Blog Graphics",
                "Event Announcements"
              ].map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={format}
                    checked={contentFormats.includes(format)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setContentFormats([...contentFormats, format]);
                      } else {
                        setContentFormats(contentFormats.filter(f => f !== format));
                      }
                    }}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={format} className="text-sm text-gray-300 cursor-pointer">
                    {format}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialRequirements" className="text-sm font-medium text-gray-300">Special Requirements</Label>
            <Textarea
              id="specialRequirements"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="Any specific requirements, restrictions, or preferences for your content..."
              className="bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6">
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveChanges}
            disabled={saveProfileMutation.isPending}
            className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 transition-all duration-300 group px-8 py-3"
          >
            {saveProfileMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>Save All Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Account & Usage */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Account & Usage</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl border border-primary/30 hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-primary">{user?.creditsRemaining || 0}</div>
              <div className="text-xs text-gray-300">Credits Remaining</div>
            </div>
            <div className="text-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-orange-400">{user?.creditsUsed || 0}</div>
              <div className="text-xs text-gray-400">Credits Used</div>
            </div>
            <div className="text-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-white">{user?.totalGenerations || 0}</div>
              <div className="text-xs text-gray-400">Total Images</div>
            </div>
            <div className="text-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-red-400">{user?.favoriteCount || 0}</div>
              <div className="text-xs text-gray-400">Favorites</div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">Upgrade to Pro</h4>
                <p className="text-gray-300 text-sm">Get unlimited generations and premium features</p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Notification Preferences */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-xl border border-gray-600 hover:bg-gray-800/80 transition-all duration-300">
            <div>
              <Label className="text-sm font-medium text-white">Email Notifications</Label>
              <p className="text-xs text-gray-300">Receive updates about your account and generations</p>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-xl border border-gray-600 hover:bg-gray-800/80 transition-all duration-300">
            <div>
              <Label className="text-sm font-medium text-white">Browser Notifications</Label>
              <p className="text-xs text-gray-300">Get notified when your images are ready</p>
            </div>
            <Switch 
              checked={browserNotifications} 
              onCheckedChange={setBrowserNotifications}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-xl border border-gray-600 hover:bg-gray-800/80 transition-all duration-300">
            <div>
              <Label className="text-sm font-medium text-white">Marketing Emails</Label>
              <p className="text-xs text-gray-300">Receive tips, updates, and promotional offers</p>
            </div>
            <Switch 
              checked={marketingEmails} 
              onCheckedChange={setMarketingEmails}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Danger Zone */}
      <div className="glass-card bg-red-950/80 backdrop-blur-xl border border-red-800/60 shadow-strong rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="p-6 bg-red-900/40 rounded-xl border border-red-800/60 hover:bg-red-900/50 transition-all duration-300">
            <h4 className="font-semibold text-red-400 mb-2 text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </h4>
            <p className="text-red-300 text-xs mb-4">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              className="text-xs bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  toast({
                    title: "Account Deletion",
                    description: "Please contact support to delete your account.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
