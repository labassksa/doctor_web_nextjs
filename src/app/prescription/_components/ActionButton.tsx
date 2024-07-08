"use client";
import React from "react";

interface ActionButtonProps {
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label }) => {
  return (
    <button className="w-full px-4 py-2 mb-4 border border-blue-500 text-blue-500 rounded flex items-center justify-center">
      {label} <span className="ml-2 text-blue-500">+</span>
    </button>
  );
};

export default ActionButton;
