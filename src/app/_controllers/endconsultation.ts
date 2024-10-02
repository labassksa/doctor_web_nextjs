// _controllers/consultationController.ts
import { ConsultationEvents } from "@/types/consultationTypes";
import axios from "axios";

export const endConsultation = async (consultationId: number) => {
  try {
    const token = localStorage.getItem("labass_doctor_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    // Request body for accepting the consultation
    const requestBody = {
      eventType: ConsultationEvents.END_CONSULTATION,
    };

    // Make a PUT request to accept the consultation
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header with token
        },
      }
    );

    // Return the updated consultation data from the response
    return response.data;
  } catch (error) {
    console.error("Error ending the consultation:", error);
    throw error; // Re-throw the error so it can be handled by the component
  }
};
