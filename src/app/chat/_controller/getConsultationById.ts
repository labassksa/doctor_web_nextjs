// _controllers/getConsultationById.ts
import axios from "axios";

export const getConsultationById = async (consultationId: number) => {
  console.log(
    `consultationId in the getConsultationById controller ${consultationId}`
  );
  try {
    const token = localStorage.getItem("labass_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return null;
  }
};
