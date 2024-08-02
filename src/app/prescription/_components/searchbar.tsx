// components/SearchBar.tsx

"use client";

import React, { useState } from "react";
import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch";
import { searchClient } from "../../../lib/algoliaClient";
import { Hit } from "./Hit";

// Define the interface for SearchBarProps
interface SearchBarProps {
  placeholder: string;
  onSelect: (item: DrugHit) => void; // Use the custom DrugHit type
  selectedItem: DrugHit | null;
  indexName: string; // Add indexName as a prop
}
// Define the DrugHit interface for Algolia search results
interface DrugHit {
  objectID: string;
  code: string;
  description: string;
  form?: string;
  ingredients?: string;
  strength?: string;
}
interface DrugItem {
  objectID: string;
  code: string;
  description: string;
  form?: string;
  ingredients?: string;
  strength?: string;
}
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSelect,
  selectedItem,
  indexName, // Destructure indexName
}) => {
  const [query, setQuery] = useState(
    selectedItem ? `${selectedItem.code} - ${selectedItem.description}` : ""
  );

  const handleSelect = (item: DrugHit) => {
    setQuery(`${item.code} - ${item.description}`);
    onSelect(item);
  };

  return (
    <div className="relative w-full mb-4 text-black">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        {" "}
        {/* Use the indexName prop */}
        <Configure hitsPerPage={3} />
        <SearchBox className="ais-SearchBox" translations={{}} />
        <Hits<DrugHit> // Specify the type of hits being rendered
          hitComponent={({ hit }) => (
            <Hit hit={hit} onSelect={handleSelect} /> // Pass onSelect to Hit
          )}
        />
      </InstantSearch>
    </div>
  );
};

export default SearchBar;
