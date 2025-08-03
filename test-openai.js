import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

async function testOpenAI() {
  try {
    console.log("Testing OpenAI API...");
    console.log("API Key configured:", !!process.env.OPENAI_API_KEY);
    console.log("API Key starts with:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...");
    
    // Test with a simple image generation
    console.log("Attempting to generate image...");
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple red circle on white background",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    
    console.log("SUCCESS: Image generated!");
    console.log("Image URL:", response.data[0]?.url);
    
  } catch (error) {
    console.error("ERROR testing OpenAI:");
    console.error("Error message:", error.message);
    console.error("Error details:", error);
  }
}

testOpenAI();
