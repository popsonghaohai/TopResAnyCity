import { GoogleGenAI } from "@google/genai";
import { Restaurant, LanguageCode, CitySearchResult } from "../types";

const apiKey = process.env.API_KEY;

// --- Helper Functions ---

// Fetch image from free stock API providers (Pexels, Pixabay)
const fetchCityImageFromMultipleSources = async (city: string): Promise<string | null> => {
  // 1. Pexels API
  try {
    const pexelsApiKey = "EkRP5XY6lMJfnxU44vLqwTjcMLNmc4Kl1axhrua0bwydvp7on7s3boTi";
    if (pexelsApiKey) {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(city + ' city')}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': pexelsApiKey
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          return data.photos[0].src.large;
        }
      }
    }
  } catch (error) {
    console.warn('Pexels fetch failed, trying next source', error);
  }

  // 2. Pixabay API
  try {
    const pixabayApiKey = "53633877-8e9403988935b9b04a4fdc7b7";
    if (pixabayApiKey) {
      const response = await fetch(
        `https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(city)}&image_type=photo&orientation=horizontal&per_page=3`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          return data.hits[0].largeImageURL;
        }
      }
    }
  } catch (error) {
    console.warn('Pixabay fetch failed', error);
  }

  return null;
};

// Helper to clean Markdown JSON blocks and handle common LLM JSON errors
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();

  // 1. Robustly extract the JSON object by finding the first '{' and last '}'
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

  // 1. Start fetching image from APIs immediately (Parallel execution)
  const apiImagePromise = fetchCityImageFromMultipleSources(city);

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguage = getLanguageName(language);

  // We keep the prompt searching for an image as a FALLBACK in case APIs fail or keys are missing.
  const prompt = `
    I need you to act as a web browsing assistant and local guide.

    TASK 1: FIND HIGH-QUALITY CITY IMAGE (Fallback)
    1.  Perform a targeted Google Search for a high-resolution, landscape-oriented photograph of "${city}".
    2.  You MUST strictly search within these specific free stock image domains using a query like: 
        "${city} city landmark landscape wallpaper site:unsplash.com OR site:pexels.com OR site:pixabay.com OR site:commons.wikimedia.org"
    3.  Select the best image URL based on this priority order:
        - Priority 1: Unsplash (Direct CDN links preferred)
        - Priority 2: Pexels
        - Priority 3: Pixabay
        - Priority 4: Wikimedia Commons
    4.  EXTRACT THE DIRECT IMAGE FILE URL (ending in .jpg, .png, etc.).
    5.  If absolutely no valid URL is found, return an empty string "".

    TASK 2: SEARCH TOP RESTAURANTS
    1. Search for the top 5 most viral, famous, or highly-rated restaurants in "${city}" right now.
    2. Narrow this down to the top 3 best candidates based on popularity and recent positive feedback.
    3. For each of these 3 restaurants, perform a specific search to find its details (address, phone, rating, reviews).

    LANGUAGE INSTRUCTION:
    - The content of the response MUST be in ${targetLanguage}.
    - Translate the 'name' (if appropriate), 'cuisine', 'address', 'reviewSummary', and 'tags' into ${targetLanguage}.
    - IMPORTANT: Keep the JSON KEYS in English (e.g., use "name", not "名称"). Only translate the VALUES.

    OUTPUT FORMAT:
    Output strictly in valid JSON format. Return a SINGLE JSON OBJECT.
    
    Structure:
    {
      "cityImageUrl": "THE_EXTRACTED_DIRECT_IMAGE_URL",
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
        }
      ]
    }
  `;

  try {
    // 2. Start Gemini Request
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // 3. Await both API Image and Gemini Data
    // We use Promise.allSettled or just await them sequentially but initiate them early to save time.
    // Here we await response to ensure we have data.
    const response = await geminiPromise;

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    const cleanedJson = cleanJsonOutput(text);
    
    let data: CitySearchResult;
    try {
        data = JSON.parse(cleanedJson);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw Text:", text);
        throw new Error("Failed to parse data. Please try again.");
    }

    // 4. Resolve the API Image Promise
    const apiImage = await apiImagePromise;

    // 5. Override Gemini's image if API found one (API is usually higher quality/more reliable)
    if (apiImage) {
        console.log("Using API Image:", apiImage);
        data.cityImageUrl = apiImage;
    }

    // Basic validation
    if (!data.restaurants || !Array.isArray(data.restaurants)) {
        throw new Error("Invalid JSON structure: restaurants array missing");
    }

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};