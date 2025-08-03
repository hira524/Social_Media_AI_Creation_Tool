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
  niche: z.string(),
  contentType: z.string(),
  stylePreference: z.string(),
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
      
      // Enhance prompt based on user's onboarding data
      let enhancedPrompt = prompt;
      if (user.niche) {
        enhancedPrompt += ` in ${user.niche} niche`;
      }
      if (user.stylePreference) {
        enhancedPrompt += ` with ${user.stylePreference} style`;
      }
      if (user.contentType) {
        enhancedPrompt += ` for ${user.contentType} content`;
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

  const httpServer = createServer(app);
  return httpServer;
}
