"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
import { issueOrUpdatePrescription } from "./_controllers/issueOrUpdatePrescription";
import ConfirmationModal from "../../_presc-components/confirmationModal"; // Import the new confirmation modal

const PrescriptionPage: React.FC = () => {
  const { consultationId } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // State for confirmation modal
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

  const handleAddAllergy = (allergy: DrugHit) => {
    setSelectedAllergies([...selectedAllergies, allergy]);
    closeAllModals();
  };

  const handleAdd = () => {
    if (currentSelection) {
      if (openModal === "drug") {
        handleAddDrug(currentSelection as DrugHit);
      } else if (openModal === "allergy") {
        handleAddAllergy(currentSelection as DrugHit);
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

  // Open the confirmation modal
  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  // Confirm prescription and send it to the server
  const handleConfirmPrescription = async () => {
    const drugs = selectedDrugs.map((drug) => ({
      drugName: drug["Trade Name"],
      activeIngredient: drug["Scientific Name"],
      strength: drug.Strength,
      pharmaceuticalForm: "Capsule",
      dose: "1",
      doseUnit: "Capsule",
      registrationNo: "XYZ-1234",
      route: "Oral",
      frequency: "3",
      indications: "Bacterial infection",
      duration: "7",
      durationUnit: "days",
      prn: false,
    }));
    const diagnoses = selectedDiagnosis.map(
      (diagnosis) => diagnosis.ascii_desc
    );
    const allergies = selectedAllergies.map((allergy) => allergy["Trade Name"]);

    try {
      const result = await issueOrUpdatePrescription(
        Number(consultationId),
        drugs,
        diagnoses,
        allergies
      );
      console.log("Prescription result:", result);
    } catch (error) {
      console.error("Error issuing prescription:", error);
    } finally {
      setConfirmationModalOpen(false); // Close confirmation modal after issuing
    }
  };

  return (
    <div className="pt-20 flex-grow p-4 sm:p-6 lg:p-8 text-black relative">
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
          <span className="flex-grow break-words">{`${drug["Scientific Name"]} (${drug["Trade Name"]}) - ROUTE: ${drug.AdministrationRoute} STRENGTHUNIT: ${drug.StrengthUnit}`}</span>
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

      <IssuePrescriptionButton onClick={handleOpenConfirmationModal} />

      {/* New Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmPrescription}
        selectedDrugs={selectedDrugs}
        selectedAllergies={selectedAllergies}
        selectedDiagnosis={selectedDiagnosis}
      />

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
