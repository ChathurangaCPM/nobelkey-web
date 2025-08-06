import React, { useState, useRef, KeyboardEvent } from 'react';
import { Search, Mic, Camera, X } from 'lucide-react';

interface GoogleSearchBarProps {
  onSearch: (query: string) => void;
}

const GoogleSearchBar: React.FC<GoogleSearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div
        className={`flex items-center px-4 py-2 rounded-full border 
          ${isFocused 
            ? 'border-blue-500 shadow-lg' 
            : 'border-gray-300 hover:shadow-md'
          }
          bg-white transition-all duration-200`}
      >
        <Search className="w-5 h-5 text-gray-500 mr-3" />
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 outline-none text-base text-gray-700"
          placeholder="Search Google or type a URL"
        />

        {searchQuery && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}

        <div className="flex items-center space-x-2 ml-2 border-l pl-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Mic className="w-5 h-5 text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Camera className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSearchBar;