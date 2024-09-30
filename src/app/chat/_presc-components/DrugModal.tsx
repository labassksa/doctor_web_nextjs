"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import SearchBar from "./searchbar";
import { DrugHit } from "../../../utils/types/drugHit";

interface DrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drug: DrugHit) => void;
}

const DrugModal: React.FC<DrugModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [currentSelection, setCurrentSelection] = useState<DrugHit | null>(
    null
  );
  const [dose, setDose] = useState("");
  const [unit, setUnit] = useState("");
  const [route, setRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("days");
  const [indications, setIndications] = useState("");
  const [orderInstructions, setOrderInstructions] = useState("");
  const [pharmaceuticalForm, setPharmaceuticalForm] = useState("");
  const [activeIngredients, setActiveIngredients] = useState("");
  const [strength, setStrength] = useState("");
  const [prn, setPrn] = useState(false);

  // Error state for required fields
  const [errors, setErrors] = useState({
    dose: false,
    unit: false,
    route: false,
    frequency: false,
    duration: false,
    indications: false,
  });

  const handleSelect = (item: DrugHit) => {
    setCurrentSelection(item);
    setPharmaceuticalForm(item.PharmaceuticalForm || "");
    setActiveIngredients(item["Scientific Name"] || "");
    setStrength(item.Strength || "");
    setRoute(item.AdministrationRoute || "");
    setUnit(item.StrengthUnit || "");
  };

  const handleAdd = () => {
    const newErrors = {
      dose: !dose,
      unit: !unit,
      route: !route,
      frequency: !frequency,
      duration: !duration,
      indications: !indications,
    };

    setErrors(newErrors);

    // Prevent submission if any error exists
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (currentSelection) {
      const newDrug = {
        ...currentSelection,
        dose,
        unit,
        route,
        frequency,
        duration,
        durationUnit,
        indications,
        orderInstructions,
        pharmaceuticalForm,
        activeIngredients,
        strength,
        prn,
      };
      onAdd(newDrug);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Drug" onAdd={handleAdd}>
      <SearchBar
        placeholder="Search for a drug..."
        onSelect={(item) => {
          if ("RegisterNumber" in item) {
            handleSelect(item as DrugHit);
          }
        }}
        selectedItem={currentSelection}
        indexName="drugs"
      />
      <div className="mt-4 space-y-4">
        {/* Auto-populated fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pharmaceutical Form
          </label>
          <input
            type="text"
            value={pharmaceuticalForm}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Strength
          </label>
          <input
            type="text"
            value={strength}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Active Ingredients
          </label>
          <input
            type="text"
            value={activeIngredients}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>

        {/* Required fields with validation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dose *
          </label>
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter dose"
          />
          {errors.dose && (
            <p className="text-red-500 text-sm">Dose is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit *
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Drug Unit</option>
            <option value="mg">mg</option>
            <option value="ml">ml</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="IU">IU</option>
            <option value="gm">gm</option>
            <option value="DF">DF</option>
            <option value="dose">dose</option>

            {/* Dynamically add populated value if it doesn't match predefined options */}
            {unit &&
              !["mg", "ml", "g", "l", "IU", "gm", "DF", "dose"].includes(
                unit
              ) && <option value={unit}>{unit}</option>}
          </select>
          {errors.unit && (
            <p className="text-red-500 text-sm">Unit is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Route *
          </label>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Drug Route</option>
            <option value="oral">Oral</option>
            <option value="iv">IV</option>

            {/* Dynamically add populated value if it doesn't match predefined options */}
            {route && !["oral", "iv"].includes(route) && (
              <option value={route}>{route}</option>
            )}
          </select>
          {errors.route && (
            <p className="text-red-500 text-sm">Route is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Frequency *
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Drug Frequency</option>
            <option value="once daily">Once daily</option>
            <option value="twice daily">Twice daily</option>
            <option value="three times daily">3 Times daily</option>
            <option value="four times daily">4 Times daily</option>
            <option value="once weekly">Once weekly</option>
            <option value="twice weekly">Twice weekly</option>
            <option value="every 2 hours">Every 2 hours</option>
            <option value="as needed">As needed</option>
            <option value="at evening">At evening</option>
          </select>
          {errors.frequency && (
            <p className="text-red-500 text-sm">Frequency is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration *
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter duration"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm">Duration is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration Unit *
          </label>
          <select
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Duration Unit</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Indications *
          </label>
          <input
            type="text"
            value={indications}
            onChange={(e) => setIndications(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter indications"
          />
          {errors.indications && (
            <p className="text-red-500 text-sm">Indications are required</p>
          )}
        </div>

        {/* Optional fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <input
            type="text"
            value={orderInstructions}
            onChange={(e) => setOrderInstructions(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter order instructions"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={prn}
            onChange={() => setPrn(!prn)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            PRN
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default DrugModal;
