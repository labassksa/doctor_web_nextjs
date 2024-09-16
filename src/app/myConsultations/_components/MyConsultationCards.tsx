"use client";
import React from "react";
import { Consultation, ConsultationStatus } from "../../../models/consultation"; // Adjust the path as needed

interface MyConsultationsProps {
  consultations: Consultation[];
  onConsultationClick: (consultationId: number) => void;
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
    <div className="bg-gray-100 w-full space-y-4 p-4">
      {consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="p-4 border rounded-md bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onConsultationClick(consultation.id)} // Trigger the click handler
        >
          {/* Patient Info Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Patient Info</h3>
            {consultation.patient?.user.firstName ? (
              <div className="flex flex-col space-y-2">
                {/* Patient Name */}
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-medium text-gray-800">
                    {consultation.patient.user.firstName}{" "}
                    {consultation.patient.user.lastName}
                  </span>
                  <span className="text-xs text-gray-500">
                    Age: {calculateAge(consultation.patient.user.dateOfBirth)}{" "}
                    Years
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      consultation.patient.user.gender === "Male"
                        ? "bg-gray-300 text-black"
                        : "bg-pink-200 text-pink-800"
                    }`}
                  >
                    {consultation.patient.user.gender}
                  </span>
                </div>
                {/* National ID and Phone Number */}
                <div className="text-xs text-gray-500">
                  <strong>National ID:</strong>{" "}
                  {consultation.patient.user.nationalId || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Phone Number:</strong>{" "}
                  {consultation.patient.user.phoneNumber || "N/A"}
                </div>
              </div>
            ) : (
              <div className="p-2 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                Patient is completing their information
              </div>
            )}
          </div>

          {/* Consultation Details Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Consultation Details</h3>
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
          <div>
            <h3 className="text-sm font-semibold">Date Information</h3>
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
                <div className="text-gray-400">Patient has not joined yet</div>
              )}
              {consultation.doctorJoinedAT ? (
                <div>
                  <strong>Doctor Joined at:</strong>{" "}
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md inline-block">
                    {new Date(consultation.doctorJoinedAT).toLocaleTimeString()}
                  </span>
                </div>
              ) : (
                <div className="text-gray-400">Doctor has not joined yet</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyConsultations;
