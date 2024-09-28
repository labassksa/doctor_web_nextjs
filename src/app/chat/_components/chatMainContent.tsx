"use client";
import React, { useEffect, useRef } from "react";

interface Message {
  message?: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
}

interface ChatMainContentsProps {
  consultationId: number;
  messages: Message[];
}

const ChatMainContents: React.FC<ChatMainContentsProps> = ({
  consultationId,
  messages,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Retrieve the current userId from localStorage
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("labass_userId")
      : null;

  return (
    <div className="flex flex-col h-full bg-gray-100 text-black w-full mb-16 mt-24 ">
      <div
        className="flex-grow overflow-y-auto p-4 bg-gray-100 text-xs mt-0 w-full"
        dir="rtl"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            dir="rtl"
            className={`mb-2 p-2 rounded-lg max-w-xs w-auto ${
              message.senderId === Number(userId)
                ? "bg-custom-background"
                : "bg-white"
            }`}
          >
            {message.attachmentUrl ? (
              message.attachmentType === "images" ? (
                <img
                  src={message.attachmentUrl}
                  alt="attachment"
                  className="w-full h-auto mb-2 rounded"
                />
              ) : (
                <a
                  href={message.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Attachment
                </a>
              )
            ) : (
              <p>{message.message}</p>
            )}

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
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default ChatMainContents;
