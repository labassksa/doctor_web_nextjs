// components/SearchBar.tsx
"use client";
import React from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      onChange={handleInputChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      className="mb-4"
    />
  );
};

export default SearchBar;
