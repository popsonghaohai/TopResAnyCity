import React, { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  onBack?: () => void;
  onRestore?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, onBack, onRestore }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="sticky top-0 z-50 p-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-md mx-auto flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600 transition-all duration-200"
            aria-label="Go Back"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
          </button>
        )}
        <form onSubmit={handleSubmit} className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none shadow-sm"
            placeholder="Enter a city (e.g., Tokyo, Paris)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2.5 bottom-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full text-sm px-4 py-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Searching...' : 'Go'}
          </button>
        </form>
        {onRestore && (
          <button
            type="button"
            onClick={onRestore}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600 transition-all duration-200"
            aria-label="Restore last search"
            title="Return to last search"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
          </button>
        )}
      </div>
    </div>
  );
};