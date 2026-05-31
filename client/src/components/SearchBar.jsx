import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './ui/Input';
import { searchStocks } from '../constants/stocks';
import { useAppContext } from '../context/AppContext';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SearchBar = ({ onAnalyze, placeholder = 'Search stock... e.g. RELIANCE, TCS, NIFTY' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { searchHistory } = useAppContext();

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length >= 1) {
      setSuggestions(searchStocks(query));
      setActiveSuggestion(-1);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelect = useCallback((symbol) => {
    setQuery('');
    setSuggestions([]);
    setFocused(false);
    if (onAnalyze) {
      onAnalyze(symbol);
    } else {
      navigate(`/analysis/${symbol}`);
    }
  }, [navigate, onAnalyze]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSelect(suggestions[activeSuggestion].symbol);
      } else if (query.trim()) {
        handleSelect(query.trim().toUpperCase());
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = focused && (suggestions.length > 0 || (query.length === 0 && searchHistory.length > 0));

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        id="stock-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        leftIcon={<SearchIcon />}
        inputClassName="text-base py-3.5 bg-card-elevated"
        autoComplete="off"
      />

      {/* Suggestions dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 card-base shadow-[var(--shadow-lg)] z-50 overflow-hidden animate-fade-in">
          {query.length === 0 && searchHistory.length > 0 && (
            <>
              <div className="px-3 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-widest border-b border-border">
                Recent Searches
              </div>
              {searchHistory.slice(0, 5).map((sym) => (
                <button
                  key={sym}
                  onMouseDown={() => handleSelect(sym)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-card-hover transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-.03-4.88" />
                  </svg>
                  <span className="text-sm text-text">{sym}</span>
                </button>
              ))}
            </>
          )}

          {suggestions.length > 0 && (
            <>
              <div className="px-3 py-2 text-[11px] font-semibold text-text-muted uppercase tracking-widest border-b border-border">
                Suggestions
              </div>
              {suggestions.map((stock, idx) => (
                <button
                  key={stock.symbol}
                  onMouseDown={() => handleSelect(stock.symbol)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                    activeSuggestion === idx ? 'bg-card-hover' : 'hover:bg-card-hover'
                  }`}
                >
                  <div>
                    <span className="text-sm font-semibold text-text">{stock.symbol}</span>
                    <span className="text-xs text-text-muted ml-2">{stock.name}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
