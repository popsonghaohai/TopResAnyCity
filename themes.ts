import { ThemeConfig } from './types';

export const themes: Record<string, ThemeConfig> = {
  modern: {
    id: 'modern',
    name: 'Paris Chic',
    font: 'font-serif',
    bg: 'bg-stone-50',
    text: 'text-stone-900',
    cardBg: 'bg-white',
    accent: 'text-gold-500',
    button: 'bg-noir hover:bg-stone-800 shadow-md',
    buttonText: 'text-white',
    border: 'border-stone-200',
    highlight: 'bg-stone-100',
    gradient: 'from-black/70',
    overlay: 'bg-white/90 backdrop-blur-sm'
  },
  spring: {
    id: 'spring',
    name: 'Fresh Spring',
    font: 'font-rounded',
    bg: 'bg-[#fff5f5]', // Very light pink/white
    text: 'text-emerald-900',
    cardBg: 'bg-white',
    accent: 'text-rose-400',
    button: 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200',
    buttonText: 'text-white',
    border: 'border-rose-100',
    highlight: 'bg-emerald-50',
    gradient: 'from-emerald-900/60',
    overlay: 'bg-[#fff5f5]/90 backdrop-blur-md'
  },
  ice: {
    id: 'ice',
    name: 'Cyber Cool',
    font: 'font-mono',
    bg: 'bg-slate-900',
    text: 'text-cyan-50',
    cardBg: 'bg-slate-800',
    accent: 'text-cyan-400',
    button: 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    buttonText: 'text-slate-900 font-bold',
    border: 'border-slate-700',
    highlight: 'bg-slate-700',
    gradient: 'from-slate-900',
    overlay: 'bg-slate-900/90 backdrop-blur-md'
  }
};