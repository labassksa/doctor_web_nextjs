import axios from "axios";

export const verifyOTPandLogin = async (
  role: string,
  phoneNumber: string,
  otpcode: string
) => {
  try {
    const data = {
      role,
      phoneNumber,
      otpcode,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.post(`${apiUrl}/verifyOTPandLogin`, data);

    if (response.status === 200) {
      // Extract authResponse (userId, token, refreshToken) from the response
      const { userId, token, refreshToken } = response.data.authResponse;

      // Store the token and userId in localStorage
      localStorage.setItem("labass_token", token);
      localStorage.setItem("labass_userId", userId);

      console.log(`Stored userId: ${userId}`);
      console.log(`Stored token: ${token}`);

      return { success: true, token, userId, refreshToken };
    } else {
      return { success: false, message: "Unexpected response status code" };
    }
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data &&
      (error.response.data.error || error.response.data.errors)
    ) {
      if (error.response.data.error) {
        return { success: false, message: error.response.data.error };
      }
      if (error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        const errorMsg = backendErrors
          .map((err: { msg: any }) => err.msg)
          .join(", ");
        return { success: false, message: errorMsg };
      }
    } else {
      return {
        success: false,
        message: "حدث خطأ ، حاول مرة أخرى",
      };
    }
  }
};
