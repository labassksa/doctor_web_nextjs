"use client";
import React from "react";

interface IssuePrescriptionButtonProps {
  onClick: () => void;
}

const IssuePrescriptionButton: React.FC<IssuePrescriptionButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 px-4 py-3 text-white bg-green-500 rounded mt-8 text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Issue Prescription
      </button>
    </div>
  );
};

export default IssuePrescriptionButton;
