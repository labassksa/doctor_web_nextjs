// PrescriptionPage.tsx
"use client";
import React, { useState } from "react";
import TabComponent from "./_components/tabs";
import Title from "./_components/title";
import PatientInfo from "./_components/PatientInfo";
import ActionButton from "./_components/ActionButton";
import IssuePrescriptionButton from "./_components/IssuePrescriptionButton";
import DrugModal from "./_components/DrugModal";
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

  const handleAddDrug = (drug: any) => {
    setSelectedDrugs([...selectedDrugs, drug]);
    closeDrugModal();
  };

  const handleAdd = () => {
    if (currentSelection) {
      if (isDrugModalOpen) {
        handleAddDrug(currentSelection);
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

  const handleRemoveDrug = (index: number) => {
    const newDrugs = [...selectedDrugs];
    newDrugs.splice(index, 1);
    setSelectedDrugs(newDrugs);
  };

  const handleRemoveAllergy = (index: number) => {
    const newAllergies = [...selectedAllergies];
    newAllergies.splice(index, 1);
    setSelectedAllergies(newAllergies);
  };

  const handleRemoveDiagnosis = (index: number) => {
    const newDiagnosis = [...selectedDiagnosis];
    newDiagnosis.splice(index, 1);
    setSelectedDiagnosis(newDiagnosis);
  };

  return (
    <div className="flex-grow p-8 text-black">
      <TabComponent />
      <Title />
      <PatientInfo />

      <ActionButton label="Drugs" onClick={openDrugModal} />
      <div>
        {selectedDrugs.map((drug, index) => (
          <div key={index} className="p-2 border rounded mt-2 text-black flex justify-between items-center">
            <span>{drug.code} - {drug.description}</span>
            <button onClick={() => handleRemoveDrug(index)} className="text-red-500 ml-4">&times;</button>
          </div>
        ))}
      </div>

      <ActionButton label="Allergies" onClick={openAllergyModal} />
      <div>
        {selectedAllergies.map((allergy, index) => (
          <div key={index} className="p-2 border rounded mt-2 text-black flex justify-between items-center">
            <span>{allergy.code} - {allergy.description}</span>
            <button onClick={() => handleRemoveAllergy(index)} className="text-red-500 ml-4">&times;</button>
          </div>
        ))}
      </div>

      <ActionButton label="Diagnosis" onClick={openDiagnosisModal} />
      <div>
        {selectedDiagnosis.map((diagnosis, index) => (
          <div key={index} className="p-2 border rounded mt-2 text-black flex justify-between items-center">
            <span>{diagnosis.code} - {diagnosis.description}</span>
            <button onClick={() => handleRemoveDiagnosis(index)} className="text-red-500 ml-4">&times;</button>
          </div>
        ))}
      </div>

      <IssuePrescriptionButton />

      <DrugModal
        isOpen={isDrugModalOpen}
        onClose={closeDrugModal}
        onAdd={handleAddDrug}
      />

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
          selectedItem={currentSelection}
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
          selectedItem={currentSelection}
        />
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
