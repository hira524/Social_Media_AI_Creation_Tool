import {
  users,
  generatedImages,
  type User,
  type UpsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
  type UpdateOnboarding,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Onboarding operations
  updateOnboarding(userId: string, data: UpdateOnboarding): Promise<User>;
  
  // Image generation operations
  createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage>;
  getUserImages(userId: string): Promise<GeneratedImage[]>;
  getImageById(id: number): Promise<GeneratedImage | undefined>;
  toggleImageFavorite(id: number, isFavorite: boolean): Promise<GeneratedImage>;
  
  // Credits operations
  decrementUserCredits(userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Onboarding operations
  async updateOnboarding(userId: string, data: UpdateOnboarding): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Image generation operations
  async createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage> {
    const [image] = await db
      .insert(generatedImages)
      .values(imageData)
      .returning();
    return image;
  }

  async getUserImages(userId: string): Promise<GeneratedImage[]> {
    return await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.userId, userId))
      .orderBy(desc(generatedImages.createdAt));
  }

  async getImageById(id: number): Promise<GeneratedImage | undefined> {
    const [image] = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.id, id));
    return image;
  }

  async toggleImageFavorite(id: number, isFavorite: boolean): Promise<GeneratedImage> {
    const [image] = await db
      .update(generatedImages)
      .set({ isFavorite })
      .where(eq(generatedImages.id, id))
      .returning();
    return image;
  }

  // Credits operations
  async decrementUserCredits(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        creditsRemaining: sql`${users.creditsRemaining} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
