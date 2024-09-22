// MessageModal.tsx
import React from "react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isSuccess: boolean;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  message,
  isSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80">
        <div
          className={`text-center mb-4 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
        <button
          onClick={onClose}
          className="bg-custom-green text-white px-4 py-2 rounded-full w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
