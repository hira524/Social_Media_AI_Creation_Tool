import {
  User as UserModel,
  GeneratedImage as GeneratedImageModel,
  type User,
  type UpsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
  type UpdateOnboarding,
} from "@shared/mongoSchema";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Custom Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Onboarding operations
  updateOnboarding(userId: string, data: UpdateOnboarding): Promise<User>;
  
  // Image generation operations
  createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage>;
  getUserImages(userId: string): Promise<GeneratedImage[]>;
  getImageById(id: string): Promise<GeneratedImage | undefined>;
  toggleImageFavorite(id: string, isFavorite: boolean): Promise<GeneratedImage>;
  
  // Credits operations
  decrementUserCredits(userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Custom Auth.

  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ id }).exec();
      return user || undefined;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { id: userData.id },
        userData,
        { upsert: true, new: true }
      ).exec();
      return user!;
    } catch (error) {
      console.error("Error upserting user:", error);
      throw error;
    }
  }

  // Onboarding operations
  async updateOnboarding(userId: string, data: UpdateOnboarding): Promise<User> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { id: userId },
        { 
          ...data,
          onboardingCompleted: true
        },
        { new: true }
      ).exec();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return user;
    } catch (error) {
      console.error("Error updating onboarding:", error);
      throw error;
    }
  }

  // Image generation operations
  async createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage> {
    try {
      const image = new GeneratedImageModel(imageData);
      await image.save();
      return image;
    } catch (error) {
      console.error("Error creating generated image:", error);
      throw error;
    }
  }

  async getUserImages(userId: string): Promise<GeneratedImage[]> {
    try {
      const images = await GeneratedImageModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();
      return images;
    } catch (error) {
      console.error("Error fetching user images:", error);
      throw error;
    }
  }

  async getImageById(id: string): Promise<GeneratedImage | undefined> {
    try {
      const image = await GeneratedImageModel.findById(id).exec();
      return image || undefined;
    } catch (error) {
      console.error("Error fetching image by ID:", error);
      return undefined;
    }
  }

  async toggleImageFavorite(id: string, isFavorite: boolean): Promise<GeneratedImage> {
    try {
      const image = await GeneratedImageModel.findByIdAndUpdate(
        id,
        { isFavorite },
        { new: true }
      ).exec();
      
      if (!image) {
        throw new Error("Image not found");
      }
      
      return image;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }

  // Credits operations
  async decrementUserCredits(userId: string): Promise<User> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { id: userId },
        { $inc: { creditsRemaining: -1 } },
        { new: true }
      ).exec();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return user;
    } catch (error) {
      console.error("Error decrementing credits:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
