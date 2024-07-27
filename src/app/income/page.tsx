// import React from "react";
// import FeedConsultations from "./../_components/FeedConsultations"; // Adjust the path as needed
// import {
//   Consultation,
//   ConsultationStatus,
//   ConsultationType,
// } from "../../models/consultation"; // Adjust the path as needed
// import { PatientProfile } from "../../models/patientProfile";
// import { DoctorProfile } from "../../models/doctorProfile";
// import User from "../../models/user";

// // Sample Users
// const patientUser1 = new User(
//   1,
//   "John",
//   "Doe",
//   "123456789",
//   "1990-01-01",
//   "Male",
//   "123-456-7890",
//   "john.doe@example.com",
//   "Patient"
// );
// const patientUser2 = new User(
//   2,
//   "Jane",
//   "Smith",
//   "987654321",
//   "1985-05-05",
//   "Female",
//   "987-654-3210",
//   "jane.smith@example.com",
//   "Patient"
// );

// const doctorUser1 = new User(
//   3,
//   "Alice",
//   "Johnson",
//   "1122334455",
//   "1980-10-10",
//   "Female",
//   "555-555-5555",
//   "alice.johnson@example.com",
//   "Doctor"
// );

// // Sample Profiles
// const patientProfile1 = new PatientProfile(1, patientUser1);
// const patientProfile2 = new PatientProfile(2, patientUser2);

// const doctorProfile1 = new DoctorProfile(
//   1,
//   "Cardiology",
//   "MED12345",
//   doctorUser1
// );

// // Sample Consultations
// const consultation1 = new Consultation(
//   1,
//   new Date("2023-07-04T10:22:00"),
//   new Date("2023-07-04T10:24:00"),
//   new Date("2023-07-04T10:28:00"),
//   new Date("2023-07-04T10:22:00"),
//   new Date(),
//   ConsultationStatus.PendingPayment,
//   ConsultationType.Quick,
//   patientProfile1,
//   null,
//   false,
//   false,
//   false
// );

// const consultation2 = new Consultation(
//   2,
//   new Date("2023-07-04T10:22:00"),
//   new Date("2023-07-04T10:24:00"),
//   new Date("2023-07-04T10:28:00"),
//   new Date("2023-07-04T10:22:00"),
//   new Date(),
//   ConsultationStatus.Completed,
//   ConsultationType.Detailed,
//   patientProfile2,
//   doctorProfile1,
//   true,
//   true,
//   true
// );

// // Convert class instances to plain objects
// const plainConsultation1 = JSON.parse(JSON.stringify(consultation1));
// const plainConsultation2 = JSON.parse(JSON.stringify(consultation2));
// const plainConsultation3 = JSON.parse(JSON.stringify(consultation2));
// const plainConsultation4 = JSON.parse(JSON.stringify(consultation2));

// const FeedPage = () => {
//   // Sample consultations data
//   const consultations = [
//     plainConsultation1,
//     plainConsultation2,
//     plainConsultation3,
//     plainConsultation4,
//     plainConsultation4,
//     plainConsultation4,
//     plainConsultation4,
//     plainConsultation4,
//     plainConsultation4,
//   ];

//   return (
//     <div className="flex bg-gray-100">
//       <main className="ml-64 p-4">
//         <h1 className="text-black font-semibold text-4xl">Feed</h1>
//         <FeedConsultations consultations={consultations} />
//       </main>
//     </div>
//   );
// };

// export default FeedPage;
