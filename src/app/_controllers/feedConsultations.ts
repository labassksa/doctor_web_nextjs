import axios from "axios";

interface PaginationResponse<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
}

export const fetchFeedConsultations = async (
  page: number = 1,
  limit: number = 50
): Promise<PaginationResponse<any>> => {
  try {
    const token = localStorage.getItem("labass_doctor_token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/feed-consultations?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: User not found.");
    } else {
      console.error("Error fetching feed consultations:", error);
      throw error;
    }
  }
};
