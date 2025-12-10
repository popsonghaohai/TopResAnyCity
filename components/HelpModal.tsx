import React from 'react';
import { ThemeConfig } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className={`mb-6 pb-6 border-b ${theme.border} last:border-0 last:mb-0 last:pb-0`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${theme.highlight} ${theme.accent}`}>
          {icon}
        </div>
        <h4 className={`font-bold text-lg ${theme.text}`}>{title}</h4>
      </div>
      <div className={`${theme.text} opacity-80 text-sm leading-relaxed space-y-2`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg ${theme.cardBg} rounded-xl shadow-2xl overflow-hidden border ${theme.border} flex flex-col max-h-[85vh]`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme.border} flex justify-between items-center ${theme.highlight} flex-shrink-0`}>
          <div className="flex items-center gap-2">
             <svg className={`w-6 h-6 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             <h3 className={`font-bold text-xl ${theme.text}`}>User Guide</h3>
          </div>
          <button onClick={onClose} className={`p-1 rounded-full hover:bg-black/10 transition-colors ${theme.text}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          <Section 
            title="Discover Top Restaurants" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          >
            <p>Enter any city name (e.g., "Kyoto", "New York") in the search bar. Our AI scout will instantly research thousands of reviews to bring you the <strong>Top 3 Viral Restaurants</strong> currently trending in that city.</p>
          </Section>

          <Section 
            title="Restaurant Details" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
          >
            <p>Each card provides a curated summary of why the place is famous, its cuisine type, rating (1-10), address, and phone number. Tap <strong>"Navigate with Maps"</strong> to get directions immediately.</p>
          </Section>

          <Section 
            title="Favorites & Collections" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          >
            <p>Found a spot you love? Tap the <strong>Heart icon</strong> on the top right of any card to save it. You can access your collection anytime by clicking the heart button in the top header.</p>
          </Section>

          <Section 
             title="Customization" 
             icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>}
          >
            <p>Use the <strong>Settings button</strong> (bottom left) to switch visual themes (Spring, Cool, Modern) or change the result language (English, Chinese, French, etc.).</p>
          </Section>

          <Section 
            title="API Configuration" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 17.464a3 3 0 01-.879.586l-2 1a3 3 0 01-3.414-3.414l1-2a3 3 0 01.586-.879l2.743-2.743A6 6 0 0117 9z" /></svg>}
          >
             <p>This app uses Pexels and Pixabay for images. For the best experience, you can provide your own free API keys in settings via <strong>"Configure Keys"</strong>. This prevents rate-limit issues and ensures high-quality images.</p>
          </Section>

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.border} flex justify-center ${theme.highlight} flex-shrink-0`}>
          <button 
            onClick={onClose}
            className={`w-full py-3 rounded-lg text-sm font-bold shadow-md transform active:scale-95 transition-all ${theme.button} ${theme.buttonText}`}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};