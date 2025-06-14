import React, { useState, useEffect, useRef } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);
  
  // Load recent searches from local storage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (err) {
        console.error('Failed to parse recent searches:', err);
        localStorage.removeItem('recentSearches');
      }
    }
  }, []);
  
  // Save recent searches to local storage when updated
  useEffect(() => {
    if (recentSearches.length) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);
  
  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateRecentSearches = (search) => {
    // Add to recent searches (no duplicates and max 5)
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== search.toLowerCase());
      return [search, ...filtered].slice(0, 5);
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query.trim());
  };
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm) return;
    
    onSearch(searchTerm);
    updateRecentSearches(searchTerm);
    setQuery(searchTerm);
    setShowSuggestions(false);
    setError(null);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (value.length > 1) {
      setIsLoading(true);
      // Set debounced timer for suggestions
      debounceTimer.current = setTimeout(() => {
        // This would normally call an API
        // For now just filter recent searches
        const matches = recentSearches.filter(item => 
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matches);
        setIsLoading(false);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const getLocation = () => {
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSearch(`${latitude},${longitude}`);
        setQuery('Current Location');
        updateRecentSearches('Current Location');
        setIsLoading(false);
        setShowSuggestions(false);
      },
      (error) => {
        setIsLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while getting location.');
        }
      }
    );
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => recentSearches.length > 0 && setShowSuggestions(true)}
            aria-label="City search"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-controls="search-suggestions"
          />
          {isLoading && <div className="search-spinner"></div>}          <button 
            type="button" 
            className="location-button"
            onClick={getLocation}
            aria-label="Use my current location"
            title="Use my current location"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M16.24 7.76l-1.42-1.42M7.76 16.24l-1.42 1.42M7.76 7.76L6.34 6.34M16.24 16.24l1.42 1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>
      
      {error && <div className="search-error" role="alert">{error}</div>}
      
      {showSuggestions && (recentSearches.length > 0 || suggestions.length > 0) && (
        <ul id="search-suggestions" className="search-suggestions" role="listbox">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                role="option"
                onClick={() => handleSearch(suggestion)}
                className="suggestion-item"
              >
                <span className="suggestion-icon">🔍</span>
                {suggestion}
              </li>
            ))
          ) : (
            recentSearches.map((search, index) => (
              <li 
                key={index} 
                role="option"
                onClick={() => handleSearch(search)}
                className="suggestion-item recent"
              >
                <span className="suggestion-icon">⏱</span>
                {search}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;