"use client";

import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDrugs: any[];
  selectedAllergies: any[];
  selectedDiagnosis: any[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDrugs,
  selectedAllergies,
  selectedDiagnosis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-2">
      <div className="bg-white p-6 rounded-lg w-full sm:w-1/2 lg:w-1/3">
        <h2 className="text-lg font-semibold mb-4 m-2">Confirm Prescription</h2>

        <h3 className="text-sm font-semibold mb-2 m-2">Selected Drugs</h3>
        {selectedDrugs.length > 0 ? (
          selectedDrugs.map((drug, index) => (
            <p
              key={index}
              className="mb-2 text-xs"
            >{`${drug["Scientific Name"]} (${drug["Trade Name"]}) - ${drug.Strength} ${drug.StrengthUnit}`}</p>
          ))
        ) : (
          <p className="mb-2">No drugs selected.</p>
        )}

        <h3 className="text-sm font-semibold  mb-2 ">Selected Allergies</h3>
        {selectedAllergies.length > 0 ? (
          selectedAllergies.map((allergy, index) => (
            <p key={index} className="m-2 text-xs">
              {allergy["Trade Name"]}
            </p>
          ))
        ) : (
          <p className="mb-4 text-xs">No allergies selected.</p>
        )}

        <h3 className="text-sm font-semibold mb-4 ">Selected Diagnoses</h3>
        {selectedDiagnosis.length > 0 ? (
          selectedDiagnosis.map((diagnosis, index) => (
            <p key={index} className="m-2">
              {diagnosis.ascii_desc}
            </p>
          ))
        ) : (
          <p className="mb-4 text-xs">No diagnoses selected.</p>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 m-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 m-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
