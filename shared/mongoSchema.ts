import mongoose, { Schema, Document } from 'mongoose';

// Session schema for express-session
export interface ISession extends Document {
  sid: string;
  sess: any;
  expire: Date;
}

const sessionSchema = new Schema<ISession>({
  sid: { type: String, required: true, unique: true },
  sess: { type: Schema.Types.Mixed, required: true },
  expire: { type: Date, required: true }
});

// Index for session expiration
sessionSchema.index({ expire: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);

// User schema
export interface IUser extends Document {
  id: string;
  email?: string;
  password?: string; // Added password field
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  onboardingCompleted?: boolean;
  
  // Basic onboarding data
  niche?: string;
  contentType?: string;
  stylePreference?: string;
  
  // Business information
  businessType?: string;
  targetAudience?: string;
  audienceAge?: string;
  
  // Content goals
  primaryGoal?: string;
  postingFrequency?: string;
  contentThemes?: string[];
  
  // Brand personality
  brandPersonality?: string;
  colorPreferences?: string[];
  brandKeywords?: string;
  
  // Platform strategy
  primaryPlatforms?: string[];
  contentFormats?: string[];
  specialRequirements?: string;
  
  creditsRemaining?: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: String, // Added password field
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  onboardingCompleted: { type: Boolean, default: false },
  
  // Basic onboarding data
  niche: String,
  contentType: String,
  stylePreference: String,
  
  // Business information
  businessType: String,
  targetAudience: String,
  audienceAge: String,
  
  // Content goals
  primaryGoal: String,
  postingFrequency: String,
  contentThemes: [String],
  
  // Brand personality
  brandPersonality: String,
  colorPreferences: [String],
  brandKeywords: String,
  
  // Platform strategy
  primaryPlatforms: [String],
  contentFormats: [String],
  specialRequirements: String,
  
  creditsRemaining: { type: Number, default: 5 }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);

// Generated Image schema
export interface IGeneratedImage extends Document {
  id: string;
  userId: string;
  prompt: string;
  enhancedPrompt: string;
  imageUrl: string;
  platform: 'instagram' | 'linkedin' | 'twitter';
  style: string;
  dimensions: string;
  isFavorite?: boolean;
  createdAt: Date;
}

const generatedImageSchema = new Schema<IGeneratedImage>({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  enhancedPrompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  platform: { 
    type: String, 
    required: true,
    enum: ['instagram', 'linkedin', 'twitter']
  },
  style: { type: String, required: true },
  dimensions: { type: String, required: true },
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for user queries
generatedImageSchema.index({ userId: 1, createdAt: -1 });

export const GeneratedImage = mongoose.model<IGeneratedImage>('GeneratedImage', generatedImageSchema);

// Export types for compatibility
export type User = IUser;
export type GeneratedImage = IGeneratedImage;

// Types for inserts (without auto-generated fields)
export interface UpsertUser {
  id: string;
  email?: string;
  password?: string; // Added password field
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  onboardingCompleted?: boolean;
  
  // Basic onboarding data
  niche?: string;
  contentType?: string;
  stylePreference?: string;
  
  // Business information
  businessType?: string;
  targetAudience?: string;
  audienceAge?: string;
  
  // Content goals
  primaryGoal?: string;
  postingFrequency?: string;
  contentThemes?: string[];
  
  // Brand personality
  brandPersonality?: string;
  colorPreferences?: string[];
  brandKeywords?: string;
  
  // Platform strategy
  primaryPlatforms?: string[];
  contentFormats?: string[];
  specialRequirements?: string;
  
  creditsRemaining?: number;
}

export interface InsertGeneratedImage {
  userId: string;
  prompt: string;
  enhancedPrompt: string;
  imageUrl: string;
  platform: 'instagram' | 'linkedin' | 'twitter';
  style: string;
  dimensions: string;
  isFavorite?: boolean;
}

export interface UpdateOnboarding {
  // Basic info (Step 1)
  niche: string;
  contentType: string;
  stylePreference: string;
  
  // Business info (Step 2)
  businessType: string;
  targetAudience: string;
  audienceAge?: string;
  
  // Content goals (Step 3)
  primaryGoal: string;
  postingFrequency: string;
  contentThemes?: string[];
  
  // Brand personality (Step 4)
  brandPersonality: string;
  colorPreferences: string[];
  brandKeywords?: string;
  
  // Platform strategy (Step 5)
  primaryPlatforms: string[];
  contentFormats: string[];
  specialRequirements?: string;
}
