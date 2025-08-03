import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./customAuth";
import { generateImage } from "./openai";
import { z } from "zod";

// Validation schemas
const generateImageRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  platform: z.enum(["instagram", "linkedin", "twitter"]),
  style: z.string().optional(),
});

const updateOnboardingSchema = z.object({
  // Basic info (Step 1)
  niche: z.string().min(1, "Niche is required"),
  contentType: z.string().min(1, "Content type is required"),
  stylePreference: z.string().min(1, "Style preference is required"),
  
  // Business info (Step 2)
  businessType: z.string().min(1, "Business type is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  audienceAge: z.string().optional(),
  
  // Content goals (Step 3)
  primaryGoal: z.string().min(1, "Primary goal is required"),
  postingFrequency: z.string().min(1, "Posting frequency is required"),
  contentThemes: z.array(z.string()).optional().default([]),
  
  // Brand personality (Step 4)
  brandPersonality: z.string().min(1, "Brand personality is required"),
  colorPreferences: z.array(z.string()).min(1, "At least one color preference is required"),
  brandKeywords: z.string().optional(),
  
  // Platform strategy (Step 5)
  primaryPlatforms: z.array(z.string()).min(1, "At least one platform is required"),
  contentFormats: z.array(z.string()).min(1, "At least one content format is required"),
  specialRequirements: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint (no auth required)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      console.log("Auth check - Session ID:", req.sessionID);
      console.log("Auth check - User:", req.user);
      console.log("Auth check - Authenticated:", req.isAuthenticated());
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Onboarding routes
  app.post('/api/onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateOnboardingSchema.parse(req.body);
      
      const user = await storage.updateOnboarding(userId, validatedData);
      res.json(user);
    } catch (error) {
      console.error("Error updating onboarding:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid onboarding data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update onboarding" });
      }
    }
  });

  // Image generation routes
  app.post('/api/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if ((user.creditsRemaining || 0) <= 0) {
        return res.status(402).json({ message: "No credits remaining" });
      }

      const { prompt, platform, style } = generateImageRequestSchema.parse(req.body);
      
      // Enhance prompt based on user's comprehensive onboarding data
      let enhancedPrompt = prompt;
      
      // Basic preferences
      if (user.niche) {
        enhancedPrompt += ` in ${user.niche} niche`;
      }
      if (user.stylePreference) {
        enhancedPrompt += ` with ${user.stylePreference} style`;
      }
      if (user.contentType) {
        enhancedPrompt += ` for ${user.contentType} content`;
      }
      
      // Business context
      if (user.businessType) {
        enhancedPrompt += ` targeting ${user.businessType} audience`;
      }
      if (user.targetAudience) {
        enhancedPrompt += `, specifically for ${user.targetAudience}`;
      }
      if (user.audienceAge) {
        enhancedPrompt += ` aged ${user.audienceAge}`;
      }
      
      // Content goals
      if (user.primaryGoal) {
        enhancedPrompt += ` designed to achieve ${user.primaryGoal}`;
      }
      
      // Brand personality
      if (user.brandPersonality) {
        enhancedPrompt += ` with ${user.brandPersonality} brand personality`;
      }
      if (user.colorPreferences && user.colorPreferences.length > 0) {
        enhancedPrompt += ` using colors: ${user.colorPreferences.join(', ')}`;
      }
      if (user.brandKeywords) {
        enhancedPrompt += ` incorporating brand keywords: ${user.brandKeywords}`;
      }
      
      // Platform optimization
      if (user.primaryPlatforms && user.primaryPlatforms.includes(platform)) {
        enhancedPrompt += ` optimized for ${platform}`;
      }
      
      // Special requirements
      if (user.specialRequirements) {
        enhancedPrompt += ` with special requirements: ${user.specialRequirements}`;
      }
      
      // Add platform-specific dimensions
      const dimensions = {
        instagram: "1080x1080",
        linkedin: "1200x627",
        twitter: "1200x675"
      };
      
      enhancedPrompt += `. Social media post format, ${dimensions[platform]} aspect ratio, professional design, high quality`;

      // Generate image using OpenAI
      const imageResult = await generateImage(enhancedPrompt);
      
      // Save to database
      const imageData = {
        userId,
        prompt,
        enhancedPrompt,
        imageUrl: imageResult.url,
        platform,
        style: style || user.stylePreference || "",
        dimensions: dimensions[platform],
      };
      
      const savedImage = await storage.createGeneratedImage(imageData);
      
      // Decrement user credits
      await storage.decrementUserCredits(userId);
      
      res.json(savedImage);
    } catch (error) {
      console.error("Error generating image:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid generation request", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to generate image" });
      }
    }
  });

  // Image history routes
  app.get('/api/images', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const images = await storage.getUserImages(userId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  app.get('/api/images/:id', isAuthenticated, async (req: any, res) => {
    try {
      const imageId = req.params.id; // MongoDB uses string IDs
      const image = await storage.getImageById(imageId);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      // Verify ownership
      const userId = req.user.claims.sub;
      if (image.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });

  app.patch('/api/images/:id/favorite', isAuthenticated, async (req: any, res) => {
    try {
      const imageId = req.params.id; // MongoDB uses string IDs
      const { isFavorite } = req.body;
      
      const image = await storage.getImageById(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      // Verify ownership
      const userId = req.user.claims.sub;
      if (image.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedImage = await storage.toggleImageFavorite(imageId, isFavorite);
      res.json(updatedImage);
    } catch (error) {
      console.error("Error updating favorite:", error);
      res.status(500).json({ message: "Failed to update favorite" });
    }
  });

  // Delete image endpoint
  app.delete('/api/images/:id', isAuthenticated, async (req: any, res) => {
    try {
      const imageId = req.params.id;
      const image = await storage.getImageById(imageId);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      // Verify ownership
      const userId = req.user.claims.sub;
      if (image.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteImage(imageId);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // User profile update endpoint
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, email, niche, contentType, stylePreference } = req.body;
      
      // Validation
      const profileData: any = {};
      if (firstName !== undefined) profileData.firstName = firstName;
      if (lastName !== undefined) profileData.lastName = lastName;
      if (email !== undefined) profileData.email = email;
      if (niche !== undefined) profileData.niche = niche;
      if (contentType !== undefined) profileData.contentType = contentType;
      if (stylePreference !== undefined) profileData.stylePreference = stylePreference;
      
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Export user data endpoint
  app.get('/api/user/export', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userData = await storage.exportUserData(userId);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-export-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(userData);
    } catch (error) {
      console.error("Error exporting user data:", error);
      res.status(500).json({ message: "Failed to export user data" });
    }
  });

  // Delete account endpoint
  app.delete('/api/user/account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Delete all user images first
      await storage.deleteAllUserImages(userId);
      
      // Delete user account
      await storage.deleteUser(userId);
      
      // Clear session
      req.logout(() => {
        res.json({ message: "Account deleted successfully" });
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
