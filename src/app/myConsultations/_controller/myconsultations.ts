// _controllers/doctorConsultations.ts
import axios from "axios";

interface PaginationResponse<T> {
  data: T[];
  metadata: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}

export const fetchDoctorConsultations = async (page: number = 0, limit: number = 15): Promise<PaginationResponse<any>> => {
  try {
    const token = localStorage.getItem("labass_doctor_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor-consultations?page=${page}&limit=${limit}`, // Assuming this is the correct API endpoint for doctor consultations
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor consultations:", error);
    return {data: [], metadata: {total: 0, page: 0, limit: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false}}; // Return an empty res or handle the error as needed
  }
};
