"use client";

import React, { useEffect, useRef } from "react";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import { DrugHit } from "../../../utils/types/drugHit";
import { DiagnosisHit } from "../../../utils/types/diagnosis";
import { searchClient } from "../../../lib/algoliaClient";
import "@algolia/autocomplete-theme-classic";

type SearchItem = DrugHit | DiagnosisHit;

interface SearchBarProps {
  placeholder: string;
  onSelect: (item: SearchItem) => void;
  selectedItem: SearchItem | null;
  indexName: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSelect,
  selectedItem,
  indexName,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const autocompleteInstance = autocomplete<SearchItem>({
      container: containerRef.current,
      placeholder,
      openOnFocus: true,
      initialState: {
        query:
          selectedItem && isDrugHit(selectedItem)
            ? `${selectedItem["Scientific Name"]} - ${selectedItem["Trade Name"]}`
            : selectedItem && isDiagnosisHit(selectedItem)
            ? `${selectedItem.ascii_desc}`
            : "",
      },
      getSources({ query }) {
        return [
          {
            sourceId: indexName,
            getItems() {
              return searchClient
                .initIndex(indexName)
                .search<SearchItem>(query)
                .then(({ hits }) => hits);
            },
            getItemInputValue({ item }) {
              if (isDrugHit(item)) {
                return `${item["Scientific Name"]} - ${item["Trade Name"]}`;
              } else if (isDiagnosisHit(item)) {
                return item.ascii_desc;
              }
              return "nothing";
            },
            templates: {
              item({ item }) {
                if (isDrugHit(item)) {
                  return `${item["Scientific Name"]} - ${item["Trade Name"]}`;
                } else if (isDiagnosisHit(item)) {
                  return `${item.ascii_desc} (${item.ascii_short_desc})`;
                }
                return "";
              },
            },
            onSelect({ item, setQuery }) {
              if (isDrugHit(item)) {
                const selectedValue = `${item["Scientific Name"]} - ${item["Trade Name"]}`;
                setQuery(selectedValue);
              } else if (isDiagnosisHit(item)) {
                const selectedValue = item.ascii_desc;
                setQuery(selectedValue);
              }
              onSelect(item); // This should correctly pass the item to the parent
            },
          },
        ];
      },
    } as AutocompleteOptions<SearchItem>);

    return () => autocompleteInstance.destroy();
  }, [indexName, onSelect, placeholder, selectedItem]);

  return (
    <div className="relative z-50 w-full mb-4 text-black">
      <div ref={containerRef}></div>
    </div>
  );
};

// Type guards
const isDrugHit = (item: SearchItem): item is DrugHit => {
  return (item as DrugHit).RegisterNumber !== undefined;
};

const isDiagnosisHit = (item: SearchItem): item is DiagnosisHit => {
  return (item as DiagnosisHit).ascii_desc !== undefined;
};

export default SearchBar;
