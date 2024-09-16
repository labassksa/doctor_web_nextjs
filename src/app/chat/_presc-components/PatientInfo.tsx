// components/PatientInfo.tsx
"use client";
import React from "react";

const PatientInfo: React.FC = () => {
  return (
    <div className="p-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border rounded-md mb-4 bg-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-500">
          Patient Information
        </h1>
        <h2 className="text-base sm:text-lg font-semibold">Ahmed Ali</h2>
        <p className="text-sm sm:text-base">Age: 26 Years</p>
        <p className="text-sm sm:text-base">Male</p>
        <p className="text-sm sm:text-base">Mobile#: +966591717024</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm sm:text-base text-green-500">
          Patient joined at: 10:24 AM
        </p>
        <p className="text-sm sm:text-base text-green-500">
          Doctor joined at: 10:22 AM
        </p>
      </div>
    </div>
  );
};

export default PatientInfo;
