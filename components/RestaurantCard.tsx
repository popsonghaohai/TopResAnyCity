import React, { useState } from 'react';
import { Restaurant, ThemeConfig } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  rank: number;
  theme: ThemeConfig;
  isFavorite: boolean;
  onToggleFavorite: (r: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, rank, theme, isFavorite, onToggleFavorite }) => {
  const cityRestaurantFallback = `https://image.pollinations.ai/prompt/${encodeURIComponent(restaurant.city)}%20${encodeURIComponent(restaurant.name)}%20restaurant%20food%20photo?width=800&height=500&nologo=true`;
  const cityFallback = `https://image.pollinations.ai/prompt/${encodeURIComponent(restaurant.city)}%20city%20landmark%20view?width=800&height=500&nologo=true`;

  const [imgSrc, setImgSrc] = useState<string>(restaurant.imageUrl || cityRestaurantFallback);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      if (imgSrc === cityRestaurantFallback) {
         setImgSrc(cityFallback);
      } else {
         setImgSrc(cityRestaurantFallback);
      }
      setHasError(true);
    } else {
      if (imgSrc !== cityFallback) {
        setImgSrc(cityFallback);
      }
    }
  };

  return (
    <div className={`${theme.cardBg} mb-12 group overflow-hidden transition-all duration-300 border ${theme.border} ${theme.id === 'spring' ? 'rounded-3xl shadow-xl' : theme.id === 'ice' ? 'rounded-none border-l-4 border-l-cyan-400' : 'rounded-sm shadow-sm'}`}>
      {/* Image container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200">
        <img 
          src={imgSrc} 
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${theme.gradient} to-transparent`}></div>
        
        {/* Rank Badge */}
        <div className="absolute top-4 left-4">
           <span className={`flex items-center justify-center w-10 h-10 ${theme.button} ${theme.buttonText} text-xl font-bold shadow-lg ${theme.id === 'spring' ? 'rounded-full' : 'rounded-none'}`}>
             {rank}
           </span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.preventDefault(); onToggleFavorite(restaurant); }}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/40 transition-colors ${isFavorite ? 'text-red-500' : 'text-white'}`}
        >
          <svg className={`w-6 h-6 ${isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Floating Rating */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded shadow-sm flex items-center gap-1">
           <span className={`font-bold ${theme.accent}`}>{restaurant.rating}</span>
           <span className="text-xs text-gray-400">/10</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-col items-start">
           <div className="w-full flex justify-between items-start mb-2">
              <h2 className={`text-2xl font-bold ${theme.text}`}>{restaurant.name}</h2>
              <span className={`text-xs uppercase tracking-widest font-bold px-2 py-1 ${theme.highlight} ${theme.accent} rounded`}>{restaurant.cuisine}</span>
           </div>
           
           <p className={`${theme.text} opacity-70 font-light leading-relaxed mb-6 italic text-sm`}>
             “{restaurant.reviewSummary}”
           </p>

           <div className={`w-full py-4 mb-6 flex flex-col gap-3 text-sm ${theme.text} opacity-80 border-t border-b ${theme.border}`}>
              <div className="flex items-center">
                <svg className={`w-4 h-4 mr-3 ${theme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {restaurant.address}
              </div>
              <div className="flex items-center">
                <svg className={`w-4 h-4 mr-3 ${theme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href={`tel:${restaurant.phoneNumber}`} className="hover:underline opacity-100 font-medium">
                  {restaurant.phoneNumber}
                </a>
              </div>
           </div>

           <a 
             href={restaurant.mapUrl} 
             target="_blank" 
             rel="noopener noreferrer"
             className={`w-full text-center py-3 text-sm tracking-widest uppercase transition-all duration-300 ${theme.button} ${theme.buttonText} ${theme.id === 'spring' ? 'rounded-xl' : 'rounded-none'}`}
           >
             Navigate
           </a>
        </div>
      </div>
    </div>
  );
};