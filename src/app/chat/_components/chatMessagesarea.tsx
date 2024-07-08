"use client";
import React, { useState } from "react";
import StickyMessageInput from "./chatInputarea";

interface Message {
  id: number;
  text: string;
  isSent: boolean;
  status: "pending" | "sent";
}

const ChatMainContents: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "سلام عليكم كيف الحال كيف استطيع مساعدتك",
      isSent: false,
      status: "pending", // Initial status
    },
    {
      id: 2,
      text: "سلام عليكم يا دكتور لدي وجع في المعده من يومين او اكثر",
      isSent: true,
      status: "sent", // Initial status
    },
  ]);

  const handleSendMessage = (messageText: string) => {
    console.log("Sending message:", messageText); // Debugging
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isSent: true,
      status: "pending",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // TODO: Send this message through WebSocket to the backend
    // Simulate backend confirmation
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 2000); // Simulate a delay for backend confirmation
  };

  return (
    <div className="flex flex-col h-full ">
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-100 text-sm"
        dir="rtl"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            dir="rtl"
            className={`mb-4 p-3 rounded-lg max-w-xs   ${
              message.isSent ? "bg-custom-background" : "bg-white"
            }`}
          >
            {message.text}
            <div className="text-right">
              <svg
                className={`w-4 h-4 mt-1 ${
                  message.status === "sent" ? "text-green-600" : "text-gray-500"
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
            </div>
          </div>
        ))}
      </div>
      <StickyMessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatMainContents;
