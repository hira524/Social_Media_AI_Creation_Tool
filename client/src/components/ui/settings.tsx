import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Palette, 
  CreditCard, 
  Shield, 
  Bell, 
  Download,
  Trash2,
  AlertTriangle,
  Check,
  X
} from "lucide-react";
import { useState } from "react";
import type { User } from "@shared/mongoSchema";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Local state for form fields
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  
  // Basic onboarding data
  const [niche, setNiche] = useState(user?.niche || "");
  const [contentType, setContentType] = useState(user?.contentType || "");
  const [stylePreference, setStylePreference] = useState(user?.stylePreference || "");
  
  // Business information
  const [businessType, setBusinessType] = useState(user?.businessType || "");
  const [targetAudience, setTargetAudience] = useState(user?.targetAudience || "");
  const [audienceAge, setAudienceAge] = useState(user?.audienceAge || "");
  
  // Content goals
  const [primaryGoal, setPrimaryGoal] = useState(user?.primaryGoal || "");
  const [postingFrequency, setPostingFrequency] = useState(user?.postingFrequency || "");
  const [contentThemes, setContentThemes] = useState<string[]>(user?.contentThemes || []);
  
  // Brand personality
  const [brandPersonality, setBrandPersonality] = useState(user?.brandPersonality || "");
  const [colorPreferences, setColorPreferences] = useState<string[]>(user?.colorPreferences || []);
  const [brandKeywords, setBrandKeywords] = useState(user?.brandKeywords || "");
  
  // Platform strategy
  const [primaryPlatforms, setPrimaryPlatforms] = useState<string[]>(user?.primaryPlatforms || []);
  const [contentFormats, setContentFormats] = useState<string[]>(user?.contentFormats || []);
  const [specialRequirements, setSpecialRequirements] = useState(user?.specialRequirements || "");
  
  // Notification preferences (you can expand this based on your needs)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      await apiRequest("PATCH", "/api/user/profile", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully.",
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
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/user/account");
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate({
      firstName,
      lastName,
      email,
      
      // Basic onboarding data
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

  const handleDeleteAccount = () => {
    const confirmation = window.prompt(
      'Are you absolutely sure you want to delete your account? This action cannot be undone.\n\nType "DELETE" to confirm:'
    );
    
    if (confirmation === "DELETE") {
      deleteAccountMutation.mutate();
    } else if (confirmation !== null) {
      toast({
        title: "Deletion cancelled",
        description: "Account deletion was cancelled.",
      });
    }
  };

  const exportUserData = async () => {
    try {
      // This would typically call an API endpoint to generate user data export
      const userData = {
        profile: user,
        exportDate: new Date().toISOString(),
        // Add other user data as needed
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export user data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasProfileChanges = 
    firstName !== (user?.firstName || "") ||
    lastName !== (user?.lastName || "") ||
    email !== (user?.email || "") ||
    niche !== (user?.niche || "") ||
    contentType !== (user?.contentType || "") ||
    stylePreference !== (user?.stylePreference || "") ||
    businessType !== (user?.businessType || "") ||
    targetAudience !== (user?.targetAudience || "") ||
    audienceAge !== (user?.audienceAge || "") ||
    primaryGoal !== (user?.primaryGoal || "") ||
    postingFrequency !== (user?.postingFrequency || "") ||
    JSON.stringify(contentThemes) !== JSON.stringify(user?.contentThemes || []) ||
    brandPersonality !== (user?.brandPersonality || "") ||
    JSON.stringify(colorPreferences) !== JSON.stringify(user?.colorPreferences || []) ||
    brandKeywords !== (user?.brandKeywords || "") ||
    JSON.stringify(primaryPlatforms) !== JSON.stringify(user?.primaryPlatforms || []) ||
    JSON.stringify(contentFormats) !== JSON.stringify(user?.contentFormats || []) ||
    specialRequirements !== (user?.specialRequirements || "");

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger>
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
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
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
              <Label htmlFor="stylePreference">Style Preference</Label>
              <Select value={stylePreference} onValueChange={setStylePreference}>
                <SelectTrigger>
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

          <Separator />

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="smallbusiness">Small Business</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="influencer">Influencer</SelectItem>
                    <SelectItem value="personal">Personal Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b2b">Businesses (B2B)</SelectItem>
                    <SelectItem value="b2c">Consumers (B2C)</SelectItem>
                    <SelectItem value="millennials">Millennials</SelectItem>
                    <SelectItem value="genz">Gen Z</SelectItem>
                    <SelectItem value="genx">Gen X</SelectItem>
                    <SelectItem value="professionals">Professionals</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audienceAge">Audience Age Range</Label>
                <Input
                  id="audienceAge"
                  value={audienceAge}
                  onChange={(e) => setAudienceAge(e.target.value)}
                  placeholder="e.g., 25-35, 18-24"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Content Strategy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Content Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryGoal">Primary Goal</Label>
                <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="sales">Direct Sales</SelectItem>
                    <SelectItem value="engagement">Community Engagement</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postingFrequency">Posting Frequency</Label>
                <Select value={postingFrequency} onValueChange={setPostingFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select posting frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="frequent">Frequent (4-6/week)</SelectItem>
                    <SelectItem value="regular">Regular (2-3/week)</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brand Personality */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Brand Personality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandPersonality">Brand Personality</Label>
                <Select value={brandPersonality} onValueChange={setBrandPersonality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand personality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="innovative">Innovative</SelectItem>
                    <SelectItem value="authentic">Authentic</SelectItem>
                    <SelectItem value="inspiring">Inspiring</SelectItem>
                    <SelectItem value="fun">Fun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandKeywords">Brand Keywords</Label>
                <Input
                  id="brandKeywords"
                  value={brandKeywords}
                  onChange={(e) => setBrandKeywords(e.target.value)}
                  placeholder="e.g., innovative, reliable, premium"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Special Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Special Requirements</h3>
            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Additional Preferences or Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="e.g., Always include company logo, specific font preferences, avoid certain colors, accessibility requirements..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleProfileUpdate}
              disabled={!hasProfileChanges || updateProfileMutation.isPending}
              className="flex items-center space-x-2"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account & Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Account & Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Credits Remaining</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-lg py-2 px-4">
                  {user?.creditsRemaining || 0} credits
                </Badge>
                <Button variant="outline" size="sm">
                  Buy More Credits
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  Free Plan
                </Badge>
                <Button variant="outline" size="sm">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Member Since</Label>
            <p className="text-sm text-slate-600">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600">Receive updates about your generations</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Browser Notifications</Label>
                <p className="text-sm text-slate-600">Get notified when generations are complete</p>
              </div>
              <Switch
                checked={browserNotifications}
                onCheckedChange={setBrowserNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-slate-600">Receive updates about new features and tips</p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Data & Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Your Data</Label>
                <p className="text-sm text-slate-600">Download a copy of your data</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportUserData}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Privacy Policy</Label>
              <p className="text-sm text-slate-600">
                Read our privacy policy to understand how we handle your data.
              </p>
              <Button variant="link" className="p-0 h-auto text-sm">
                View Privacy Policy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Label className="text-red-800">Delete Account</Label>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  {deleteAccountMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Account</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
