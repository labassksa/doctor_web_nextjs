"use client";
import React, { useState, useRef } from "react";

interface StickyMessageInputProps {
  onSendMessage: (messageText: string) => void;
}

const StickyMessageInput: React.FC<StickyMessageInputProps> = ({
  onSendMessage,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage(""); // Clear input after sending
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white p-4 flex items-center border-t">
      {/* Message Input */}
      <input
        ref={inputRef}
        type="text"
        dir="rtl"
        placeholder="اكتب رسالة..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border rounded-full outline-none text-sm"
        onFocus={handleFocus}
        onBlur={() => setInputFocused(false)}
      />

      {/* Send Button */}
      <button
        className={`p-2 ${inputFocused ? "text-green-500" : "text-gray-500"}`}
        onClick={handleSend}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M2.5 12.5L21.5 3.5L14.5 12.5L21.5 21.5L2.5 12.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default StickyMessageInput;
