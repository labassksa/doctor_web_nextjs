"use client";

import React, { useState } from "react";
import SearchBar from "./searchbar";
import { BaseItem } from "@algolia/autocomplete-core";
import { DrugHit } from "../../../utils/types/drugHit";
// Define the DrugModalProps interface
interface DrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drug: DrugHit) => void; // Use the custom DrugHit type
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
  const [durationUnit, setDurationUnit] = useState("");
  const [indications, setIndications] = useState("");
  const [orderInstructions, setOrderInstructions] = useState("");
  const [pharmaceuticalForm, setPharmaceuticalForm] = useState("");
  const [activeIngredients, setActiveIngredients] = useState("");
  const [strength, setStrength] = useState("");
  const [prn, setPrn] = useState(false);

  const handleSelect = (item: DrugHit) => {
    setCurrentSelection(item);
    setPharmaceuticalForm(item.PharmaceuticalForm || "");
    setActiveIngredients(item["Scientific Name"] || "");
    setStrength(item["Trade Name"] || "");
  };

  const handleAdd = () => {
    if (
      currentSelection &&
      dose &&
      unit &&
      route &&
      frequency &&
      duration &&
      durationUnit &&
      indications
    ) {
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
    <div>
      {/* Use Autocomplete here */}
      <SearchBar
        placeholder="Search for a drug..."
        onSelect={handleSelect}
        selectedItem={currentSelection}
        indexName="drugs" // Pass the index name here
      />
      <div className="mt-4 space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dose *
          </label>
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
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
          </select>
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
          </select>
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
          />
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <input
            type="text"
            value={orderInstructions}
            onChange={(e) => setOrderInstructions(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
    </div>
  );
};

export default DrugModal;
