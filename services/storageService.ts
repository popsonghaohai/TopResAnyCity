// This service acts as a wrapper around the browser's localStorage.
// In a mobile environment (Capacitor/Cordova/WebView), localStorage data 
// is stored in the app's isolated sandbox file system, making it persistent 
// and private to the application.

// Keys used in the app
export const STORAGE_KEYS = {
  GEMINI_KEY: 'gemini_api_key',
  PEXELS_KEY: 'pexels_api_key',
  PIXABAY_KEY: 'pixabay_api_key',
  FAVORITES: 'favorites',
};

// Simple obfuscation to prevent plain-text reading if someone accesses the file system.
// NOTE: For enterprise-grade security on mobile, consider swapping this 
// with Capacitor Secure Storage or React Native Keychain in the future.
const obfuscate = (text: string): string => {
  try {
    return btoa(text);
  } catch (e) {
    return text;
  }
};

const deobfuscate = (text: string): string => {
  try {
    return atob(text);
  } catch (e) {
    return text;
  }
};

export const storageService = {
  // Save Sensitive Data (Obfuscated)
  saveApiKey: (keyName: string, apiKey: string) => {
    if (!apiKey) {
      localStorage.removeItem(keyName);
      return;
    }
    localStorage.setItem(keyName, obfuscate(apiKey));
  },

  // Get Sensitive Data (De-obfuscated)
  getApiKey: (keyName: string): string => {
    const val = localStorage.getItem(keyName);
    return val ? deobfuscate(val) : '';
  },

  // Save Normal Data (JSON/Plain text)
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },

  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};