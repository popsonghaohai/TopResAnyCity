import React, { useState, useEffect, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { RestaurantCard } from './components/RestaurantCard';
import { LoadingView } from './components/LoadingView';
import { ApiKeysModal } from './components/ApiKeysModal';
import { HelpModal } from './components/HelpModal';
import { fetchTopRestaurants } from './services/geminiService';
import { Restaurant, LoadingState, ThemeId, LanguageCode } from './types';
import { themes } from './themes';

function App() {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cityImage, setCityImage] = useState<string>('');
  const [currentCity, setCurrentCity] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('modern');
  const theme = themes[currentThemeId];

  // Language State
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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

  // Main Search Function
  const handleSearch = async (city: string) => {
    if (!city) return;
    
    setLoadingState(LoadingState.LOADING);
    setRestaurants([]); 
    setCityImage('');
    setErrorMsg('');
    setCurrentCity(city);
    // Close Favorites if open when searching
    setIsFavoritesOpen(false); 

    try {
      const { restaurants: results, cityImageUrl } = await fetchTopRestaurants(city, currentLanguage);
      setRestaurants(results);
      setCityImage(cityImageUrl);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("We couldn't retrieve the culinary secrets of that city. Please try again.");
    }
  };

  // Effect: Reload search results when language changes (if we already have a city)
  useEffect(() => {
    if (currentCity && !isFavoritesOpen && loadingState !== LoadingState.LOADING) {
       // Re-fetch with the new language
       handleSearch(currentCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

  // Determine what to display based on whether favorites mode is active
  const displayedRestaurants = isFavoritesOpen ? favorites : restaurants;
  const isFavoritesEmpty = isFavoritesOpen && favorites.length === 0;

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文 (Chinese)' },
    { code: 'fr', label: 'Français (French)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'ja', label: '日本語 (Japanese)' },
  ];

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
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={loadingState === LoadingState.LOADING} 
            />
          </div>
        )}

        {/* City Image Banner (Real Image) */}
        {loadingState === LoadingState.SUCCESS && !isFavoritesOpen && currentCity && restaurants.length > 0 && (
          <div className={`relative w-full h-48 md:h-64 mb-10 rounded-xl overflow-hidden shadow-lg animate-fadeIn ${theme.cardBg}`}>
            {cityImage ? (
                <img 
                  src={cityImage}
                  alt={currentCity}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                      // Fallback if the real image link is broken
                      e.currentTarget.style.display = 'none';
                  }}
                />
            ) : null}
            
            {/* Fallback Gradient Background (Visible if no image or image error) */}
            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${theme.gradient} to-gray-500`}></div>

            {/* Overlay Text */}
            <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} to-transparent flex flex-col justify-end p-6`}>
              <h2 className="text-white text-3xl md:text-4xl font-bold shadow-sm">Top 3 in {currentCity}</h2>
              <p className="text-white/80 text-sm md:text-base mt-1">Curated by AI • Validated by Locals</p>
            </div>
          </div>
        )}

        {/* Favorites Header */}
        {isFavoritesOpen && (
          <div className="mb-8 text-center animate-fadeIn">
             {/* Back Button */}
             <button
                onClick={() => setIsFavoritesOpen(false)}
                className={`mb-6 inline-flex items-center px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${theme.border} ${theme.text} hover:bg-black/5 active:scale-95`}
             >
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Search
             </button>

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
             <div key={restaurant.id} className="relative animate-fadeIn" style={{animationDelay: `${index * 100}ms`}}>
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

      {/* ----------------- API Keys Modal ----------------- */}
      <ApiKeysModal 
        isOpen={isApiKeysModalOpen} 
        onClose={() => setIsApiKeysModalOpen(false)} 
        theme={theme} 
      />

      {/* ----------------- Help Modal ----------------- */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
        theme={theme} 
      />

      {/* ----------------- Bottom Left Settings ----------------- */}
      <div className="fixed bottom-6 left-6 z-50">
         {/* Settings Menu */}
         {isSettingsOpen && (
           <div className={`absolute bottom-14 left-0 w-56 ${theme.cardBg} border ${theme.border} shadow-2xl rounded-xl overflow-hidden mb-2 animate-slideUp origin-bottom-left max-h-[80vh] overflow-y-auto`}>
              
              {/* Language Section */}
              <div className={`px-4 py-3 border-b ${theme.border} text-xs font-bold uppercase tracking-wider ${theme.text} opacity-50 bg-gray-50/50`}>
                Language
              </div>
              {languages.map(lang => (
                <button 
                  key={lang.code}
                  onClick={() => { setCurrentLanguage(lang.code); }} 
                  className={`w-full text-left px-4 py-2 hover:bg-black/5 flex items-center justify-between ${theme.text} ${currentLanguage === lang.code ? 'font-bold bg-black/5' : ''}`}
                >
                  {lang.label}
                  {currentLanguage === lang.code && <span className={`text-xs ${theme.accent}`}>●</span>}
                </button>
              ))}

              {/* Theme Section */}
              <div className={`px-4 py-3 border-b ${theme.border} border-t ${theme.border} text-xs font-bold uppercase tracking-wider ${theme.text} opacity-50 bg-gray-50/50 mt-2`}>
                Theme
              </div>
              <button onClick={() => { setCurrentThemeId('spring'); }} className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}>
                <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> Spring
              </button>
              <button onClick={() => { setCurrentThemeId('ice'); }} className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}>
                <span className="w-3 h-3 rounded-full bg-cyan-400 mr-3"></span> Cool
              </button>
              <button onClick={() => { setCurrentThemeId('modern'); }} className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}>
                <span className="w-3 h-3 rounded-full bg-stone-800 mr-3"></span> Modern
              </button>

              {/* API Keys Section */}
              <div className={`px-4 py-3 border-b ${theme.border} border-t ${theme.border} text-xs font-bold uppercase tracking-wider ${theme.text} opacity-50 bg-gray-50/50 mt-2`}>
                App Info
              </div>
              <button 
                onClick={() => { setIsSettingsOpen(false); setIsApiKeysModalOpen(true); }} 
                className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}
              >
                 <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 17.464a3 3 0 01-.879.586l-2 1a3 3 0 01-3.414-3.414l1-2a3 3 0 01.586-.879l2.743-2.743A6 6 0 0117 9z" /></svg>
                 Configure Keys
              </button>
              <button 
                onClick={() => { setIsSettingsOpen(false); setIsHelpModalOpen(true); }} 
                className={`w-full text-left px-4 py-3 hover:bg-black/5 flex items-center ${theme.text}`}
              >
                 <svg className="w-4 h-4 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Help & Guide
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