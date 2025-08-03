import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Custom Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Custom Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Basic onboarding data
  niche: varchar("niche"),
  contentType: varchar("content_type"),
  stylePreference: varchar("style_preference"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  
  // Business information
  businessType: varchar("business_type"),
  targetAudience: varchar("target_audience"),
  audienceAge: varchar("audience_age"),
  
  // Content goals
  primaryGoal: varchar("primary_goal"),
  postingFrequency: varchar("posting_frequency"),
  contentThemes: jsonb("content_themes"), // array of strings
  
  // Brand personality
  brandPersonality: varchar("brand_personality"),
  colorPreferences: jsonb("color_preferences"), // array of strings
  brandKeywords: text("brand_keywords"),
  
  // Platform strategy
  primaryPlatforms: jsonb("primary_platforms"), // array of strings
  contentFormats: jsonb("content_formats"), // array of strings
  specialRequirements: text("special_requirements"),
  
  // Credits system
  creditsRemaining: integer("credits_remaining").default(5),
});

export const generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  prompt: text("prompt").notNull(),
  enhancedPrompt: text("enhanced_prompt"),
  imageUrl: text("image_url").notNull(),
  platform: varchar("platform").notNull(), // instagram, linkedin, twitter
  style: varchar("style"),
  dimensions: varchar("dimensions"),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  generatedImages: many(generatedImages),
}));

export const generatedImagesRelations = relations(generatedImages, ({ one }) => ({
  user: one(users, {
    fields: [generatedImages.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).omit({
  id: true,
  createdAt: true,
});

export const updateOnboardingSchema = z.object({
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

export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type UpdateOnboarding = z.infer<typeof updateOnboardingSchema>;
