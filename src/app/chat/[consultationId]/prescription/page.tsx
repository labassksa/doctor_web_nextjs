"use client";

import React, { useEffect, useState } from "react";
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
import ConfirmationModal from "../../_presc-components/confirmationModal";
import MessageModal from "./_components/messageModal";

const PrescriptionPage: React.FC = () => {
  const { consultationId } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugHit[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<DrugHit[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisHit[]>(
    []
  );
  const [currentSelection, setCurrentSelection] = useState<
    DrugHit | DiagnosisHit | null
  >(null);

  // New state to hold drug data
  const [drugs, setDrugs] = useState<DrugHit[]>([]);

  // State variables for loading, success, and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch("/api/drugs");
        const data: DrugHit[] = await response.json();
        setDrugs(data);
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    };

    fetchDrugs();
  }, []);

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

  const handleOpenConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmPrescription = async () => {
    const drugsToSend = selectedDrugs.map((drug) => ({
      drugName: drug["Trade Name"],
      activeIngredient: drug["Scientific Name"],
      strength: drug.Strength,
      pharmaceuticalForm: drug.PharmaceuticalForm,
      dose: drug.dose,
      doseUnit: drug.StrengthUnit, // Dynamically use StrengthUnit
      registrationNo: drug.RegisterNumber, // Dynamically use RegisterNumber
      route: drug.AdministrationRoute, // Dynamically use AdministrationRoute
      frequency: drug.frequency,
      indications: "Bacterial infection",
      duration: "7",
      durationUnit: "days",
      prn: false,
    }));
    const diagnoses = selectedDiagnosis.map(
      (diagnosis) => diagnosis.ascii_desc
    );
    const allergies = selectedAllergies.map((allergy) => allergy["Trade Name"]);

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await issueOrUpdatePrescription(
        Number(consultationId),
        drugsToSend,
        diagnoses,
        allergies
      );
      console.log("Prescription result:", result);
      setSuccessMessage("The prescription is issued and sent to the patient");
    } catch (error) {
      console.error("Error issuing prescription:", error);
      setErrorMessage(`Error issuing/updating the prescription ${error}`);
    } finally {
      setIsLoading(false);
      setConfirmationModalOpen(false);
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
          <span className="flex-grow break-words">{`${drug["Scientific Name"]} (${drug["Trade Name"]}) - ROUTE: ${drug.AdministrationRoute} STRENGTH: ${drug.Strength} ${drug.StrengthUnit}`}</span>
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

      {/* Render Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Issuing prescription ...</div>
        </div>
      )}

      {/* Render Success or Error Message Modal */}
      {(successMessage || errorMessage) && (
        <MessageModal
          isOpen={true}
          onClose={() => {
            setSuccessMessage("");
            setErrorMessage("");
          }}
          message={successMessage || errorMessage}
          isSuccess={!!successMessage}
        />
      )}
    </div>
  );
};

export default PrescriptionPage;
