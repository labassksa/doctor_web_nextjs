"use client";
import React from "react";
import { Consultation, ConsultationStatus } from "../../../models/consultation"; // Adjust the path as needed

interface MyConsultationsProps {
  consultations: Consultation[];
  onConsultationClick: (consultation: Consultation) => void;
}

const MyConsultations: React.FC<MyConsultationsProps> = ({
  consultations,
  onConsultationClick,
}) => {
  // Function to calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-gray-100 space-y-4 p-4">
      {consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="p-4 border rounded-lg bg-white shadow-lg w-full max-w-full sm:max-w-lg mx-auto cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => onConsultationClick(consultation)} // Trigger the click handler
        >
          <div className="flex flex-wrap justify-between">
            {/* Patient Info Section */}
            <div className="w-full mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Patient Info
              </h2>
              {consultation.patient?.user.firstName ? (
                <>
                  <div className="text-xs text-gray-500">
                    Name:{" "}
                    <span className="text-black">
                      {consultation.patient.user.firstName}{" "}
                      {consultation.patient.user.lastName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Age:{" "}
                    <span className="text-black">
                      {calculateAge(consultation.patient.user.dateOfBirth)}{" "}
                      Years
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    National ID:{" "}
                    <span className="text-black">
                      {consultation.patient.user.nationalId || "N/A"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Phone Number:{" "}
                    <span className="text-black">
                      {consultation.patient.user.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      consultation.patient.user.gender === "Male"
                        ? "bg-gray-300 text-black"
                        : "bg-pink-200 text-pink-800"
                    }`}
                  >
                    {consultation.patient.user.gender}
                  </div>
                </>
              ) : (
                <div className="p-2 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                  Patient is completing their information
                </div>
              )}
            </div>

            {/* Consultation Details Section */}
            <div className="w-full mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Consultation Details
              </h2>
              <div className="text-xs text-gray-500">
                Consultation ID:{" "}
                <span className="text-black">{consultation.id}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
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

            {/* Dates Section */}
            <div className="w-full">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Date Information
              </h2>
              <div className="text-xs text-gray-500 space-y-1">
                {consultation.paidAT ? (
                  <div>
                    <strong>Paid at:</strong>{" "}
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md inline-block">
                      {new Date(consultation.paidAT).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    Payment information not available
                  </div>
                )}
                {consultation.patientJoinedAT ? (
                  <div>
                    <strong>Patient Joined at:</strong>{" "}
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md inline-block">
                      {new Date(
                        consultation.patientJoinedAT
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    Patient has not joined yet
                  </div>
                )}
                {consultation.doctorJoinedAT ? (
                  <div>
                    <strong>Doctor Joined at:</strong>{" "}
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block">
                      {new Date(
                        consultation.doctorJoinedAT
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-400">Doctor has not joined yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyConsultations;
