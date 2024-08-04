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
import SearchBar from "./_components/searchbar"; // Correct import casing
import { BaseItem } from "@algolia/autocomplete-core";

const PrescriptionPage: React.FC = () => {
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);

  // Define the DrugHit interface for Algolia search results
  interface DrugHit extends BaseItem {
    objectID: string;
    RegisterNumber: string;
    OldRegisterNumber: string;
    ProductType: string;
    DrugType: string;
    SubType: string;
    "Scientific Name": string; // Property with space
    "Trade Name": string;
    Strength: string;
    StrengthUnit: string;
    PharmaceuticalForm: string;
    AdministrationRoute: string;
    AtcCode1: string;
    AtcCode2: string;
    Size: string;
    SizeUnit: string;
    PackageTypes: string;
    PackageSize: string;
    LegalStatus: string;
    ProductControl: string;
    DistributeArea: string;
    PublicPrice: string;
    ShelfLife: string;
    StorageConditions: string;
    StorageConditionArabic: string;
    MarketingCompany: string;
    MarketingCountry: string;
    ManufactureName: string;
    ManufactureCountry: string;
    SecondaryPackageManufacture: string;
    MainAgent: string;
    SecondAgent: string;
    ThirdAgent: string;
    DescriptionCode: string;
    AuthorizationStatus: string;
    [key: string]: any; // Index signature to handle any additional fields
  }
  const [selectedDrugs, setSelectedDrugs] = useState<DrugHit[]>([]); // Correctly type state
  const [selectedAllergies, setSelectedAllergies] = useState<DrugHit[]>([]); // Assuming similar type
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DrugHit[]>([]); // Assuming similar type

  const [currentSelection, setCurrentSelection] = useState<DrugHit | null>(
    null
  ); // Correctly type state

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

  const handleSelect = (item: DrugHit) => {
    setCurrentSelection(item);
  };

  const handleAddDrug = (drug: DrugHit) => {
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
          <div
            key={index}
            className="p-2 border rounded mt-2 text-black flex justify-between items-center"
          >
            <span>
              {drug.code} - {drug.description}
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
              {allergy.code} - {allergy.description}
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
              {diagnosis.code} - {diagnosis.description}
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
          onSelect={handleSelect}
          selectedItem={currentSelection}
          indexName="allergies" // Specify the correct index name
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
          onSelect={handleSelect}
          selectedItem={currentSelection}
          indexName="diagnosis" // Specify the correct index name
        />
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
