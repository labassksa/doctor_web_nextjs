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
      const { token } = response.data;
      localStorage.setItem("labass_token", token);
      return { success: true, token };
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
