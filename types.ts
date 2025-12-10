export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  address: string;
  phoneNumber: string;
  mapUrl: string; // Google Maps link
  websiteUrl?: string; // Optional Official Website link
  imageUrl?: string; // Optional URL for food/restaurant image
  rating: number; // 1-10 scale
  reviewSummary: string;
  tags: string[];
}

export interface CitySearchResult {
  cityImageUrl: string;
  restaurants: Restaurant[];
}

export interface SearchResult {
  city: string;
  restaurants: Restaurant[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type ThemeId = 'modern' | 'spring' | 'ice';
export type LanguageCode = 'en' | 'zh' | 'fr' | 'es' | 'ja';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  font: string; // Tailwind font class
  bg: string; // Main background
  text: string; // Main text color
  cardBg: string; // Card background
  accent: string; // Primary accent color (for icons/highlights)
  button: string; // Primary button style
  buttonText: string;
  border: string; // Border color
  highlight: string; // Soft highlight background
  gradient: string; // Image overlay gradient
  overlay: string; // Modal/Search overlay
}