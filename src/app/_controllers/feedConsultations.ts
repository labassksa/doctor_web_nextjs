import axios from "axios";

export const fetchFeedConsultations = async () => {
  try {
    const token = localStorage.getItem("labass_doctor_token"); // Replace with your actual token retrieval method
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/feed-consultations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the consultations data
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: User not found."); // Throw an error that can be caught in the component
    } else {
      console.error("Error fetching feed consultations:", error);
      throw error; // Let other errors bubble up
    }
  }
};
