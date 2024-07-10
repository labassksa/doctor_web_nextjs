// components/SearchBar.tsx
"use client";
import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  onSelect: (item: any) => void;
  selectedItem: any; // Add selectedItem prop
}

const mockResults = [
  { code: 'A00', description: 'Cholera' },
  { code: 'A01', description: 'Typhoid and paratyphoid fevers' },
  { code: 'A02', description: 'Other salmonella infections' },
  { code: 'A03', description: 'Shigellosis' },
  // Add more mock results as needed
];

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch, onSelect, selectedItem }) => {
  const [query, setQuery] = useState(selectedItem ? `${selectedItem.code} - ${selectedItem.description}` : '');
  const [results, setResults] = useState(mockResults);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);

    // Filter mock results based on query
    if (value) {
      setResults(mockResults.filter(result => 
        result.code.toLowerCase().includes(value.toLowerCase()) ||
        result.description.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  };

  const handleSelect = (item: any) => {
    setQuery(`${item.code} - ${item.description}`);
    onSelect(item);
    setResults([]);
  };

  return (
    <div className="relative w-full mb-4">
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        className="mb-2"
      />
      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 z-10">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => handleSelect(result)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <div>{result.code} - {result.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
