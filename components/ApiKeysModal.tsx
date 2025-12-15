import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { storageService, STORAGE_KEYS } from '../services/storageService';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  forceInput?: boolean;     // If true, user cannot close modal without saving a key
  onKeysSaved?: () => void; // Callback when keys are successfully saved
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({ isOpen, onClose, theme, forceInput = false, onKeysSaved }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [pexelsKey, setPexelsKey] = useState('');
  const [pixabayKey, setPixabayKey] = useState('');

  // Visibility toggles
  const [showGemini, setShowGemini] = useState(false);
  const [showPexels, setShowPexels] = useState(false);
  const [showPixabay, setShowPixabay] = useState(false);

  // Load keys from storageService when modal opens
  useEffect(() => {
    if (isOpen) {
      setGeminiKey(storageService.getApiKey(STORAGE_KEYS.GEMINI_KEY));
      setPexelsKey(storageService.getApiKey(STORAGE_KEYS.PEXELS_KEY));
      setPixabayKey(storageService.getApiKey(STORAGE_KEYS.PIXABAY_KEY));
      // Reset visibility on open
      setShowGemini(false);
      setShowPexels(false);
      setShowPixabay(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    // Strict validation for Gemini Key
    if (!geminiKey.trim()) {
       alert("A Gemini API Key is required to use this application.\n\nPlease get a free key from Google AI Studio.");
       return;
    }

    storageService.saveApiKey(STORAGE_KEYS.GEMINI_KEY, geminiKey.trim());
    storageService.saveApiKey(STORAGE_KEYS.PEXELS_KEY, pexelsKey.trim());
    storageService.saveApiKey(STORAGE_KEYS.PIXABAY_KEY, pixabayKey.trim());
    
    if (onKeysSaved) {
        onKeysSaved();
    }
    onClose();
  };

  if (!isOpen) return null;

  // Helper component for the Eye Icon
  const EyeIcon: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
    isVisible ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    )
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md ${theme.cardBg} rounded-xl shadow-2xl overflow-hidden border ${theme.border} transform transition-all`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.border} flex justify-between items-center ${theme.highlight}`}>
          <h3 className={`font-bold ${theme.text}`}>
            {forceInput ? "Welcome! Setup Required" : "API Key Configuration"}
          </h3>
          {!forceInput && (
            <button onClick={onClose} className={`p-1 rounded-full hover:bg-black/10 transition-colors ${theme.text}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <p className={`text-sm ${theme.text} opacity-70 leading-relaxed`}>
            {forceInput 
              ? "To start discovering global flavors, please enter your personal Gemini API Key below. This ensures you have full control over your usage." 
              : "Enter your API keys below. Keys are stored securely on your local device."}
          </p>

          {/* Gemini Section (Primary) */}
          <div className="space-y-2 p-3 rounded-lg bg-orange-50/50 border border-orange-100">
            <div className="flex justify-between items-center">
              <label className={`block text-xs font-bold uppercase tracking-wider text-orange-800`}>Gemini API Key (Required)</label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs flex items-center gap-1 hover:underline font-medium transition-opacity hover:opacity-80 text-orange-600`}
              >
                Get Free Key
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
            <div className="relative">
              <input 
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Ex: AIzaSy..."
                className={`w-full p-3 pr-10 rounded-lg border ${theme.border} bg-white ${theme.text} focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:opacity-30`}
              />
              <button 
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <EyeIcon isVisible={showGemini} />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200"></div>

          {/* Pexels Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={`block text-xs font-bold uppercase tracking-wider ${theme.text} opacity-60`}>Pexels API Key (Optional)</label>
              <a 
                href="https://www.pexels.com/api/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs flex items-center gap-1 hover:underline font-medium transition-opacity hover:opacity-80 ${theme.accent}`}
              >
                Get Key
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
            <div className="relative">
              <input 
                type={showPexels ? "text" : "password"}
                value={pexelsKey}
                onChange={(e) => setPexelsKey(e.target.value)}
                placeholder="Ex: 563492ad6f91700001000001..."
                className={`w-full p-3 pr-10 rounded-lg border ${theme.border} bg-transparent ${theme.text} focus:ring-2 focus:ring-opacity-50 outline-none transition-all placeholder:opacity-30`}
                style={{ '--tw-ring-color': theme.id === 'spring' ? '#34d399' : theme.id === 'ice' ? '#22d3ee' : '#d4af37' } as React.CSSProperties}
              />
              <button 
                type="button"
                onClick={() => setShowPexels(!showPexels)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.text} opacity-50 hover:opacity-80 focus:outline-none`}
              >
                <EyeIcon isVisible={showPexels} />
              </button>
            </div>
          </div>

          {/* Pixabay Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={`block text-xs font-bold uppercase tracking-wider ${theme.text} opacity-60`}>Pixabay API Key (Optional)</label>
              <a 
                href="https://pixabay.com/api/docs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs flex items-center gap-1 hover:underline font-medium transition-opacity hover:opacity-80 ${theme.accent}`}
              >
                Get Key
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
             <div className="relative">
               <input 
                type={showPixabay ? "text" : "password"}
                value={pixabayKey}
                onChange={(e) => setPixabayKey(e.target.value)}
                placeholder="Ex: 12345678-abcdef123456..."
                 className={`w-full p-3 pr-10 rounded-lg border ${theme.border} bg-transparent ${theme.text} focus:ring-2 focus:ring-opacity-50 outline-none transition-all placeholder:opacity-30`}
                 style={{ '--tw-ring-color': theme.id === 'spring' ? '#34d399' : theme.id === 'ice' ? '#22d3ee' : '#d4af37' } as React.CSSProperties}
              />
              <button 
                type="button"
                onClick={() => setShowPixabay(!showPixabay)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.text} opacity-50 hover:opacity-80 focus:outline-none`}
              >
                <EyeIcon isVisible={showPixabay} />
              </button>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.border} flex justify-end gap-3 ${theme.highlight}`}>
          {!forceInput && (
            <button 
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium opacity-70 hover:opacity-100 transition-opacity ${theme.text}`}
            >
                Cancel
            </button>
          )}
          <button 
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg text-sm font-bold shadow-md transform active:scale-95 transition-all ${theme.button} ${theme.buttonText}`}
          >
            {forceInput ? "Start Exploring" : "Save Keys"}
          </button>
        </div>
      </div>
    </div>
  );
};