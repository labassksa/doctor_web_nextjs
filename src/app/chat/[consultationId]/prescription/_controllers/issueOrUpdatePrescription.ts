import axios from "axios";

export const issueOrUpdatePrescription = async (
  consultationId: number,
  drugs: any[],
  diagnoses: string[],
  allergies: string[]
) => {
  try {
    const token = localStorage.getItem("labass_token"); // Replace with your actual token retrieval method
    console.log(`token : ${token}`);
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/prescription`,
      {
        drugs,
        diagnoses,
        allergies,
      },
      {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      }
    );

    return response.data; // Return the response data
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: User not found."); // Throw an error that can be caught in the component
    } else {
      console.error("Error issuing or updating prescription:", error);
      throw error; // Let other errors bubble up
    }
  }
};
