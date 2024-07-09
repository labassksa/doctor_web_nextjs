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

  const openDrugModal = () => setIsDrugModalOpen(true);
  const closeDrugModal = () => setIsDrugModalOpen(false);

  const openAllergyModal = () => setIsAllergyModalOpen(true);
  const closeAllergyModal = () => setIsAllergyModalOpen(false);

  const openDiagnosisModal = () => setIsDiagnosisModalOpen(true);
  const closeDiagnosisModal = () => setIsDiagnosisModalOpen(false);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  return (
    <div className="flex-grow p-8">
      <TabComponent />
      <Title />
      <PatientInfo />
      <ActionButton label="Drugs" onClick={openDrugModal} />
      <ActionButton label="Allergies" onClick={openAllergyModal} />
      <ActionButton label="Diagnosis" onClick={openDiagnosisModal} />
      <IssuePrescriptionButton />

      <Modal isOpen={isDrugModalOpen} onClose={closeDrugModal} title="Add Drugs">
        <SearchBar placeholder="Search for a drug..." onSearch={handleSearch} />
        {/* Add additional content here for drug selection */}
      </Modal>

      <Modal isOpen={isAllergyModalOpen} onClose={closeAllergyModal} title="Add Allergies">
        <SearchBar placeholder="Search for an allergy..." onSearch={handleSearch} />
        {/* Add additional content here for allergy selection */}
      </Modal>

      <Modal isOpen={isDiagnosisModalOpen} onClose={closeDiagnosisModal} title="Add Diagnosis">
        <SearchBar placeholder="Search for a diagnosis..." onSearch={handleSearch} />
        {/* Add additional content here for diagnosis selection */}
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
