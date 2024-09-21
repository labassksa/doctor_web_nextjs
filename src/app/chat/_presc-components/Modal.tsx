"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onAdd: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="z-50 flex items-center justify-center">
      <div className="fixed top-16 inset-0 bg-white w-full h-full overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 text-2xl">
              &times;
            </button>
          </div>
          <div className="h-[calc(100vh-120px)] overflow-y-auto">
            {children}
            <div className="flex justify-end m-4">
              <button
                onClick={onAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
