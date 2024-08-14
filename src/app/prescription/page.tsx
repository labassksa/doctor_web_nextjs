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
import { DrugHit } from "../../utils/types/drugHit";
const PrescriptionPage: React.FC = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [selectedDrugs, setSelectedDrugs] = useState<DrugHit[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<DrugHit[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DrugHit[]>([]);
  const [currentSelection, setCurrentSelection] = useState<DrugHit | null>(
    null
  );

  const closeAllModals = () => setOpenModal(null);

  const openDrugModal = () => setOpenModal("drug");
  const openAllergyModal = () => setOpenModal("allergy");
  const openDiagnosisModal = () => setOpenModal("diagnosis");

  const handleSelect = (item: DrugHit) => setCurrentSelection(item);

  const handleAddDrug = (drug: DrugHit) => {
    setSelectedDrugs([...selectedDrugs, drug]);
    closeAllModals();
  };

  const handleAdd = () => {
    if (currentSelection) {
      if (openModal === "drug") {
        handleAddDrug(currentSelection);
      } else if (openModal === "allergy") {
        setSelectedAllergies([...selectedAllergies, currentSelection]);
        closeAllModals();
      } else if (openModal === "diagnosis") {
        setSelectedDiagnosis([...selectedDiagnosis, currentSelection]);
        closeAllModals();
      }
      setCurrentSelection(null);
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
          <div
            key={index}
            className="p-2 border rounded mt-2 text-black flex justify-between items-center"
          >
            <span>
              {drug.TradeName} - {drug.Strength} {drug.StrengthUnit}
            </span>
            <button
              onClick={() => handleRemoveDrug(index)}
              className="text-red-500 ml-4"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <ActionButton label="Allergies" onClick={openAllergyModal} />
      <div>
        {selectedAllergies.map((allergy, index) => (
          <div
            key={index}
            className="p-2 border rounded mt-2 text-black flex justify-between items-center"
          >
            <span>
              {allergy.TradeName} - {allergy.Strength} {allergy.StrengthUnit}
            </span>
            <button
              onClick={() => handleRemoveAllergy(index)}
              className="text-red-500 ml-4"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <ActionButton label="Diagnosis" onClick={openDiagnosisModal} />
      <div>
        {selectedDiagnosis.map((diagnosis, index) => (
          <div
            key={index}
            className="p-2 border rounded mt-2 text-black flex justify-between items-center"
          >
            <span>
              {diagnosis.TradeName} - {diagnosis.Strength}{" "}
              {diagnosis.StrengthUnit}
            </span>
            <button
              onClick={() => handleRemoveDiagnosis(index)}
              className="text-red-500 ml-4"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <IssuePrescriptionButton />

      <DrugModal
        isOpen={openModal === "drug"}
        onClose={closeAllModals}
        onAdd={handleAddDrug}
      />

      <Modal
        isOpen={openModal === "allergy"}
        onClose={closeAllModals}
        title="Add Allergies"
        onAdd={handleAdd}
      >
        <SearchBar
          placeholder="Search for an allergy..."
          onSelect={handleSelect}
          selectedItem={currentSelection}
          indexName="allergies"
        />
      </Modal>

      <Modal
        isOpen={openModal === "diagnosis"}
        onClose={closeAllModals}
        title="Add Diagnosis"
        onAdd={handleAdd}
      >
        <SearchBar
          placeholder="Search for a diagnosis..."
          onSelect={handleSelect}
          selectedItem={currentSelection}
          indexName="diagnosis"
        />
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
