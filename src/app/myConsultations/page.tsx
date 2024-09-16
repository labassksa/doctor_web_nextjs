"use client";

import React, { useState, useEffect } from "react";
import MyConsultations from "./_components/MyConsultationCards"; // Adjust the path as needed
import { fetchDoctorConsultations } from "./_controller/myconsultations"; // Correct import path
import { Consultation } from "../../models/consultation"; // Adjust the path as needed
import Sidebar from "../../components/sidebar/sidebar";
import FullScreenButtons from "../../components/common/actions";
import ChatMainContents from "../chat/_components/chatMainContent";
import useSocket from "../../socket.io/socket.io.initialization"; // Adjust the path as needed

interface Message {
  id: number;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const MyDoctorConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState<
    number | null
  >(null); // Store selected consultationId

  const socket = useSocket("http://localhost:3000"); // Replace with your backend URL

  useEffect(() => {
    const loadConsultations = async () => {
      try {
        const fetchedConsultations = await fetchDoctorConsultations(); // Use the function here
        setConsultations(fetchedConsultations);
      } catch (error) {
        console.error("Failed to load doctor consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, []);

  if (loading) {
    return <div>Loading consultations...</div>;
  }

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      message: messageText,
      senderId: 1,
      consultationId: 3,
      isSent: true,
      read: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate backend confirmation
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, isSent: true } : msg
        )
      );
    }, 2000);
  };

  // Handle consultation click and set the selected consultationId
  const handleConsultationClick = (consultationId: number) => {
    setSelectedConsultationId(consultationId);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex flex-col w-full">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 p-4 bg-white shadow-md z-10 lg:hidden">
          <h1 className="text-black font-semibold text-2xl text-center lg:text-4xl">
            My Consultations
          </h1>
        </div>

        {/* Mobile only: show only the consultations list */}
        <div className="flex flex-row flex-grow h-full mt-16 lg:mt-0">
          <div className="w-full lg:w-1/3 text-black overflow-y-auto">
            <MyConsultations
              consultations={consultations}
              onConsultationClick={handleConsultationClick} // Pass the click handler to MyConsultations
            />
          </div>

          {/* Only show chat and buttons on larger screens */}
          <div className="hidden lg:flex flex-col w-1/2 h-full text-black">
            {selectedConsultationId && (
              <>
                <div className="bg-green-100">Header</div>
                <ChatMainContents
                  consultationId={selectedConsultationId}
                  showActions={false}
                  messages={messages}
                  handleSendMessage={handleSendMessage}
                />
              </>
            )}
          </div>
          <div className="hidden lg:block w-1/6 h-full">
            <FullScreenButtons />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyDoctorConsultationsPage;
