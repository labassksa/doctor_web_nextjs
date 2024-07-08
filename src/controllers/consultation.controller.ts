// import axios from "axios";
// import {
//   Consultation,
//   ConsultationStatus,
//   ConsultationType,
// } from "../models/consultation";
// import User from "../models/user";
// import { PatientProfile } from "../models/patientProfile";
// import { DoctorProfile } from "../models/doctorProfile";

// export const fetchConsultations = async () => {
//   const token =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6InBhdGllbnQiLCJwYXRpZW50UHJvZmlsZSI6eyJpZCI6NH0sImlhdCI6MTcxNzE0MTIwOH0.P6f6HikcxlFLZXbTY9JOx9-llfhNqjIlZ5iDANFw-Y0";

//   try {
//     const response = await axios.get(
//       "https://f199e707f1a3.ngrok.app/api_labass/consultations",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the bearer token in the request headers
//         },
//       }
//     );

//     if (response.status === 200 && response.data) {
//       const consultations = response.data.map((item: any) => {
//         const patientUser = new User(
//           item.patient.user.id,
//           item.patient.user.firstName,
//           item.patient.user.lastName,
//           item.patient.user.phoneNumber,
//           item.patient.user.email,
//           item.patient.user.gender,
//           item.patient.user.nationalId,
//           item.patient.user.dateOfBirth,
//           item.patient.user.role
//         );

//         let doctorProfile = null;
//         if (item.doctor) {
//           const doctorUser = new User(
//             item.doctor.user.id,
//             item.doctor.user.firstName,
//             item.doctor.user.lastName,
//             item.doctor.user.phoneNumber,
//             item.doctor.user.email,
//             item.doctor.user.gender,
//             item.doctor.user.nationalId,
//             item.doctor.user.dateOfBirth,
//             item.doctor.user.role
//           );
//           doctorProfile = new DoctorProfile(
//             item.doctor.id,
//             item.doctor.specialty,
//             item.doctor.medicalLicenseNumber,
//             doctorUser,
//             item.doctor.iban
//           );
//         }

//         const patientProfile = new PatientProfile(item.patient.id, patientUser);

//         return new Consultation(
//           item.id,
//           new Date(item.createdAt),
//           item.status,
//           item.type,
//           patientProfile,
//           doctorProfile,
//           item.prescription !== null,
//           item.soap !== null,
//           item.sickLeave !== null
//         );
//       });
//       return { success: true, data: consultations };
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error:", error.response);
//       return {
//         success: false,
//         message: "Network Error: Unable to fetch consultations",
//       };
//     } else {
//       console.error("Unexpected error:", error);
//       return { success: false, message: "An unexpected error occurred" };
//     }
//   }
// };
