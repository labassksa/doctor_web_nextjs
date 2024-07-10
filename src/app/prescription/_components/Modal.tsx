// components/Modal.tsx
"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // Accept children
  onAdd: () => void; // Add this prop for the add button
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl"> {/* Adjusted the width */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>
        {children}
        <div className="flex justify-end mt-4">
          <button 
            onClick={onAdd} 
            className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
