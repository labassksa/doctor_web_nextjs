"use client";

import React, { useEffect, useRef } from "react";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";

import { BaseItem } from "@algolia/autocomplete-core";
import "@algolia/autocomplete-theme-classic";
import { searchClient } from "../../../lib/algoliaClient";
import { DrugHit } from "../../../utils/types/drugHit";
// Define the interface for SearchBarProps
interface SearchBarProps {
  placeholder: string;
  onSelect: (item: DrugHit) => void; // Use the custom DrugHit type
  selectedItem: DrugHit | null;
  indexName: string; // Add indexName as a prop
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSelect,
  selectedItem,
  indexName,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // Initialize Autocomplete
    const autocompleteInstance = autocomplete<DrugHit>({
      container: containerRef.current,
      placeholder: placeholder,
      openOnFocus: true,
      initialState: {
        query: selectedItem
          ? ` ${selectedItem["Scientific Name"]} -  ${selectedItem["Trade Name"]}`
          : "",
      },
      getSources({ query }) {
        return [
          {
            sourceId: indexName,
            getItems() {
              return searchClient
                .initIndex(indexName)
                .search<DrugHit>(query)
                .then(({ hits }) => hits);
            },
            getItemInputValue({ item }) {
              return `${item["Scientific Name"]} - ${item["Trade Name"]}`;
            },
            templates: {
              item({ item }) {
                return `
                      ${item["Scientific Name"]} - ${item["Trade Name"]}
                `;
              },
            },
            onSelect({ item, setQuery }) {
              const selectedValue = `  ${item["Scientific Name"]} - ${item["Trade Name"]}`;
              setQuery(selectedValue);
              console.log(
                ` Scientific Name: ${item["Scientific Name"]} - Trade Name: ${item["Trade Name"]}`
              );
              onSelect(item);
            },
          },
        ];
      },
    } as AutocompleteOptions<DrugHit>);

    return () => {
      // Cleanup autocomplete instance on component unmount
      autocompleteInstance.destroy();
    };
  }, [indexName, onSelect, placeholder, selectedItem]);

  return (
    <div className="relative z-50 w-full mb-4  text-black">
      <div ref={containerRef}></div>
      {/* Autocomplete container */}
    </div>
  );
};

export default SearchBar;
