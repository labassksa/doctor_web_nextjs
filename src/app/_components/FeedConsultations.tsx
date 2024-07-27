"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Consultation,
  ConsultationStatus,
  ConsultationType,
} from "../../models/consultation"; // Adjust the path as needed

interface FeedConsultationsProps {
  consultations: Consultation[];
}

const FeedConsultations: React.FC<FeedConsultationsProps> = ({ consultations }) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChatClick = (consultationId: number) => {
    router.push(`/chat/${consultationId}`);
  };

  return (
    <div className="bg-gray-100 h-screen">
      {consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="p-4 border rounded-md bg-white shadow-md cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">ID: {consultation.id}</div>
              {consultation.patient?.user.firstName && (
                <>
                  <span className="text-md font-semibold text-black">
                    {consultation.patient.user.firstName}{" "}
                    {consultation.patient.user.lastName}
                  </span>
                  <div className="text-md font-semibold text-black">
                    {consultation.patient.user.dateOfBirth} Years
                  </div>
                  <div
                    className={`ml-2 inline-block px-2 py-1 text-xs rounded-full text-black ${
                      consultation.patient.user.gender === "Male"
                        ? "bg-blue-200"
                        : "bg-pink-200"
                    }`}
                  >
                    {consultation.patient.user.gender}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">
                Paid at:{" "}
                {isClient
                  ? new Date(consultation.paidAT).toLocaleTimeString()
                  : "Loading..."}
              </span>
              {consultation.patientJoinedAT && (
                <span className="text-xs text-gray-500">
                  Patient Joined at:{" "}
                  {isClient
                    ? new Date(consultation.patientJoinedAT).toLocaleTimeString()
                    : "Loading..."}
                </span>
              )}
              {consultation.doctorJoinedAT && (
                <span className="text-xs text-gray-500">
                  Doctor Joined at:{" "}
                  {isClient
                    ? new Date(consultation.doctorJoinedAT).toLocaleTimeString()
                    : "Loading..."}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs flex space-x-2">
            {consultation.status === ConsultationStatus.Paid && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                Paid
              </span>
            )}
            {consultation.status === ConsultationStatus.Open && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Open
              </span>
            )}
          </div>
          <div className="mt-4">
            {consultation.status === ConsultationStatus.Paid && (
              <button className="px-4 py-2 bg-green-500 text-white rounded-full w-full">
                Accept
              </button>
            )}
            {consultation.status === ConsultationStatus.Open && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full w-full"
                onClick={() => handleChatClick(consultation.id)}
              >
                Chat
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedConsultations;
