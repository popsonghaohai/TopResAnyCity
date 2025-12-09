import { GoogleGenAI } from "@google/genai";
import { Restaurant, LanguageCode, CitySearchResult } from "../types";

const apiKey = process.env.API_KEY;

// Helper to clean Markdown JSON blocks and handle common LLM JSON errors
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();

  // 1. Robustly extract the JSON object by finding the first '{' and last '}'
  // Note: We are now expecting an Object, not an Array
  const startIndex = cleaned.indexOf('{');
  const endIndex = cleaned.lastIndexOf('}');

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    cleaned = cleaned.substring(startIndex, endIndex + 1);
  } else {
    // Fallback: simple markdown stripping
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
  }

  // 2. Fix "Bad control character in string literal" error
  cleaned = cleaned.replace(/[\x00-\x1F]+/g, ' ');

  return cleaned;
};

const getLanguageName = (code: LanguageCode): string => {
  switch (code) {
    case 'zh': return 'Simplified Chinese (简体中文)';
    case 'fr': return 'French';
    case 'es': return 'Spanish';
    case 'ja': return 'Japanese';
    case 'en': default: return 'English';
  }
};

export const fetchTopRestaurants = async (city: string, language: LanguageCode = 'en'): Promise<CitySearchResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguage = getLanguageName(language);

  const prompt = `
    I need you to act as a local food guide and travel scout.

    TASK 1: CITY IMAGE
    - Search for a REAL, high-quality, landscape photograph of "${city}".
    - DO NOT generate an AI image. Use the Google Search tool to find a real URL.
    - Look for reliable sources like Wikimedia Commons, Flickr, Unsplash, or reputable travel blogs.
    - The URL MUST end in .jpg, .jpeg, .png, or .webp.
    - It should be a wide shot (landscape aspect ratio) suitable for a header banner.
    - If you strictly cannot find a direct link, leave it as an empty string "".

    TASK 2: RESTAURANTS
    1. Search for the top 5 most viral, famous, or highly-rated restaurants in "${city}" right now.
    2. Narrow this down to the top 3 best candidates based on popularity and recent positive feedback.
    3. For each of these 3 restaurants, perform a specific search to find its details (address, phone, rating, reviews).

    LANGUAGE INSTRUCTION:
    - The content of the response MUST be in ${targetLanguage}.
    - Translate the 'name' (if appropriate), 'cuisine', 'address', 'reviewSummary', and 'tags' into ${targetLanguage}.
    - IMPORTANT: Keep the JSON KEYS in English (e.g., use "name", not "名称"). Only translate the VALUES.

    OUTPUT FORMAT:
    Output strictly in valid JSON format. Return a SINGLE JSON OBJECT (not an array).
    
    Structure:
    {
      "cityImageUrl": "URL_FROM_TASK_1",
      "restaurants": [
        {
          "id": "unique_string",
          "name": "Restaurant Name (in ${targetLanguage})",
          "cuisine": "Type of food (in ${targetLanguage})",
          "address": "Full Address (in ${targetLanguage})",
          "phoneNumber": "Phone Number or 'N/A'",
          "mapUrl": "URL to google maps",
          "rating": number (1-10),
          "reviewSummary": "A concise summary (in ${targetLanguage}, max 2 sentences).",
          "tags": ["tag1", "tag2"]
        },
        ... (2 more restaurants)
      ]
    }

    IMPORTANT: 
    - DO NOT include any conversational text, introductions, or markdown formatting.
    - ENSURE ALL STRINGS ARE PROPERLY ESCAPED.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    const cleanedJson = cleanJsonOutput(text);
    
    try {
        const data: CitySearchResult = JSON.parse(cleanedJson);
        // Basic validation
        if (!data.restaurants || !Array.isArray(data.restaurants)) {
            throw new Error("Invalid JSON structure: restaurants array missing");
        }
        return data;
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw Text:", text);
        console.error("Cleaned Text:", cleanedJson);
        throw new Error("Failed to parse data. Please try again.");
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};