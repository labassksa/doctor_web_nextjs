"use client";

import React, { useState, useEffect } from "react";
import MyConsultations from "./_components/MyConsultationCards"; // Adjust the path as needed
import { fetchDoctorConsultations } from "./_controller/myconsultations"; // Correct import path
import { Consultation } from "../../models/consultation"; // Adjust the path as needed
import Sidebar from "../../components/sidebar/sidebar";
import FullScreenButtons from "../../components/common/actions";
import ChatMainContents from "../chat/_components/chatMainContent"; // Adjust the path as needed

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
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null); // Track selected consultation
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadConsultations = async () => {
      try {
        const fetchedConsultations = await fetchDoctorConsultations();
        setConsultations(fetchedConsultations);
      } catch (error) {
        console.error("Failed to load doctor consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, []);

  const handleConsultationClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    // Optionally, initialize messages or other details based on consultationId
  };

  if (loading) {
    return <div>Loading consultations...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-grow flex flex-col lg:flex-row h-screen">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 p-4 bg-white shadow-md z-10 lg:hidden">
          <h1 className="text-black font-semibold text-2xl text-center lg:text-4xl">
            My Consultations
          </h1>
        </div>

        <div className="flex flex-row flex-grow h-full">
          <div className="w-full sm:w-2/3 lg:w-1/3 text-black overflow-y-auto mt-16">
            <MyConsultations
              consultations={consultations}
              onConsultationClick={handleConsultationClick} // Pass the consultation click handler
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyDoctorConsultationsPage;
