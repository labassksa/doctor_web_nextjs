"use client";
import React from "react";

const FullScreenButtons: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full ">
      {/* Top Blue Section */}
      <div className="flex-grow bg-white  "></div>

      {/* Buttons Section */}
      <div className="bg-white   ">
        <div className="flex flex-col items-center space-y-4 w-full  text-xs font-bold p-4 mb-24">
          <button className="w-full max-w-md px-4 py-2 bg-black text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Create Prescription
          </button>
          <button className="w-full max-w-md px-4 py-2 bg-black text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            Create SOAP
          </button>
          <button className="w-full max-w-md px-4 py-2 bg-black text-white rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
            Create Sick Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenButtons;
