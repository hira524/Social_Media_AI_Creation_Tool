import { z } from "zod";

// Validation schema for user signup
export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validation schema for user login
export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// Validation schema for onboarding updates
export const updateOnboardingSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  contentType: z.string().min(1, "Content type is required"),
  stylePreference: z.string().min(1, "Style preference is required"),
});

// Validation schema for image generation
export const generateImageRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  platform: z.enum(["instagram", "linkedin", "twitter"]),
  style: z.string().optional(),
});

// Validation schema for creating a generated image record
export const insertGeneratedImageSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  prompt: z.string().min(1, "Prompt is required"),
  enhancedPrompt: z.string().min(1, "Enhanced prompt is required"),
  imageUrl: z.string().url("Valid image URL is required"),
  platform: z.enum(["instagram", "linkedin", "twitter"]),
  style: z.string().min(1, "Style is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  isFavorite: z.boolean().optional().default(false),
});

export type SignupRequest = z.infer<typeof signupSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type UpdateOnboarding = z.infer<typeof updateOnboardingSchema>;
export type GenerateImageRequest = z.infer<typeof generateImageRequestSchema>;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
