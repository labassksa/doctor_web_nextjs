"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import OTPInput from "./_components/otp/otpInput";
import OTPTopText from "./_components/otp/otpTopText";
import OTPBottomText from "./_components/otp/otpBottomText";
import { useRouter, useSearchParams } from "next/navigation";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([null, null, null, null]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const phoneNumber = searchParams.get("phoneNumber");
    setPhoneNumber(phoneNumber);
  }, []);

  useEffect(() => {
    if (otp.every((val) => val.length === 1)) {
      // handleVerifyOTP;
    }
  }, [otp.join("")]);

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

  // const handleVerifyOTP = async () => {
  //   if (!phoneNumber) {
  //     console.error("Phone number is missing in the OTP page.");
  //     return;
  //   }

  //   const otpCode = otp.join("");
  //   const data = {
  //     role: "patient",
  //     phoneNumber,
  //     otpcode: otpCode,
  //   };

  //   try {
  //     const response = await axios.post("http://localhost:4000/api_labass/auth", data);
  //     const { token } = response.data;
  //     localStorage.setItem("jwtToken", token);

  //     console.log("OTP Verified:", response.data);

  //     router.push("/");
  //   } catch (error) {
  //     console.error("Failed to verify OTP:", error);
  //   }
  // };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-center text-4xl font-bold text-gray-500 m-12">أدخل رمز التحقق</div>
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
        <OTPBottomText />
      </div>
    </div>
  );
};

export default OTPPage;
