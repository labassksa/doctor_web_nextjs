"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import SearchBar from "./searchbar";
import { DrugHit } from "../../../utils/types/drugHit";

interface DrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drug: DrugHit) => void;
}

const DrugModal: React.FC<DrugModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [currentSelection, setCurrentSelection] = useState<DrugHit | null>(
    null
  );

  const handleSelect = (item: DrugHit) => {
    console.log("Selected item:", item);
    setCurrentSelection(item);
  };

  const handleAdd = () => {
    if (currentSelection) {
      onAdd(currentSelection);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Drug" onAdd={handleAdd}>
      <SearchBar
        placeholder="Search for a drug..."
        onSelect={(item) => {
          if ("RegisterNumber" in item) {
            handleSelect(item as DrugHit);
          }
        }}
        selectedItem={currentSelection}
        indexName="drugs"
      />
      {/* Render the selected item */}
      {currentSelection && (
        <div className="mt-2 text-gray-700">
          Selected: {currentSelection["Scientific Name"]} (
          {currentSelection["Trade Name"]})
        </div>
      )}
    </Modal>
  );
};

export default DrugModal;
