"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation within Next.js
import { Consultation, ConsultationStatus } from "../../models/consultation"; // Adjust the path to your consultation model

interface FeedConsultationsProps {
  consultations: Consultation[];
  onAccept: (consultationId: number) => void; // Add the onAccept prop for consultation acceptance
  acceptLoading: boolean; // Add loading state for acceptance
}

const FeedConsultations: React.FC<FeedConsultationsProps> = ({
  consultations,
  onAccept,
  acceptLoading,
}) => {
  const router = useRouter();
  const [loadingConsultationId, setLoadingConsultationId] = useState<
    number | null
  >(null); // Track which consultation is being accepted

  const handleChatClick = (consultationId: number) => {
    console.log(`consultation id onClick: ${consultationId} `);
    router.push(`/chat/${consultationId}`); // Navigate to the chat page for the consultation
  };

  const handleAcceptClick = async (consultationId: number) => {
    setLoadingConsultationId(consultationId); // Set loading state for the specific consultation
    try {
      await onAccept(consultationId); // Trigger the onAccept function
    } finally {
      setLoadingConsultationId(null); // Clear loading state after accept attempt
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen space-y-4 p-4">
      {consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="p-6 border rounded-lg bg-white shadow-lg w-full mx-0 sm:mx-auto mb-4"
        >
          <div className="flex flex-wrap lg:flex-nowrap justify-between">
            {/* Patient Info Section */}
            <div className="w-full lg:w-1/2 pr-0 lg:pr-4 mb-4 lg:mb-0">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Patient Info
              </h2>
              {consultation.patient?.user?.firstName ? (
                <>
                  <div className="text-xs text-gray-500">
                    Name:{" "}
                    <span className="text-black">
                      {consultation.patient.user.firstName}{" "}
                      {consultation.patient.user.lastName || ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Age:{" "}
                    <span className="text-black">
                      {consultation.patient.user.dateOfBirth
                        ? `${
                            new Date().getFullYear() -
                            new Date(
                              consultation.patient.user.dateOfBirth
                            ).getFullYear()
                          } Years`
                        : "N/A"}
                    </span>
                  </div>
                  <div
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full text-black ${
                      consultation.patient.user.gender === "Male"
                        ? "bg-blue-200"
                        : consultation.patient.user.gender === "Female"
                        ? "bg-pink-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {consultation.patient.user.gender || "Unknown Gender"}
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-500">
                  Patient is filling their info.
                </div>
              )}
            </div>

            {/* Consultation Details Section */}
            <div className="w-full lg:w-1/2 lg:pl-4 lg:border-l border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Consultation Details
              </h2>
              <div className="text-xs text-gray-500">
                Consultation ID:{" "}
                <span className="text-black">{consultation.id}</span>
              </div>
              <div className="text-xs m-1 text-gray-500">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    consultation.status === ConsultationStatus.Open
                      ? "bg-blue-100 text-blue-700"
                      : consultation.status === ConsultationStatus.Paid
                      ? "bg-green-100 text-green-700"
                      : consultation.status === ConsultationStatus.Closed
                      ? "bg-gray-200 text-gray-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {consultation.status}
                </span>
              </div>

              {/* Date Information */}
              <div className="mt-2">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Date Information
                </h2>
                <div className="text-xs text-gray-500">
                  Paid at:{" "}
                  <span className="text-black">
                    {new Date(consultation.paidAT).toLocaleString()}
                  </span>
                </div>
                {consultation.patientJoinedAT && (
                  <div className="text-xs text-gray-500">
                    Patient Joined at:{" "}
                    <span className="text-black">
                      {new Date(consultation.patientJoinedAT).toLocaleString()}
                    </span>
                  </div>
                )}
                {consultation.doctorJoinedAT && (
                  <div className="text-xs text-gray-500">
                    Doctor Joined at:{" "}
                    <span className="text-black">
                      {new Date(consultation.doctorJoinedAT).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="mt-4">
            {consultation.status === ConsultationStatus.Paid && (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-full w-full text-xs"
                onClick={() => handleAcceptClick(consultation.id)} // Handle individual accept
                disabled={
                  loadingConsultationId === consultation.id || acceptLoading
                } // Disable during specific consultation acceptance
              >
                {loadingConsultationId === consultation.id
                  ? "Accepting..."
                  : "Accept"}
              </button>
            )}
            {consultation.status === ConsultationStatus.Open && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full w-full text-xs"
                onClick={() => handleChatClick(consultation.id)} // Navigate to the chat
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
