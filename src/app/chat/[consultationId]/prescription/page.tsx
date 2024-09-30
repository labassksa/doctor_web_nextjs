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

  // State variables for loading, success, and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAllModals = () => setOpenModal(null);

  const openDrugModal = () => setOpenModal("drug");
  const openAllergyModal = () => setOpenModal("allergy");
  const openDiagnosisModal = () => setOpenModal("diagnosis");

  const handleSelect = (item: DrugHit | DiagnosisHit) =>
    setCurrentSelection(item);

  const handleAddDrug = (drug: DrugHit) => {
    setSelectedDrugs([...selectedDrugs, drug]); // This now includes indications, dose, duration, etc.
    closeAllModals();
  };

  const handleConfirmPrescription = async () => {
    const drugs = selectedDrugs.map((drug) => ({
      drugName: drug["Trade Name"],
      activeIngredient: drug["Scientific Name"],
      strength: drug.Strength,
      pharmaceuticalForm: drug.PharmaceuticalForm,
      dose: drug.dose, // Use the dynamically entered dose from DrugModal
      doseUnit: drug.StrengthUnit, // Use the dynamically entered unit from DrugModal
      registrationNo: drug.RegisterNumber,
      route: drug.AdministrationRoute, // Use the dynamically entered route from DrugModal
      frequency: drug.frequency, // Use the dynamically entered frequency from DrugModal
      indications: drug.indications, // Use the dynamically entered indications from DrugModal
      duration: drug.duration, // Use the dynamically entered duration from DrugModal
      durationUnit: drug.durationUnit, // Use the dynamically entered duration unit from DrugModal
      prn: drug.prn, // Use the dynamically entered prn from DrugModal
    }));

    const diagnoses = selectedDiagnosis.map(
      (diagnosis) => diagnosis.ascii_desc
    );
    const allergies = selectedAllergies.map((allergy) => allergy["Trade Name"]);

    // Start loading
    setIsLoading(true);
    // Clear previous messages
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await issueOrUpdatePrescription(
        Number(consultationId),
        drugs,
        diagnoses,
        allergies
      );
      console.log("Prescription result:", result);
      // Set success message
      setSuccessMessage("The prescription is issued and sent to the patient");
    } catch (error) {
      console.error("Error issuing prescription:", error);
      // Set error message
      setErrorMessage(`Error issuing/updating the prescription: ${error}`);
    } finally {
      // Stop loading
      setIsLoading(false);
      // Close confirmation modal
      setConfirmationModalOpen(false);
    }
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

  // // Confirm prescription and send it to the server
  // const handleConfirmPrescription = async () => {
  //   const drugs = selectedDrugs.map((drug) => ({
  //     drugName: drug["Trade Name"], // Dynamic: Trade Name from selected drug
  //     activeIngredient: drug["Scientific Name"], // Dynamic: Scientific Name from selected drug
  //     strength: drug.Strength, // Dynamic: Strength from selected drug
  //     pharmaceuticalForm: drug.PharmaceuticalForm, // Dynamic: Pharmaceutical Form from selected drug
  //     dose: "1", // Keeping as hardcoded, change if needed
  //     doseUnit: drug.StrengthUnit, // Dynamic: Strength Unit from selected drug
  //     registrationNo: drug.RegisterNumber, // Dynamic: Register Number from selected drug
  //     route: drug.AdministrationRoute, // Dynamic: Administration Route from selected drug
  //     frequency: "3", // Keeping as hardcoded, change if needed
  //     indications: "Bacterial infection", // Keeping as hardcoded, change if needed
  //     duration: "7", // Keeping as hardcoded, change if needed
  //     durationUnit: "days", // Keeping as hardcoded, change if needed
  //     prn: false, // Keeping as hardcoded, change if needed
  //   }));

  //   const diagnoses = selectedDiagnosis.map(
  //     (diagnosis) => diagnosis.ascii_desc
  //   );
  //   const allergies = selectedAllergies.map((allergy) => allergy["Trade Name"]);

  //   // Start loading
  //   setIsLoading(true);
  //   // Clear previous messages
  //   setSuccessMessage("");
  //   setErrorMessage("");

  //   try {
  //     const result = await issueOrUpdatePrescription(
  //       Number(consultationId),
  //       drugs,
  //       diagnoses,
  //       allergies
  //     );
  //     console.log("Prescription result:", result);
  //     // Set success message
  //     setSuccessMessage("The prescription is issued and sent to the patient");
  //   } catch (error) {
  //     console.error("Error issuing prescription:", error);
  //     // Set error message
  //     setErrorMessage(`Error issuing/updating the prescription: ${error}`);
  //   } finally {
  //     // Stop loading
  //     setIsLoading(false);
  //     // Close confirmation modal
  //     setConfirmationModalOpen(false);
  //   }
  // };

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

      {/* Render Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">issuing prescription ...</div>
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
