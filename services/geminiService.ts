import { GoogleGenAI } from "@google/genai";
import { Restaurant, LanguageCode, CitySearchResult } from "../types";

const apiKey = process.env.API_KEY;

// --- Helper Functions ---

// Generic function to fetch images from free stock API providers
const fetchImageFromApis = async (query: string, orientation: 'landscape' | 'portrait' | 'square' = 'landscape'): Promise<string | null> => {
  // 1. Pexels API
  try {
    // Try localStorage first (user setting), then hardcoded fallback for demo
    const userKey = localStorage.getItem('pexels_api_key');
    const pexelsApiKey = userKey || "";
    
    if (pexelsApiKey) {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`,
        {
          headers: {
            'Authorization': pexelsApiKey
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          // Prefer 'large' or 'medium' based on usage to save bandwidth, but 'large' is good for quality
          return data.photos[0].src.large; 
        }
      }
    }
  } catch (error) {
    console.warn(`Pexels fetch failed for ${query}`, error);
  }

  // 2. Pixabay API
  try {
    const userKey = localStorage.getItem('pixabay_api_key');
    const pixabayApiKey = userKey || "";
    
    if (pixabayApiKey) {
      const response = await fetch(
        `https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=3`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          return data.hits[0].largeImageURL;
        }
      }
    }
  } catch (error) {
    console.warn(`Pixabay fetch failed for ${query}`, error);
  }

  // 3. Wikimedia Commons (Fallback)
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=1&format=json&origin=*`
    );
    const data = await response.json();
    if (data.query && data.query.search && data.query.search.length > 0) {
      const filename = data.query.search[0].title;
      const imageResponse = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`
      );
      const imageData = await imageResponse.json();
      const pages = imageData.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].imageinfo && pages[pageId].imageinfo[0]) {
        return pages[pageId].imageinfo[0].url;
      }
    }
  } catch (error) {
    console.log(`Wikimedia fetch failed for ${query}`);
  }

  return null;
};

// Helper to clean Markdown JSON blocks
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();
  const startIndex = cleaned.indexOf('{');
  const endIndex = cleaned.lastIndexOf('}');
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    cleaned = cleaned.substring(startIndex, endIndex + 1);
  } else if (cleaned.startsWith('```')) {
     cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }
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

  // 1. Start fetching CITY image (Parallel execution)
  const apiCityImagePromise = fetchImageFromApis(`${city} city landmark`, 'landscape');

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguage = getLanguageName(language);

  const prompt = `
    I need you to act as a web browsing assistant and local guide.

    TASK: SEARCH TOP RESTAURANTS in "${city}"
    1. Search for the top 5 most viral, famous, or highly-rated restaurants in "${city}" right now.
    2. Narrow this down to the top 3 best candidates based on popularity.
    3. For each of these 3 restaurants, perform a specific search to find its details (address, phone, rating, reviews, website).

    LANGUAGE INSTRUCTION:
    - The content of the response MUST be in ${targetLanguage}.
    - Translate the 'name' (if appropriate), 'cuisine', 'address', 'reviewSummary', and 'tags' into ${targetLanguage}.
    - IMPORTANT: Keep the JSON KEYS in English (e.g., use "name", not "名称"). Only translate the VALUES.

    OUTPUT FORMAT:
    Output strictly in valid JSON format. Return a SINGLE JSON OBJECT.
    
    Structure:
    {
      "cityImageUrl": "",
      "restaurants": [
        {
          "id": "unique_string",
          "name": "Restaurant Name (in ${targetLanguage})",
          "cuisine": "Type of food (in ${targetLanguage})",
          "address": "Full Address (in ${targetLanguage})",
          "phoneNumber": "Phone Number or 'N/A'",
          "mapUrl": "URL to google maps",
          "websiteUrl": "Official website URL or null if not found",
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

    // 3. Wait for Gemini to finish text generation
    const response = await geminiPromise;
    const text = response.text;
    if (!text) throw new Error("No content generated");

    const cleanedJson = cleanJsonOutput(text);
    
    let data: CitySearchResult;
    try {
        data = JSON.parse(cleanedJson);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse data.");
    }

    // 4. Resolve City Image
    const cityApiImage = await apiCityImagePromise;
    if (cityApiImage) {
        data.cityImageUrl = cityApiImage;
    }

    // 5. Fetch Restaurant Images in Parallel
    if (data.restaurants && Array.isArray(data.restaurants)) {
        const restaurantImagePromises = data.restaurants.map(async (restaurant) => {
            // Construct a query: Name + Cuisine + "food" to get relevant pics
            // We append "food" or "interior" to guide the stock photo search
            const query = `${restaurant.name} ${restaurant.cuisine} food restaurant`;
            const imageUrl = await fetchImageFromApis(query, 'landscape');
            
            // Return a new object with the image URL
            return {
                ...restaurant,
                imageUrl: imageUrl || undefined 
            };
        });

        // Wait for all restaurant images to load
        const updatedRestaurants = await Promise.all(restaurantImagePromises);
        data.restaurants = updatedRestaurants;
    }

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};