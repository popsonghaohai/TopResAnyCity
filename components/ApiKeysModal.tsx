import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({ isOpen, onClose, theme }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [pexelsKey, setPexelsKey] = useState('');
  const [pixabayKey, setPixabayKey] = useState('');

  // Load keys from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem('gemini_api_key') || '');
      setPexelsKey(localStorage.getItem('pexels_api_key') || '');
      setPixabayKey(localStorage.getItem('pixabay_api_key') || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', geminiKey.trim());
    localStorage.setItem('pexels_api_key', pexelsKey.trim());
    localStorage.setItem('pixabay_api_key', pixabayKey.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md ${theme.cardBg} rounded-xl shadow-2xl overflow-hidden border ${theme.border} transform transition-all`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.border} flex justify-between items-center ${theme.highlight}`}>
          <h3 className={`font-bold ${theme.text}`}>API Key Configuration</h3>
          <button onClick={onClose} className={`p-1 rounded-full hover:bg-black/10 transition-colors ${theme.text}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          <p className={`text-sm ${theme.text} opacity-70 leading-relaxed`}>
            Enter your API keys below. Keys are stored securely on your local device.
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
                Get Key
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
            <input 
              type="text" 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Ex: AIzaSy..."
              className={`w-full p-3 rounded-lg border ${theme.border} bg-white ${theme.text} focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:opacity-30`}
            />
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
            <input 
              type="text" 
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              placeholder="Ex: 563492ad6f91700001000001..."
              className={`w-full p-3 rounded-lg border ${theme.border} bg-transparent ${theme.text} focus:ring-2 focus:ring-opacity-50 outline-none transition-all placeholder:opacity-30`}
              style={{ '--tw-ring-color': theme.id === 'spring' ? '#34d399' : theme.id === 'ice' ? '#22d3ee' : '#d4af37' } as React.CSSProperties}
            />
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
             <input 
              type="text" 
              value={pixabayKey}
              onChange={(e) => setPixabayKey(e.target.value)}
              placeholder="Ex: 12345678-abcdef123456..."
               className={`w-full p-3 rounded-lg border ${theme.border} bg-transparent ${theme.text} focus:ring-2 focus:ring-opacity-50 outline-none transition-all placeholder:opacity-30`}
               style={{ '--tw-ring-color': theme.id === 'spring' ? '#34d399' : theme.id === 'ice' ? '#22d3ee' : '#d4af37' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.border} flex justify-end gap-3 ${theme.highlight}`}>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium opacity-70 hover:opacity-100 transition-opacity ${theme.text}`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg text-sm font-bold shadow-md transform active:scale-95 transition-all ${theme.button} ${theme.buttonText}`}
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};