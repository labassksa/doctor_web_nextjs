"use client";
import React from "react";
import { Consultation, ConsultationStatus } from "../../../models/consultation"; // Adjust the path as needed

interface MyConsultationsProps {
  consultations: Consultation[];
}

const MyConsultations: React.FC<MyConsultationsProps> = ({ consultations }) => {
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
    <div className="bg-gray-100 w-full ">
      {consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="p-4 border rounded-md space-x-12 bg-white shadow-md flex  justify-between"
        >
          <div>
            <div>
              <span className="text-sm font-semibold">
                {consultation.patient.user.firstName}{" "}
                {consultation.patient.user.lastName}
              </span>
              <div className="text-sm text-gray-500">ID: {consultation.id}</div>
              <div className="text-sm font-semibold">
                {calculateAge(consultation.patient.user.dateOfBirth)} Years
              </div>
              <div
                className={`ml-2 text-sm inline-block px-2 py-1 rounded-full ${
                  consultation.patient.user.gender === "Male"
                    ? "bg-blue-200"
                    : "bg-pink-200"
                }`}
              >
                {consultation.patient.user.gender}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                consultation.status === ConsultationStatus.PendingPayment
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {consultation.status}
            </span>
            <div className="text-sm text-balance text-gray-500 bg-gray-200 p-2 rounded-md">
              Paid at:
              {new Date(consultation.paidAT).toLocaleTimeString()}
            </div>
            {consultation.patientJoinedAT && (
              <div className="text-xs text-balance bg-yellow-100 text-yellow-800 p-2 rounded-md">
                Patient Joined at:{" "}
                {new Date(consultation.patientJoinedAT).toLocaleTimeString()}
              </div>
            )}
            {consultation.doctorJoinedAT && (
              <div className="text-xs text-balance text-blue-800 bg-blue-100 p-2 rounded-md">
                Doctor Joined at:{" "}
                {new Date(consultation.doctorJoinedAT).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyConsultations;
