"use client";
import React, { useState, useEffect, useRef } from "react";
import OTPInput from "./_components/otp/otpInput";
import OTPTopText from "./_components/otp/otpTopText";
import OTPBottomText from "./_components/otp/otpBottomText";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTPandLogin } from "././_controllers/verifyOTPandLogin";
import { loginDoctor } from "../login/_controllers/sendOTP.Controller"; // Adjust the import path as necessary

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
  ]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const phoneNumber = searchParams.get("phoneNumber");
    setPhoneNumber(phoneNumber);
  }, [searchParams]);

  useEffect(() => {
    if (otp.every((val) => val.length === 1)) {
      handleVerifyOTP();
    }
  }, [otp]);

  const updateOTP = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (!phoneNumber) {
      setError("Phone number is missing in the OTP page.");
      return;
    }

    const otpCode = otp.join("");
    setLoading(true);
    setError(null);

    // Simulate loading delay
    setTimeout(async () => {
      const result = await verifyOTPandLogin("doctor", phoneNumber, otpCode);

      setLoading(false);

      if (result?.success) {
        router.push("/");
      } else {
        setError(result?.message || "Failed to verify OTP.");
      }
    }, 2000); // Simulate a 2-second delay
  };

  const handleResendOTP = async () => {
    if (!phoneNumber) {
      setError("Phone number is missing in the OTP page.");
      return;
    }

    try {
      const result = await loginDoctor(phoneNumber);
      if (result && result.success) {
        setOtp(["", "", "", ""]); // Clear the OTP input fields
        inputRefs.current[0]?.focus(); // Focus on the first input field
        setError(null);
      } else if (result) {
        setError(result.message);
        console.error("Failed to resend OTP:", result.message);
      } else {
        setError("حدث خطأ ، حاول مرة أخرى");
        console.error("Failed to resend OTP: Result is undefined");
      }
    } catch (error) {
      setError("حدث خطأ ، حاول مرة أخرى");
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-center text-4xl font-bold text-gray-500 m-12">
          أدخل رمز التحقق
        </div>
        {phoneNumber ? <OTPTopText phoneNumber={phoneNumber} /> : null}
        <div className="flex mt-10 justify-center">
          {otp.map((value, index) => (
            <OTPInput
              key={index}
              value={value}
              index={index}
              onChange={updateOTP}
              autoFocus={index === 0}
              ref={(el: any) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        {loading && <div className="flex justify-center mt-4">Loading...</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        <OTPBottomText onResend={handleResendOTP} />
      </div>
    </div>
  );
};

export default OTPPage;
