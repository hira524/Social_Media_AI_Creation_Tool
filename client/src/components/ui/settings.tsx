import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [niche, setNiche] = useState(user?.niche || "");
  const [contentType, setContentType] = useState(user?.contentType || "");
  const [stylePreference, setStylePreference] = useState(user?.stylePreference || "");
  
  // Notification preferences (you can expand this based on your needs)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      await apiRequest("PATCH", "/api/user/profile", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
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
      niche,
      contentType,
      stylePreference,
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
    stylePreference !== (user?.stylePreference || "");

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
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="health">Health & Fitness</SelectItem>
                  <SelectItem value="food">Food & Cooking</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                  <SelectItem value="posts">Social Media Posts</SelectItem>
                  <SelectItem value="ads">Advertisements</SelectItem>
                  <SelectItem value="stories">Stories</SelectItem>
                  <SelectItem value="banners">Banners</SelectItem>
                  <SelectItem value="thumbnails">Thumbnails</SelectItem>
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
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                </SelectContent>
              </Select>
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
