"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import SearchBar from "./searchbar";
import { DiagnosisHit } from "../../../utils/types/diagnosis";

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (diagnosis: DiagnosisHit) => void;
}

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [currentSelection, setCurrentSelection] = useState<DiagnosisHit | null>(
    null
  );

  const handleSelect = (item: DiagnosisHit) => {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Diagnosis"
      onAdd={handleAdd}
    >
      <SearchBar
        placeholder="Search for a diagnosis..."
        onSelect={(item) => {
          if ("ascii_desc" in item) {
            handleSelect(item as DiagnosisHit);
          }
        }}
        selectedItem={currentSelection}
        indexName="diagnosis"
      />
      {/* Render the selected item */}
      {currentSelection && (
        <div className="mt-2 text-gray-700">
          Selected: {currentSelection.ascii_desc} (
          {currentSelection.ascii_short_desc})
        </div>
      )}
    </Modal>
  );
};

export default DiagnosisModal;
