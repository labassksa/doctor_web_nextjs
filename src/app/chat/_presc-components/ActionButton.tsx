// components/ActionButton.tsx
"use client";
import React from "react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full sm:w-1/3 md:w-1/4 lg:w-1/6 px-3 py-2 mb-4 border border-blue-500 text-blue-500 rounded flex items-center justify-center text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      {label} <span className="ml-1 sm:ml-2 text-blue-500">+</span>
    </button>
  );
};

export default ActionButton;
