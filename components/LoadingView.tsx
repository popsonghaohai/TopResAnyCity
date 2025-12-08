import React from 'react';
import { ThemeConfig } from '../types';

interface LoadingViewProps {
  city: string;
  theme: ThemeConfig;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ city, theme }) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className={`relative w-32 h-32 flex items-center justify-center mb-8`}>
        {/* Outer Ring */}
        <div className={`absolute inset-0 border-4 border-t-transparent ${theme.id === 'ice' ? 'border-cyan-200' : 'border-stone-200'} rounded-full animate-spin`}></div>
        {/* Middle Ring */}
        <div className={`absolute inset-4 border-4 border-b-transparent ${theme.id === 'spring' ? 'border-rose-300' : theme.id === 'ice' ? 'border-cyan-400' : 'border-gold-400'} rounded-full animate-spin-slow`}></div>
        {/* Inner Icon */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
           <svg className={`w-10 h-10 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
      </div>
      
      <div className={`text-center space-y-2 ${theme.font}`}>
        <h3 className={`text-2xl font-bold ${theme.text}`}>Scouting {city}</h3>
        <p className={`${theme.text} opacity-60 text-sm uppercase tracking-widest`}>Analyzing reviews...</p>
      </div>
    </div>
  );
};