"use client";
import React, { useEffect } from "react";
import StickyMessageInput from "./chatInputarea";

interface Message {
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

interface ChatMainContentsProps {
  consultationId: number;
  showActions: boolean;
  messages: Message[];
  handleSendMessage: (messageText: string) => void;
}

const ChatMainContents: React.FC<ChatMainContentsProps> = ({
  consultationId,
  showActions,
  messages,
  handleSendMessage,
}) => {
  useEffect(() => {
    console.log("Consultation ID:", consultationId);
  }, [consultationId]);

  // Retrieve the current userId from localStorage
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("labass_userId")
      : null;

  return (
    <div className="flex flex-col h-full text-black relative">
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-100 text-sm mt-16"
        dir="rtl"
      >
        {messages.map((message, index) => (
          <div
            key={index} // Use index as key if no unique ID is provided
            dir="rtl"
            className={`mb-4 p-3 rounded-lg max-w-xs ${
              message.senderId === Number(userId)
                ? "bg-custom-background"
                : "bg-white"
            }`}
          >
            {message.message}

            {/* Only show checkmarks for the sender */}
            {message.senderId === Number(userId) && (
              <div className="text-right">
                {message.isSent && (
                  <svg
                    className={`w-4 h-4 mt-1 ${
                      message.read ? "text-green-600" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showActions && <StickyMessageInput onSendMessage={handleSendMessage} />}
    </div>
  );
};

export default ChatMainContents;
