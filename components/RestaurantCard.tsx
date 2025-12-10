import React from 'react';
import { Restaurant, ThemeConfig } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  rank: number;
  theme: ThemeConfig;
  isFavorite: boolean;
  onToggleFavorite: (r: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, rank, theme, isFavorite, onToggleFavorite }) => {
  return (
    <div className={`${theme.cardBg} mb-6 relative overflow-hidden transition-all duration-300 border ${theme.border} ${theme.id === 'spring' ? 'rounded-3xl shadow-md hover:shadow-xl' : theme.id === 'ice' ? 'rounded-none border-l-4 border-l-cyan-400 shadow-lg' : 'rounded-lg shadow-sm hover:shadow-md'}`}>
      
      {/* Top Section: Rank, Favorite, Basic Info */}
      <div className="p-6 pb-2 flex items-start gap-4">
        
        {/* Rank Number */}
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${theme.highlight} ${theme.accent} font-serif text-3xl font-black border-2 ${theme.border}`}>
          {rank}
        </div>

        {/* Name and Cuisine */}
        <div className="flex-grow min-w-0 pt-1">
          <div className="flex justify-between items-start">
            <h2 className={`text-xl md:text-2xl font-black ${theme.text} leading-tight truncate pr-8`}>
              {restaurant.name}
            </h2>
            
            {/* Favorite Button */}
            <button 
              onClick={(e) => { e.preventDefault(); onToggleFavorite(restaurant); }}
              className={`absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-300'}`}
            >
              <svg className={`w-7 h-7 ${isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`text-xs uppercase tracking-widest font-extrabold px-2 py-1 ${theme.highlight} ${theme.accent} rounded border ${theme.border}`}>
              {restaurant.cuisine}
            </span>
             {/* Rating Badge */}
             <div className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-800 text-xs font-black border border-yellow-200">
               <svg className="w-3.5 h-3.5 fill-current text-yellow-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
               {restaurant.rating}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Review & Details */}
      <div className="px-6 py-2">
         {/* Review Summary: Removed opacity, used medium font weight */}
         <p className={`${theme.text} font-medium leading-relaxed italic text-base border-l-4 ${theme.id === 'ice' ? 'border-cyan-500' : 'border-gray-300'} pl-4 my-3`}>
           “{restaurant.reviewSummary}”
         </p>

         <div className={`mt-5 py-4 border-t ${theme.border} space-y-3`}>
            {/* Info rows: Removed opacity-80, increased font weight */}
            <div className={`flex items-start text-sm ${theme.text} font-semibold`}>
              <svg className={`flex-shrink-0 w-5 h-5 mr-3 ${theme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{restaurant.address}</span>
            </div>
            <div className={`flex items-center text-sm ${theme.text} font-semibold`}>
              <svg className={`flex-shrink-0 w-5 h-5 mr-3 ${theme.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a href={`tel:${restaurant.phoneNumber}`} className="hover:underline font-bold decoration-2">
                {restaurant.phoneNumber}
              </a>
            </div>
         </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex border-t border-black/5">
        {restaurant.websiteUrl && (
          <a
            href={restaurant.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center py-4 text-sm font-extrabold tracking-widest uppercase transition-all duration-300 hover:brightness-110 border-r border-black/5 ${theme.button} ${theme.buttonText}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            Website
          </a>
        )}
        <a 
          href={restaurant.mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex-[1.2] flex items-center justify-center py-4 text-sm font-extrabold tracking-widest uppercase transition-all duration-300 hover:brightness-110 ${theme.button} ${theme.buttonText}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          Navigate
        </a>
      </div>
    </div>
  );
};