// components/DiagnosisModal.tsx
"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import SearchBar from "./searchbar";

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (diagnosis: any) => void; // Callback to handle adding a diagnosis
}

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({ isOpen, onClose, onAdd }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Diagnosis" onAdd={handleAdd}>
      <SearchBar
        placeholder="Search for a diagnosis..."
        onSearch={handleSearch}
        onSelect={handleSelect}
        selectedItem={currentSelection}
      />
    </Modal>
  );
};

export default DiagnosisModal;
