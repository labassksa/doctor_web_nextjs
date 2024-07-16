import React from "react";
import FeedConsultations from "./_components/FeedConsultations"; // Adjust the path as needed
import {
  Consultation,
  ConsultationStatus,
  ConsultationType,
} from "../models/consultation"; // Adjust the path as needed
import { PatientProfile } from "../models/patientProfile";
import { DoctorProfile } from "../models/doctorProfile";
import User from "../models/user";
import Sidebar from "../components/sidebar/sidebar";

// Named variables for patientUser1
const patient1Id = 1;
const patient1FirstName = "";
const patient1LastName = "";
const patient1NationalId = "1234567890";
const patient1DateOfBirth = "1990-01-01";
const patient1Gender = "Male";
const patient1PhoneNumber = "123-456-7890";
const patient1Email = "john.doe@example.com";
const patient1Role = "Patient";

// Named variables for patientUser2
const patient2Id = 2;
const patient2FirstName = "Yazeed"; // No first name for patientUser2
const patient2LastName = "Smith";
const patient2NationalId = "9876543210";
const patient2DateOfBirth = "1992-02-02";
const patient2Gender = "Female";
const patient2PhoneNumber = "987-654-3210";
const patient2Email = "jane.smith@example.com";
const patient2Role = "Patient";

// Named variables for doctorUser1
const doctor1Id = 3;
const doctor1FirstName = "Alice";
const doctor1LastName = "Johnson";
const doctor1NationalId = "1122334455";
const doctor1DateOfBirth = "1980-10-10";
const doctor1Gender = "Female";
const doctor1PhoneNumber = "555-555-5555";
const doctor1Email = "alice.johnson@example.com";
const doctor1Role = "Doctor";

// Named variables for doctorUser2
const doctor2Id = 4;
const doctor2FirstName = ""; // No first name for doctorUser2
const doctor2LastName = "Williams";
const doctor2NationalId = "5566778899";
const doctor2DateOfBirth = "1985-07-15";
const doctor2Gender = "Male";
const doctor2PhoneNumber = "444-444-4444";
const doctor2Email = "chris.williams@example.com";
const doctor2Role = "Doctor";

// Sample Users
const patientUser1 = new User({
  id: patient1Id,
  firstName: patient1FirstName,
  lastName: patient1LastName,
  nationalId: patient1NationalId,
  dateOfBirth: patient1DateOfBirth,
  gender: patient1Gender,
  phoneNumber: patient1PhoneNumber,
  email: patient1Email,
  role: patient1Role,
});

const patientUser2 = new User({
  id: patient2Id,
  firstName: patient2FirstName,
  lastName: patient2LastName,
  nationalId: patient2NationalId,
  dateOfBirth: patient2DateOfBirth,
  gender: patient2Gender,
  phoneNumber: patient2PhoneNumber,
  email: patient2Email,
  role: patient2Role,
});

const doctorUser1 = new User({
  id: doctor1Id,
  firstName: doctor1FirstName,
  lastName: doctor1LastName,
  nationalId: doctor1NationalId,
  dateOfBirth: doctor1DateOfBirth,
  gender: doctor1Gender,
  phoneNumber: doctor1PhoneNumber,
  email: doctor1Email,
  role: doctor1Role,
});

const doctorUser2 = new User({
  id: doctor2Id,
  firstName: doctor2FirstName,
  lastName: doctor2LastName,
  nationalId: doctor2NationalId,
  dateOfBirth: doctor2DateOfBirth,
  gender: doctor2Gender,
  phoneNumber: doctor2PhoneNumber,
  email: doctor2Email,
  role: doctor2Role,
});

// Sample Profiles
const patientProfile1 = new PatientProfile({
  id: 1,
  user: patientUser1,
});
const patientProfile2 = new PatientProfile({
  id: 2,
  user: patientUser2,
});

const doctorProfile1 = new DoctorProfile({
  id: 1,
  specialty: "Cardiology",
  medicalLicenseNumber: "MED12345",
  user: doctorUser1,
});

const doctorProfile2 = new DoctorProfile({
  id: 2,
  specialty: "Neurology",
  medicalLicenseNumber: "MED67890",
  user: doctorUser2,
});

// Sample Consultations
const consultation1 = new Consultation(
  1,
  new Date("2023-07-04T10:22:00"),
  null,
  null,
  new Date("2023-07-04T10:22:00"),
  new Date(),
  ConsultationStatus.Paid,
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
  ConsultationStatus.Open,
  ConsultationType.Quick,
  patientProfile2,
  doctorProfile1,
  true,
  true,
  true
);

// Convert class instances to plain objects
const plainConsultation1 = JSON.parse(JSON.stringify(consultation1));
const plainConsultation2 = JSON.parse(JSON.stringify(consultation2));
const plainConsultation3 = JSON.parse(JSON.stringify(consultation2));
const plainConsultation4 = JSON.parse(JSON.stringify(consultation2));

const FeedPage = () => {
  // Sample consultations data
  const consultations = [
    plainConsultation1,
    plainConsultation2,
    plainConsultation3,
    plainConsultation4,
    plainConsultation4,
    plainConsultation4,
    plainConsultation4,
    plainConsultation4,
    plainConsultation4,
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-grow flex flex-col lg:flex-row h-screen">
        <div className="fixed top-0 left-0 right-0 p-4 bg-white shadow-md z-10 lg:hidden">
          <h1 className="text-black font-semibold text-2xl text-center lg:text-4xl">
            Feed
          </h1>
        </div>
        <div className="flex-grow flex flex-col py-2 mt-16 lg:mt-0 overflow-auto">
          <div className="w-full text-center lg:w-1/4 lg:text-left">
            <h1 className="hidden lg:block text-black font-semibold text-xl lg:text-4xl mb-4">
              Feed
            </h1>
            <FeedConsultations consultations={consultations} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
