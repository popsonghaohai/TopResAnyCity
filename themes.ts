import { ThemeConfig } from './types';

export const themes: Record<string, ThemeConfig> = {
  modern: {
    id: 'modern',
    name: 'Paris Chic',
    font: 'font-serif',
    bg: 'bg-stone-100', // Slightly darker than pure white to let cards pop
    text: 'text-black', // Maximum contrast
    cardBg: 'bg-white',
    accent: 'text-amber-700', // Darker gold for better readability on white
    button: 'bg-black hover:bg-stone-800 shadow-md',
    buttonText: 'text-white font-bold',
    border: 'border-stone-300', // Darker border
    highlight: 'bg-stone-100',
    gradient: 'from-black/80', // Darker gradient
    overlay: 'bg-white/95 backdrop-blur-sm'
  },
  spring: {
    id: 'spring',
    name: 'Fresh Spring',
    font: 'font-rounded',
    bg: 'bg-rose-50', 
    text: 'text-teal-950', // Very dark teal, almost black
    cardBg: 'bg-white',
    accent: 'text-rose-600', // Darker rose for contrast
    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200',
    buttonText: 'text-white font-extrabold',
    border: 'border-rose-200',
    highlight: 'bg-emerald-50',
    gradient: 'from-emerald-950/70',
    overlay: 'bg-[#fff5f5]/95 backdrop-blur-md'
  },
  ice: {
    id: 'ice',
    name: 'Cyber Cool',
    font: 'font-mono',
    bg: 'bg-slate-950', // Darker background
    text: 'text-white', // Pure white text
    cardBg: 'bg-slate-900',
    accent: 'text-cyan-300', // Bright cyan pops against dark
    button: 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    buttonText: 'text-slate-950 font-black',
    border: 'border-slate-600',
    highlight: 'bg-slate-800',
    gradient: 'from-black',
    overlay: 'bg-slate-950/95 backdrop-blur-md'
  }
};