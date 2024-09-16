// _controllers/consultationController.ts
import axios from "axios";

export const acceptConsultation = async (consultationId: number) => {
  try {
    const token = localStorage.getItem("labass_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    // Request body for accepting the consultation
    const requestBody = {
      eventType: "DOCTOR_ACCEPTED",
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
    console.error("Error accepting consultation:", error);
    throw error; // Re-throw the error so it can be handled by the component
  }
};
