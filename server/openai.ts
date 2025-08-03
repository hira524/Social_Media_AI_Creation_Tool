import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// Image generation function
export async function generateImage(prompt: string): Promise<{ url: string }> {
  try {
    console.log("OpenAI: Starting image generation with prompt:", prompt);
    console.log("OpenAI: API Key configured:", !!process.env.OPENAI_API_KEY);
    
    // Check if we should use mock mode due to billing issues
    const useMockMode = process.env.OPENAI_MOCK_MODE === 'true' || false;
    
    if (useMockMode) {
      console.log("OpenAI: Using mock mode - generating placeholder image");
      // Return a placeholder image service URL
      const placeholderUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`;
      console.log("OpenAI: Mock image URL generated:", placeholderUrl);
      return { url: placeholderUrl };
    }
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    console.log("OpenAI: Response received:", JSON.stringify(response, null, 2));

    if (!response.data?.[0]?.url) {
      console.error("OpenAI: No image URL in response");
      throw new Error("No image URL returned from OpenAI");
    }

    console.log("OpenAI: Image URL generated:", response.data[0].url);
    return { url: response.data[0].url };
  } catch (error) {
    console.error("OpenAI image generation error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error: error
    });
    
    // If billing limit reached, use placeholder image
    if (error instanceof Error && error.message.includes('billing_hard_limit_reached')) {
      console.log("OpenAI: Billing limit reached, using placeholder image");
      const placeholderUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`;
      console.log("OpenAI: Fallback image URL:", placeholderUrl);
      return { url: placeholderUrl };
    }
    
    throw new Error("Failed to generate image: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}

// Optional: Text enhancement function for prompts
export async function enhancePrompt(prompt: string, niche?: string, style?: string): Promise<string> {
  try {
    const systemPrompt = `You are an expert at creating detailed prompts for AI image generation specifically for social media posts. 
    Enhance the given prompt to be more detailed and specific for professional social media content generation.
    ${niche ? `The content is for the ${niche} niche.` : ''}
    ${style ? `The style should be ${style}.` : ''}
    Return only the enhanced prompt, no additional text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || prompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return prompt; // Fallback to original prompt
  }
}
