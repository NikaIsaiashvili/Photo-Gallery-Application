import React, { useState, useEffect } from "react";
import "../styles/SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [debounceTimer, setDebounceTimer] =
    useState<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    // Set new timer
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500); // wait 0.5 sec after user stops typing
    setDebounceTimer(timer);

    //Cleanup
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="searchBarWrapper">
      <div className="spacer" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ძებნა..."
        className="searchBar"
      />
      <div className="spacer" />
    </div>
  );
};

export default SearchBar;
