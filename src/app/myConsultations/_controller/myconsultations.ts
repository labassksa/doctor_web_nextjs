// _controllers/doctorConsultations.ts
import axios from "axios";

export const fetchDoctorConsultations = async () => {
  try {
    const token = localStorage.getItem("labass_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor-consultations`, // Assuming this is the correct API endpoint for doctor consultations
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor consultations:", error);
    return [];
  }
};
