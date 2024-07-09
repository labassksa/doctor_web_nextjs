// components/Modal.tsx
"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;  // Accept children
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
