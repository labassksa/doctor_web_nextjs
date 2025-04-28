"use client";

import { LabTestHit } from "@/utils/types/labTestHit";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDrugs: any[];
  selectedAllergies: any[];
  selectedDiagnosis: any[];
  selectedLabTests: LabTestHit[]
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDrugs,
  selectedAllergies,
  selectedDiagnosis,
  selectedLabTests,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-2">
      <div className="bg-white p-6 rounded-lg w-full sm:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 m-2">Confirm Prescription</h2>

        {/* Scrollable section with numbered list for drugs */}
        <div className="max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 m-2">Selected Drugs</h3>
          {selectedDrugs.length > 0 ? (
            <ol className="list-decimal list-inside m-2">
              {selectedDrugs.map((drug, index) => (
                <li
                  key={index}
                  className="text-xs mb-2"
                >{`${drug["Scientific Name"]} (${drug["Trade Name"]}) - strengthUnit: ${drug.StrengthUnit}`}</li>
              ))}
            </ol>
          ) : (
            <p className="mb-4 text-xs">No drugs selected.</p>
          )}

          {/* Numbered list for allergies */}
          <h3 className="text-sm font-semibold mb-2 m-2">Selected Allergies</h3>
          {selectedAllergies.length > 0 ? (
            <ol className="list-decimal list-inside m-2">
              {selectedAllergies.map((allergy, index) => (
                <li key={index} className="text-xs mb-2">
                  {allergy["Trade Name"]}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mb-4 text-xs">No allergies selected.</p>
          )}

          {/* Numbered list for diagnoses */}
          <h3 className="text-sm font-semibold mb-2 m-2">Selected Diagnoses</h3>
          {selectedDiagnosis.length > 0 ? (
            <ol className="list-decimal list-inside m-2">
              {selectedDiagnosis.map((diagnosis, index) => (
                <li key={index} className="text-xs mb-2">
                  {diagnosis.ascii_desc}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mb-4 text-xs">No diagnoses selected.</p>
          )}

          <h3 className="text-sm font-semibold mb-2 m-2">Selected Lab Tests</h3>
          {selectedLabTests.length > 0 ? (
            <ol className="list-decimal list-inside m-2">
              {selectedLabTests.map((labTest, index) => (
                <li key={index} className="text-xs mb-2">
                  {labTest.test_name} - {labTest.code}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mb-4 text-xs">No lab tests selected.</p>
          )}
        </div>

        {/* Buttons */}
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
