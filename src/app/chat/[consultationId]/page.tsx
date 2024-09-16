"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Import necessary hooks from next/navigation
import Header from "../_components/header"; // Adjust path as needed
import ChatMainContents from "../_components/chatMainContent"; // Adjust path as needed
import useSocket from "../../../socket.io/socket.io.initialization"; // Adjust path as needed
import TabComponent from "../_presc-components/tabs";

interface Message {
  id?: string; // Optional ID since it is created in the backend
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter(); // Use router for redirection if needed
  const params = useParams(); // Extract the dynamic params from the URL
  const consultationId = params?.consultationId; // Get consultationId from the params

  console.log(`Consultation ID in page: ${consultationId}`);

  // Retrieve JWT token and userId from local storage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("labass_token") : null;
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("labass_userId")
      : null;

  console.log(`User ID: ${userId}`);

  // Initialize socket outside of the conditional logic
  const { socket, isConnected } = useSocket("http://localhost:4000", token || ""); // Replace with your backend URL

  // Redirect to login if token, userId, or consultationId is missing
  useEffect(() => {
    if (!token || !userId || !consultationId) {
      router.push("/login");
    }
  }, [token, userId, consultationId, router]);

  useEffect(() => {
    if (!socket || !userId || !consultationId) return;

    // Join the room dynamically based on consultationId
    socket.emit("joinRoom", { room: `${consultationId}` });

    // Load previous messages from the server (adjust the backend to support this)
    socket.emit(
      "loadMessages",
      { consultationId },
      (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
      }
    );

    // Handle new messages received via socket
    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup: Remove socket listener when component unmounts
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userId, consultationId]);

  const handleSendMessage = (messageText: string) => {
    if (!isConnected || !socket || !userId) {
      console.error(
        "Socket is not connected or userId is missing. Message cannot be sent."
      );
      return;
    }

    // Prepare the message data to send without a message ID
    const newMessage: Message = {
      message: messageText,
      senderId: Number(userId), // Send userId
      consultationId: Number(consultationId), // Send consultationId
      isSent: false,
      read: false,
    };

    // Optimistically update the UI by adding the message locally
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send the message via socket
    socket.emit(
      "sendMessage",
      newMessage, // Message data without an ID
      (response: { messageId: string }) => {
        // Update the message with the correct ID from the backend
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg === newMessage
              ? { ...msg, id: response.messageId, isSent: true }
              : msg
          )
        );
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <TabComponent />

      <Header title="استشارة فورية" showBackButton={true} />
      {consultationId && (
        <ChatMainContents
          consultationId={Number(consultationId)} // Pass consultationId to ChatMainContents
          showActions={true}
          messages={messages}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default ChatPage;
