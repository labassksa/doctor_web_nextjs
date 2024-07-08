"use client";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <div key={consultation.id} className="p-4 border rounded-md bg-white shadow-md">
          <div className="flex justify-between">
            <div>
              <span className="text-lg font-semibold text-black">
                {consultation.patient.user.dateOfBirth} Years
              </span>
              <div
                className={`ml-2 inline-block px-2 py-1 rounded-full text-black ${
                  consultation.patient.user.gender === "Male" ? "bg-blue-200" : "bg-pink-200"
                }`}
              >
                {consultation.patient.user.gender}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                paid at:
                {isClient ? new Date(consultation.paidAT).toLocaleTimeString() : "Loading..."}
              </span>
            </div>
          </div>
          <div className="mt-2 flex space-x-2">
            {consultation.status === ConsultationStatus.Completed && consultation.patient.user && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Patient Joined at:{" "}
                {isClient ? new Date(consultation.patientJoinedAT).toLocaleTimeString() : "Loading..."}
              </span>
            )}
            {consultation.status === ConsultationStatus.Completed && consultation.doctor && consultation.doctorJoinedAT && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Doctor Joined at:{" "}
                {isClient ? new Date(consultation.doctorJoinedAT).toLocaleTimeString() : "Loading..."}
              </span>
            )}
            {consultation.status === ConsultationStatus.PendingPayment && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                Waiting for payment
              </span>
            )}
          </div>
          <div className="mt-4">
            {consultation.status === ConsultationStatus.PendingPayment && (
              <button className="px-4 py-2 bg-green-500 text-white rounded-full w-full">
                Accept
              </button>
            )}
            {consultation.status === ConsultationStatus.Completed && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-full w-full">
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
