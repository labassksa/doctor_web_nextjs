"use client";
import React, { useEffect } from "react";
import StickyMessageInput from "./chatInputarea";

interface Message {
  id: number;
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
  messages.forEach((message) => {
    console.log(`The isSent inside chatMainContents${message.isSent}`);
  });
  useEffect(() => {
    console.log("Consultation ID:", consultationId);
    // Fetch and load messages for the given consultationId here
  }, [consultationId]);

  const userId = 1; // Example userId for doctor, adjust as needed

  return (
    <div className="flex flex-col h-full text-black relative">
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-100 text-sm mt-16"
        dir="rtl"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            dir="rtl"
            className={`mb-4 p-3 rounded-lg max-w-xs ${
              message.senderId === userId ? "bg-custom-background" : "bg-white"
            }`}
          >
            {message.message}
            {message.senderId === userId && ( // Only show checkmarks for the sender
              <div className="text-right">
                {message.isSent && ( // Show grey checkmark for sent messages
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
      <StickyMessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatMainContents;
