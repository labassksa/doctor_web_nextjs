import axios from "axios";

// Function to handle login logic
export const login = async (phoneNumber: string) => {
  try {
    // // Check if the phone number starts with '0' and remove it if present
    // const cleanedPhoneNumber = phoneNumber.startsWith("0")
    //   ? phoneNumber.slice(1)
    //   : phoneNumber;

    // Prepare the payload with the corrected phone number
    const data = {
      phoneNumber: `+966${phoneNumber}`, // Prepend '+966' to the adjusted number
    };

    // Send the data to the backend using Axios
    const response = await axios.post(
      "http://localhost:4000/api_labass/send-otp",
      data
    );

    // Check for successful response
    if (response.status === 200) {
      return { success: true };
    } else {
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data &&
      error.response.data.errors
    ) {
      // Extract and join error messages from backend response
      const backendErrors = error.response.data.errors;
      const errorMsg = backendErrors
        .map((err: { msg: any }) => err.msg)
        .join(", ");
      return { success: false, message: errorMsg };
    } else {
      // Handle unexpected errors
      return {
        success: false,
        message: "حدث خطأ ، حاول مرة أخرى",
      };
    }
  }
};
