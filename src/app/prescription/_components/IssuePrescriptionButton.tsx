"use client";
import React from "react";

const IssuePrescriptionButton: React.FC = () => {
  return (
    <div className="flex  justify-center">
      <button className="w-1/2  p-2 text-white bg-green-500 rounded mt-8">
        Issue Prescription
      </button>
    </div>
  );
};

export default IssuePrescriptionButton;
