"use client";
import React from "react";

const PatientInfo: React.FC = () => {
  return (
    <div className="p-4 w-1/2 border rounded-md mb-4 bg-white shadow-md flex justify-between items-center">
      <div>
        <h1  className="text-xl font-semibold text-gray-500">
Patient Information
        </h1>
        <h2 className="text-lg font-semibold">Ahmed Ali</h2>
        <p>Age: 26 Years</p>
        <p>Male</p>
        <p>Mobile#: +966591717024</p>
      </div>
      <div className="text-right">
        <p className="text-green-500">Patient joined at: 10:24 AM</p>
        <p className="text-green-500">Doctor joined at: 10:22 AM</p>
      </div>
    </div>
  );
};

export default PatientInfo;
