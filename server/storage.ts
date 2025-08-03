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
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Onboarding operations
  updateOnboarding(userId: string, data: UpdateOnboarding): Promise<User>;
  
  // Image generation operations
  createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage>;
  getUserImages(userId: string): Promise<GeneratedImage[]>;
  getImageById(id: string): Promise<GeneratedImage | undefined>;
  toggleImageFavorite(id: string, isFavorite: boolean): Promise<GeneratedImage>;
  deleteImage(id: string): Promise<void>;
  deleteAllUserImages(userId: string): Promise<void>;
  
  // Credits operations
  decrementUserCredits(userId: string): Promise<User>;
  
  // Profile operations
  updateUserProfile(userId: string, profileData: Partial<User>): Promise<User>;
  
  // Data export and account deletion
  exportUserData(userId: string): Promise<any>;
  deleteUser(userId: string): Promise<void>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email }).exec();
      return user || undefined;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
  }

  async createUser(userData: UpsertUser): Promise<User> {
    try {
      const user = new UserModel(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
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
  // Helper method to transform MongoDB document to our interface
  private transformImageDocument(doc: any): GeneratedImage {
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      ...obj,
      id: doc._id ? doc._id.toString() : obj._id?.toString() || obj.id
    } as unknown as GeneratedImage;
  }

  async createGeneratedImage(imageData: InsertGeneratedImage): Promise<GeneratedImage> {
    try {
      const image = new GeneratedImageModel(imageData);
      await image.save();
      return this.transformImageDocument(image);
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
      return images.map(image => this.transformImageDocument(image));
    } catch (error) {
      console.error("Error fetching user images:", error);
      throw error;
    }
  }

  async getImageById(id: string): Promise<GeneratedImage | undefined> {
    try {
      const image = await GeneratedImageModel.findById(id).exec();
      if (!image) return undefined;
      return this.transformImageDocument(image);
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
      
      return this.transformImageDocument(image);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      const result = await GeneratedImageModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new Error("Image not found");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  async deleteAllUserImages(userId: string): Promise<void> {
    try {
      await GeneratedImageModel.deleteMany({ userId }).exec();
    } catch (error) {
      console.error("Error deleting all user images:", error);
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

  // Profile operations
  async updateUserProfile(userId: string, profileData: Partial<User>): Promise<User> {
    try {
      const user = await UserModel.findOneAndUpdate(
        { id: userId },
        profileData,
        { new: true }
      ).exec();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return user;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Data export and account deletion
  async exportUserData(userId: string): Promise<any> {
    try {
      const user = await UserModel.findOne({ id: userId }).exec();
      const images = await GeneratedImageModel.find({ userId }).exec();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return {
        profile: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          niche: user.niche,
          contentType: user.contentType,
          stylePreference: user.stylePreference,
          creditsRemaining: user.creditsRemaining,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        images: images.map(img => ({
          id: img.id,
          prompt: img.prompt,
          enhancedPrompt: img.enhancedPrompt,
          platform: img.platform,
          style: img.style,
          dimensions: img.dimensions,
          isFavorite: img.isFavorite,
          createdAt: img.createdAt
        })),
        exportDate: new Date().toISOString(),
        totalImages: images.length,
        favoriteImages: images.filter(img => img.isFavorite).length
      };
    } catch (error) {
      console.error("Error exporting user data:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const result = await UserModel.findOneAndDelete({ id: userId }).exec();
      if (!result) {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
