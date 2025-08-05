import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Crown
} from "lucide-react";
import { useState, useEffect } from "react";
import type { User } from "@shared/mongoSchema";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [contentType, setContentType] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Sync with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setNiche(user.niche || "");
      setContentType(user.contentType || "");
      setStylePreference(user.stylePreference || "");
    }
  }, [user]);

  const saveProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/user/profile", data);
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
      firstName,
      lastName,
      email,
      niche,
      contentType,
      stylePreference,
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 animate-fade-in-up">
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
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.1s'}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
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
            <div className="space-y-2 animate-slide-in-right" style={{animationDelay: '0.3s'}}>
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
          
          <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
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

          <div className="pt-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <Button 
              onClick={handleSaveChanges}
              disabled={saveProfileMutation.isPending}
              className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              {saveProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Account & Usage */}
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Account & Usage</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl border border-primary/30 hover:scale-105 transition-all duration-300 animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="text-2xl font-bold text-primary">{user?.creditsRemaining || 0}</div>
              <div className="text-xs text-gray-300">Credits Remaining</div>
            </div>
            <div className="text-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:scale-105 transition-all duration-300 animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="text-2xl font-bold text-orange-400">{user?.creditsUsed || 0}</div>
              <div className="text-xs text-gray-400">Credits Used</div>
            </div>
            <div className="text-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:scale-105 transition-all duration-300 animate-scale-in" style={{animationDelay: '0.5s'}}>
              <div className="text-2xl font-bold text-white">{user?.totalGenerations || 0}</div>
              <div className="text-xs text-gray-400">Total Images</div>
            </div>
            <div className="text-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:scale-105 transition-all duration-300 animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="text-2xl font-bold text-red-400">{user?.favoriteCount || 0}</div>
              <div className="text-xs text-gray-400">Favorites</div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
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
      <div className="glass-card bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-strong rounded-2xl p-6 animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '0.8s'}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-xl border border-gray-600 hover:bg-gray-800/80 transition-all duration-300 animate-slide-in" style={{animationDelay: '0.9s'}}>
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
          
          <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-xl border border-gray-600 hover:bg-gray-800/80 transition-all duration-300 animate-slide-in" style={{animationDelay: '1.0s'}}>
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
          
          <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-xl border border-gray-600 hover:bg-gray-800/80 transition-all duration-300 animate-slide-in" style={{animationDelay: '1.1s'}}>
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
      <div className="glass-card bg-red-950/80 backdrop-blur-xl border border-red-800/60 shadow-strong rounded-2xl p-6 animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{animationDelay: '1.2s'}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="p-6 bg-red-900/40 rounded-xl border border-red-800/60 hover:bg-red-900/50 transition-all duration-300 animate-pulse-gentle" style={{animationDelay: '1.3s'}}>
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
