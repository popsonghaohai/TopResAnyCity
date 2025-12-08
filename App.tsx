import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { RestaurantCard } from './components/RestaurantCard';
import { LoadingView } from './components/LoadingView';
import { fetchTopRestaurants } from './services/geminiService';
import { Restaurant, LoadingState, ThemeId } from './types';
import { themes } from './themes';

function App() {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentCity, setCurrentCity] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('modern');
  const theme = themes[currentThemeId];

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Favorites State
  const [favorites, setFavorites] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (restaurant: Restaurant) => {
    if (favorites.some(f => f.id === restaurant.id)) {
      setFavorites(favorites.filter(f => f.id !== restaurant.id));
    } else {
      setFavorites([...favorites, restaurant]);
    }
  };

  const handleSearch = async (city: string) => {
    setLoadingState(LoadingState.LOADING);
    setRestaurants([]);
    setErrorMsg('');
    setCurrentCity(city);
    // Close Favorites if open when searching
    setIsFavoritesOpen(false); 

    try {
      const results = await fetchTopRestaurants(city);
      setRestaurants(results);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("We couldn't retrieve the culinary secrets of that city. Please try again.");
    }
  };

  // Determine what to display based on whether favorites mode is active
  const displayedRestaurants = isFavoritesOpen ? favorites : restaurants;
  const isFavoritesEmpty = isFavoritesOpen && favorites.length === 0;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme.font} ${theme.bg} selection:bg-stone-300 selection:text-black`}>
      
      {/* ----------------- Header ----------------- */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${theme.overlay} border-b ${theme.border} transition-all duration-300`}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Empty div for spacing balance */}
            <div className="w-10"></div>
            
            {/* App Title */}
            <h1 className={`text-xl md:text-2xl font-bold tracking-tight text-center ${theme.text}`}>
              Top Res Any City
            </h1>

            {/* Favorites Button */}
            <button 
              onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isFavoritesOpen ? 'bg-red-50 text-red-500' : `${theme.highlight} ${theme.accent}`}`}
            >
              <svg className={`w-6 h-6 ${isFavoritesOpen ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
        </div>
      </header>

      {/* ----------------- Main Content ----------------- */}
      <main className="pt-24 pb-20 px-4 max-w-2xl mx-auto min-h-screen flex flex-col">
        
        {/* Search Bar (Only show if not viewing favorites or if browsing) */}
        {!isFavoritesOpen && (
          <div className="mb-10">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={loadingState === LoadingState.LOADING} 
              // We can pass visual props if SearchBar supported them, keeping it simple for now
            />
          </div>
        )}

        {/* Favorites Header */}
        {isFavoritesOpen && (
          <div className="mb-8 text-center">
             <h2 className={`text-3xl font-bold ${theme.text} mb-2`}>My Collection</h2>
             <p className={`text-sm opacity-60 ${theme.text}`}>Your saved culinary spots</p>
             {isFavoritesEmpty && (
                <div className={`mt-12 p-8 border ${theme.border} border-dashed rounded-lg text-center`}>
                   <p className={`${theme.text} opacity-50`}>No favorites saved yet.</p>
                   <button 
                     onClick={() => setIsFavoritesOpen(false)}
                     className={`mt-4 px-6 py-2 ${theme.button} ${theme.buttonText} text-sm`}
                   >
                     Go Discover
                   </button>
                </div>
             )}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1">
          {displayedRestaurants.map((restaurant, index) => (
             <div key={restaurant.id} className="relative animate-fadeIn" style={{animationDelay: `${index * 150}ms`}}>
                <RestaurantCard 
                   restaurant={restaurant}
                   rank={index + 1}
                   theme={theme}
                   isFavorite={favorites.some(f => f.id === restaurant.id)}
                   onToggleFavorite={toggleFavorite}
                />
             </div>
          ))}
        </div>

        {/* Initial Welcome State (if no search, no loading, not favorites) */}
        {!isFavoritesOpen && loadingState === LoadingState.IDLE && restaurants.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 opacity-70 mt-10">
            <p className={`text-2xl font-bold ${theme.accent} mb-4`}>Ready to Explore?</p>
            <p className={`text-center max-w-xs ${theme.text} opacity-80`}>Enter a city above to find the top 3 viral restaurants right now.</p>
          </div>
        )}

        {/* Error State */}
        {!isFavoritesOpen && loadingState === LoadingState.ERROR && (
           <div className={`p-6 border ${theme.border} ${theme.highlight} text-center`}>
              <p className={theme.text}>{errorMsg}</p>
           </div>
        )}

      </main>

      {/* ----------------- Loading Overlay ----------------- */}
      {loadingState === LoadingState.LOADING && !isFavoritesOpen && (
        <LoadingView city={currentCity} theme={theme} />
      )}

      {/* ----------------- Bottom Left Settings ----------------- */}
      <div className="fixed bottom-6 left-6 z-50">
         {/* Settings Menu */}
         {isSettingsOpen && (
           <div className={`absolute bottom-14 left-0 w-48 ${theme.cardBg} border ${theme.border} shadow-2xl rounded-xl overflow-hidden mb-2 animate-slideUp origin-bottom-left`}>
              <div className={`px-4 py-3 border-b ${theme.border} text-xs font-bold uppercase tracking-wider ${theme.text} opacity-50`}>
                Select Theme
              </div>
              <button onClick={() => { setCurrentThemeId('spring'); setIsSettingsOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}>
                <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> Spring
              </button>
              <button onClick={() => { setCurrentThemeId('ice'); setIsSettingsOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}>
                <span className="w-3 h-3 rounded-full bg-cyan-400 mr-3"></span> Cool
              </button>
              <button onClick={() => { setCurrentThemeId('modern'); setIsSettingsOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}>
                <span className="w-3 h-3 rounded-full bg-stone-800 mr-3"></span> Modern
              </button>
           </div>
         )}

         {/* Settings FAB */}
         <button 
           onClick={() => setIsSettingsOpen(!isSettingsOpen)}
           className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${theme.button} ${theme.buttonText}`}
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
           </svg>
         </button>
      </div>

    </div>
  );
}

export default App;