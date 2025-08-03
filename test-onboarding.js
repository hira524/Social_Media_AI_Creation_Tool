// Test script to verify onboarding data flow
const testOnboardingData = {
  // Basic info (Step 1)
  niche: "tech",
  contentType: "educational",
  stylePreference: "professional",
  
  // Business info (Step 2)
  businessType: "startup",
  targetAudience: "b2b",
  audienceAge: "25-35",
  
  // Content goals (Step 3)
  primaryGoal: "brand-awareness",
  postingFrequency: "daily",
  contentThemes: ["tips-tricks", "industry-news"],
  
  // Brand personality (Step 4)
  brandPersonality: "innovative",
  colorPreferences: ["blue", "white"],
  brandKeywords: "tech, innovation, future",
  
  // Platform strategy (Step 5)
  primaryPlatforms: ["linkedin", "twitter"],
  contentFormats: ["single-image", "infographics"],
  specialRequirements: "Always include company logo"
};

console.log("Test onboarding data:");
console.log(JSON.stringify(testOnboardingData, null, 2));

console.log("\nField count:", Object.keys(testOnboardingData).length);
console.log("Required fields present:", {
  niche: !!testOnboardingData.niche,
  businessType: !!testOnboardingData.businessType,
  primaryGoal: !!testOnboardingData.primaryGoal,
  brandPersonality: !!testOnboardingData.brandPersonality
});
