"use client";

import React, { useState } from "react";
import TabComponent from "../../_presc-components/tabs";
import Title from "../../_presc-components/title";
import PatientInfo from "../../_presc-components/PatientInfo";
import ActionButton from "../../_presc-components/ActionButton";
import IssuePrescriptionButton from "../../_presc-components/IssuePrescriptionButton";
import DrugModal from "../../_presc-components/DrugModal";
import DiagnosisModal from "../../_presc-components/DiagnosisModal";
import Modal from "../../_presc-components/Modal";
import SearchBar from "../../_presc-components/searchbar";
import { DrugHit } from "../../../../utils/types/drugHit";
import { DiagnosisHit } from "../../../../utils/types/diagnosis";

const PrescriptionPage: React.FC = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugHit[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<DrugHit[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisHit[]>(
    []
  );
  const [currentSelection, setCurrentSelection] = useState<
    DrugHit | DiagnosisHit | null
  >(null);

  const closeAllModals = () => setOpenModal(null);

  const openDrugModal = () => setOpenModal("drug");
  const openAllergyModal = () => setOpenModal("allergy");
  const openDiagnosisModal = () => setOpenModal("diagnosis");

  const handleSelect = (item: DrugHit | DiagnosisHit) =>
    setCurrentSelection(item);

  const handleAddDrug = (drug: DrugHit) => {
    setSelectedDrugs([...selectedDrugs, drug]);
    closeAllModals();
  };

  const handleAddDiagnosis = (diagnosis: DiagnosisHit) => {
    setSelectedDiagnosis([...selectedDiagnosis, diagnosis]);
    closeAllModals();
  };

  const handleAdd = () => {
    if (currentSelection) {
      if (openModal === "drug") {
        handleAddDrug(currentSelection as DrugHit);
      } else if (openModal === "allergy") {
        setSelectedAllergies([
          ...selectedAllergies,
          currentSelection as DrugHit,
        ]);
        closeAllModals();
      } else if (openModal === "diagnosis") {
        handleAddDiagnosis(currentSelection as DiagnosisHit);
      }
      setCurrentSelection(null);
    }
  };

  const handleRemoveDrug = (index: number) => {
    const updatedDrugs = [...selectedDrugs];
    updatedDrugs.splice(index, 1);
    setSelectedDrugs(updatedDrugs);
  };

  const handleRemoveAllergy = (index: number) => {
    const updatedAllergies = [...selectedAllergies];
    updatedAllergies.splice(index, 1);
    setSelectedAllergies(updatedAllergies);
  };

  const handleRemoveDiagnosis = (index: number) => {
    const updatedDiagnosis = [...selectedDiagnosis];
    updatedDiagnosis.splice(index, 1);
    setSelectedDiagnosis(updatedDiagnosis);
  };

  return (
    <div className="pt-20 flex-grow p-4 sm:p-6 lg:p-8 text-black relative">
      {/* The padding-top (pt-20) accounts for the height of the fixed TabComponent */}
      <TabComponent />
      <Title />
      <PatientInfo />

      {/* Drug Section */}
      <ActionButton label="Drugs" onClick={openDrugModal} />
      {selectedDrugs.map((drug, index) => (
        <div
          key={index}
          className="p-2 border rounded mt-2 text-black flex justify-between items-center text-sm sm:text-base"
        >
          <span className="flex-grow break-words">{`${drug["Scientific Name"]} (${drug["Trade Name"]}) - ${drug.Strength} ${drug.StrengthUnit}`}</span>
          <button
            onClick={() => handleRemoveDrug(index)}
            className="text-red-500 ml-4 flex-shrink-0"
          >
            &times;
          </button>
        </div>
      ))}

      {/* Allergy Section */}
      <ActionButton label="Allergies" onClick={openAllergyModal} />
      {selectedAllergies.map((allergy, index) => (
        <div
          key={index}
          className="p-2 border rounded mt-2 text-black flex justify-between items-center text-sm sm:text-base"
        >
          <span className="flex-grow break-words">{`${allergy.TradeName} - ${allergy.Strength} ${allergy.StrengthUnit}`}</span>
          <button
            onClick={() => handleRemoveAllergy(index)}
            className="text-red-500 ml-4 flex-shrink-0"
          >
            &times;
          </button>
        </div>
      ))}

      {/* Diagnosis Section */}
      <ActionButton label="Diagnosis" onClick={openDiagnosisModal} />
      {selectedDiagnosis.map((diagnosis, index) => (
        <div
          key={index}
          className="p-2 border rounded mt-2 text-black flex justify-between items-center text-sm sm:text-base"
        >
          <span className="flex-grow break-words">{`${diagnosis.ascii_desc} (${diagnosis.ascii_short_desc})`}</span>
          <button
            onClick={() => handleRemoveDiagnosis(index)}
            className="text-red-500 ml-4 flex-shrink-0"
          >
            &times;
          </button>
        </div>
      ))}

      <IssuePrescriptionButton />

      {/* Modals */}
      <DrugModal
        isOpen={openModal === "drug"}
        onClose={closeAllModals}
        onAdd={handleAddDrug}
      />

      <DiagnosisModal
        isOpen={openModal === "diagnosis"}
        onClose={closeAllModals}
        onAdd={handleAddDiagnosis}
      />

      {/* Allergy Modal as an example */}
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
    </div>
  );
};

export default PrescriptionPage;
