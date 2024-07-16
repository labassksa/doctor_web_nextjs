// components/AllergyModal.tsx
"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import SearchBar from "./searchbar";

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (allergy: any) => void; // Callback to handle adding an allergy
}

const AllergyModal: React.FC<AllergyModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [currentSelection, setCurrentSelection] = useState<any>(null);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleSelect = (item: any) => {
    setCurrentSelection(item);
  };

  const handleAdd = () => {
    if (currentSelection) {
      onAdd(currentSelection);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Allergy" onAdd={handleAdd}>
      <SearchBar
        placeholder="Search for an allergy..."
        onSearch={handleSearch}
        onSelect={handleSelect}
        selectedItem={currentSelection}
      />
    </Modal>
  );
};

export default AllergyModal;
