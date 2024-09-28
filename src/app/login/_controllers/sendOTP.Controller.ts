import axios from "axios";

// Function to handle login logic for doctors
export const loginDoctor = async (phoneNumber: string) => {
  try {
    // Check if the phone number already starts with '+966'
    const formattedPhoneNumber = phoneNumber.startsWith("+966")
      ? phoneNumber
      : `+966${phoneNumber}`;

    // Prepare the payload with the corrected phone number and role
    const data = {
      phoneNumber: formattedPhoneNumber, // Use the formatted phone number
      role: "doctor", // Specify the role as 'doctor'
    };

    // Use environment variable for the backend URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Send the data to the backend using Axios
    const response = await axios.post(`${apiUrl}/send-otp`, data);

    // Check for successful response
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      // Extract error message from backend response
      const backendMessage =
        error.response.data.error || "حدث خطأ ، حاول مرة أخرى";
      return { success: false, message: backendMessage };
    } else {
      // Handle unexpected errors
      return {
        success: false,
        message: "حدث خطأ ، حاول مرة أخرى",
      };
    }
  }
};
