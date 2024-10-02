import axios from "axios";

export const getConsultationById = async (consultationId: number) => {
  console.log(
    `consultationId in the getConsultationById controller ${consultationId}`
  );

  // Retrieve the token
  const token = localStorage.getItem("labass_doctor_token");
  if (!token) {
    console.error("No token found");
    return { error: "No token found. Please log in." }; // Return an error object
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the fetched consultation data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Check if it's an Axios error
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("Response error:", error.response.data);
        return {
          error: `Error: ${
            error.response.data.message || "Unable to fetch consultation."
          }`,
        };
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received:", error.request);
        return {
          error: "No response from the server. Please check your connection.",
        };
      } else {
        // Something else happened in setting up the request
        console.error("Request error:", error.message);
        return { error: "Error in making the request. Please try again." };
      }
    } else {
      // Non-Axios errors
      console.error("Unknown error:", error);
      return { error: "An unexpected error occurred. Please try again." };
    }
  }
};
