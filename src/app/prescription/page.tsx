// PrescriptionPage.tsx
"use client";
import React, { useState } from "react";
import TabComponent from "./_components/tabs";
import Title from "./_components/title";
import PatientInfo from "./_components/PatientInfo";
import ActionButton from "./_components/ActionButton";
import IssuePrescriptionButton from "./_components/IssuePrescriptionButton";
import Modal from "./_components/Modal";
import SearchBar from "./_components/searchbar";

const PrescriptionPage: React.FC = () => {
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

  const [selectedDrugs, setSelectedDrugs] = useState<any[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<any[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any[]>([]);

  const [currentSelection, setCurrentSelection] = useState<any>(null);

  const openDrugModal = () => {
    setCurrentSelection(null);
    setIsDrugModalOpen(true);
  };
  const closeDrugModal = () => setIsDrugModalOpen(false);

  const openAllergyModal = () => {
    setCurrentSelection(null);
    setIsAllergyModalOpen(true);
  };
  const closeAllergyModal = () => setIsAllergyModalOpen(false);

  const openDiagnosisModal = () => {
    setCurrentSelection(null);
    setIsDiagnosisModalOpen(true);
  };
  const closeDiagnosisModal = () => setIsDiagnosisModalOpen(false);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleSelect = (item: any) => {
    setCurrentSelection(item);
  };

  const handleAdd = () => {
    if (currentSelection) {
      if (isDrugModalOpen) {
        setSelectedDrugs([...selectedDrugs, currentSelection]);
        closeDrugModal();
      } else if (isAllergyModalOpen) {
        setSelectedAllergies([...selectedAllergies, currentSelection]);
        closeAllergyModal();
      } else if (isDiagnosisModalOpen) {
        setSelectedDiagnosis([...selectedDiagnosis, currentSelection]);
        closeDiagnosisModal();
      }
      setCurrentSelection(null); // Clear the current selection
    }
  };

  return (
    <div className="flex-grow p-8">
      <TabComponent />
      <Title />
      <PatientInfo />

      <ActionButton label="Drugs" onClick={openDrugModal} />
      <div>
        {selectedDrugs.map((drug, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            {drug.code} - {drug.description}
          </div>
        ))}
      </div>

      <ActionButton label="Allergies" onClick={openAllergyModal} />
      <div>
        {selectedAllergies.map((allergy, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            {allergy.code} - {allergy.description}
          </div>
        ))}
      </div>

      <ActionButton label="Diagnosis" onClick={openDiagnosisModal} />
      <div>
        {selectedDiagnosis.map((diagnosis, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            {diagnosis.code} - {diagnosis.description}
          </div>
        ))}
      </div>

      <IssuePrescriptionButton />

      <Modal
        isOpen={isDrugModalOpen}
        onClose={closeDrugModal}
        title="Add Drugs"
        onAdd={handleAdd}
      >
        <SearchBar
          placeholder="Search for a drug..."
          onSearch={handleSearch}
          onSelect={handleSelect}
          selectedItem={currentSelection} // Pass the selected item
        />
      </Modal>

      <Modal
        isOpen={isAllergyModalOpen}
        onClose={closeAllergyModal}
        title="Add Allergies"
        onAdd={handleAdd}
      >
        <SearchBar
          placeholder="Search for an allergy..."
          onSearch={handleSearch}
          onSelect={handleSelect}
          selectedItem={currentSelection} // Pass the selected item
        />
      </Modal>

      <Modal
        isOpen={isDiagnosisModalOpen}
        onClose={closeDiagnosisModal}
        title="Add Diagnosis"
        onAdd={handleAdd}
      >
        <SearchBar
          placeholder="Search for a diagnosis..."
          onSearch={handleSearch}
          onSelect={handleSelect}
          selectedItem={currentSelection} // Pass the selected item
        />
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
