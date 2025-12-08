import { GoogleGenAI } from "@google/genai";
import { Restaurant } from "../types";

const apiKey = process.env.API_KEY;

// Helper to clean Markdown JSON blocks if present
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if they exist
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

export const fetchTopRestaurants = async (city: string): Promise<Restaurant[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    I need you to act as a local food guide.
    1. Search for the top 5 most viral, famous, or highly-rated restaurants in "${city}" right now.
    2. Narrow this down to the top 3 best candidates based on popularity and recent positive feedback.
    3. For each of these 3 restaurants, perform a specific search to find:
       - Full address
       - Phone number
       - A Google Maps link (or a valid search link)
       - A publicly accessible URL of a high-quality photo of the restaurant's food or signature dish (e.g. from a review, article, or social media). 
       - A summary of recent network reviews (what people are saying)
       - A score from 1 to 10 based on user sentiment.
    
    Output strictly in valid JSON format (Array of objects). Do not add any conversational text outside the JSON.
    
    The JSON structure for each object must be:
    {
      "id": "unique_string",
      "name": "Restaurant Name",
      "cuisine": "Type of food (e.g. Italian, Fusion)",
      "address": "Full Address",
      "phoneNumber": "Phone Number or 'N/A'",
      "mapUrl": "URL to google maps",
      "imageUrl": "URL to an image of the food",
      "rating": number (1-10),
      "reviewSummary": "A concise summary of recent reviews (max 2 sentences).",
      "tags": ["tag1", "tag2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT supported when using googleSearch tool
        // so we must rely on the prompt to enforce JSON structure.
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    const cleanedJson = cleanJsonOutput(text);
    const data: Restaurant[] = JSON.parse(cleanedJson);

    return data;

  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};