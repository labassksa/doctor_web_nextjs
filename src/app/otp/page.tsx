"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import OTPInput from "./_components/otp/otpInput";
import OTPTopText from "./_components/otp/otpTopText";
import OTPBottomText from "./_components/otp/otpBottomText";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTPandLogin } from "./_controllers/verifyOTPandLogin";
import { loginDoctor } from "../login/_controllers/sendOTP.Controller"; // Adjust the import path as necessary

const OTPPage: React.FC = () => {
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

  // Wrap useSearchParams in Suspense boundary
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPPageContent
        otp={otp}
        setOtp={setOtp}
        inputRefs={inputRefs}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        router={router}
      />
    </Suspense>
  );
};

// Separate the OTPPage logic into a child component
const OTPPageContent: React.FC<any> = ({
  otp,
  setOtp,
  inputRefs,
  phoneNumber,
  setPhoneNumber,
  loading,
  setLoading,
  error,
  setError,
  router,
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const phoneNumber = searchParams.get("phoneNumber");
    setPhoneNumber(phoneNumber);
  }, [searchParams]);

  useEffect(() => {
    if (otp.every((val: string | any[]) => val.length === 1)) {
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

    setTimeout(async () => {
      const result = await verifyOTPandLogin("doctor", phoneNumber, otpCode);
      setLoading(false);

      if (result?.success) {
        router.push("/");
      } else {
        setError(result?.message || "Failed to verify OTP.");
      }
    }, 2000);
  };

  const handleResendOTP = async () => {
    if (!phoneNumber) {
      setError("Phone number is missing in the OTP page.");
      return;
    }

    try {
      const result = await loginDoctor(phoneNumber);
      if (result && result.success) {
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        setError(null);
      } else if (result) {
        setError(result.message);
      } else {
        setError("حدث خطأ ، حاول مرة أخرى");
      }
    } catch (error) {
      setError("حدث خطأ ، حاول مرة أخرى");
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
          {otp.map((value: string, index: number) => (
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
