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
  Trash2
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
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Profile Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm font-medium">Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger className="text-sm">
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
            
            <div className="space-y-2">
              <Label htmlFor="contentType" className="text-sm font-medium">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="text-sm">
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
            
            <div className="space-y-2">
              <Label htmlFor="stylePreference" className="text-sm font-medium">Style Preference</Label>
              <Select value={stylePreference} onValueChange={setStylePreference}>
                <SelectTrigger className="text-sm">
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

          <div className="pt-4">
            <Button 
              onClick={handleSaveChanges}
              disabled={saveProfileMutation.isPending}
              className="bg-gradient-to-r from-primary to-secondary text-white text-sm"
            >
              {saveProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Account & Usage */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Account & Usage</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800/80 rounded-xl">
              <div className="text-2xl font-bold text-primary">{user?.creditsRemaining || 0}</div>
              <div className="text-xs text-gray-400">Credits Remaining</div>
            </div>
            <div className="text-center p-4 bg-slate-50/80 rounded-xl">
              <div className="text-2xl font-bold text-secondary">{user?.creditsUsed || 0}</div>
              <div className="text-xs text-slate-600">Credits Used</div>
            </div>
            <div className="text-center p-4 bg-slate-50/80 rounded-xl">
              <div className="text-2xl font-bold text-slate-700">{user?.totalGenerations || 0}</div>
              <div className="text-xs text-slate-600">Total Images</div>
            </div>
            <div className="text-center p-4 bg-slate-50/80 rounded-xl">
              <div className="text-2xl font-bold text-red-500">{user?.favoriteCount || 0}</div>
              <div className="text-xs text-slate-600">Favorites</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">Upgrade to Pro</h4>
            <p className="text-slate-600 text-xs mb-3">Get unlimited generations and premium features</p>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-xs text-gray-400">Receive updates about your account and generations</p>
            </div>
            <Switch 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Browser Notifications</Label>
              <p className="text-xs text-slate-600">Get notified when your images are ready</p>
            </div>
            <Switch 
              checked={browserNotifications} 
              onCheckedChange={setBrowserNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Marketing Emails</Label>
              <p className="text-xs text-slate-600">Receive tips, updates, and promotional offers</p>
            </div>
            <Switch 
              checked={marketingEmails} 
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-red-800/60 shadow-sm rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-red-900/30 rounded-xl border border-red-800/50">
            <h4 className="font-semibold text-red-400 mb-2 text-sm">Delete Account</h4>
            <p className="text-red-300 text-xs mb-3">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              className="text-xs"
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
