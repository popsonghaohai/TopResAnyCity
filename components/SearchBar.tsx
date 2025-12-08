import React, { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="sticky top-0 z-50 p-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
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
    </div>
  );
};
