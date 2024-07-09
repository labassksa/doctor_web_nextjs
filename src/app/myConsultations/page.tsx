import React from "react";
import MyConsultations from "./_components/MyConsultationCards"; // Adjust the path as needed
import {
  Consultation,
  ConsultationStatus,
  ConsultationType,
} from "../../models/consultation"; // Adjust the path as needed
import { PatientProfile } from "../../models/patientProfile";
import { DoctorProfile } from "../../models/doctorProfile";
import User from "../../models/user";
import ChatMainContents from "../chat/_components/chatMessagesarea";
import FullScreenButtons from "./_components/actions";
import Sidebar from "../../components/sidebar/sidebar";

// Sample Users
const patientUser1 = new User(
  1,
  "John",
  "Doe",
  "123456789",
  "1990-01-01",
  "Male",
  "123-456-7890",
  "john.doe@example.com",
  "Patient"
);
const patientUser2 = new User(
  2,
  "John",
  "Yazeed",
  "987654321",
  "1985-05-05",
  "Female",
  "987-654-3210",
  "jane.smith@example.com",
  "Patient"
);

const doctorUser1 = new User(
  3,
  "Alice",
  "Johnson",
  "1122334455",
  "1980-10-10",
  "Female",
  "555-555-5555",
  "alice.johnson@example.com",
  "Doctor"
);

// Sample Profiles
const patientProfile1 = new PatientProfile(1, patientUser1);
const patientProfile2 = new PatientProfile(2, patientUser2);

const doctorProfile1 = new DoctorProfile(
  1,
  "Cardiology",
  "MED12345",
  doctorUser1
);

// Sample Consultations
const consultation1 = new Consultation(
  1,
  new Date("2023-07-04T10:22:00"),
  new Date("2023-07-04T10:24:00"),
  new Date("2023-07-04T10:28:00"),
  new Date("2023-07-04T10:22:00"),
  new Date(),
  ConsultationStatus.PendingPayment,
  ConsultationType.Quick,
  patientProfile1,
  null,
  false,
  false,
  false 
);

const consultation2 = new Consultation(
  2,
  new Date("2023-07-04T10:22:00"),
  new Date("2023-07-04T10:24:00"),
  new Date("2023-07-04T10:28:00"),
  new Date("2023-07-04T10:22:00"),
  new Date(),
  ConsultationStatus.Completed,
  ConsultationType.Detailed,
  patientProfile2,
  doctorProfile1,
  true,
  true,
  true
);

// Convert class instances to plain objects
const plainConsultation1 = JSON.parse(JSON.stringify(consultation1));
const plainConsultation2 = JSON.parse(JSON.stringify(consultation2));

const MyConsultationsPage = () => {
  // Sample consultations data
  const consultations = [
    plainConsultation1,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
    plainConsultation2,
  ];

  return (
    <div className="flex h-screen overflow-hidden ">
      <Sidebar />

      <main className="flex flex-col w-full p-4 ml-64">
        <h1 className="text-2xl text-black font-semibold mb-4 ">
          My Consultations
        </h1>
        <div className="flex flex-row flex-grow h-full">
          <div className="w-1/3  text-black overflow-y-auto">
            <MyConsultations consultations={consultations} />
          </div>
          <div className="w-1/2 h-full text-black ">
            <ChatMainContents />
          </div>
          <div className="w-1/6 h-full">
            <FullScreenButtons />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyConsultationsPage;
