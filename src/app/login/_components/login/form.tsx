"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../../controllers/login.Controller";
import { convertArabicToEnglishNumbers } from "../../../../utils/arabicToenglish";

const SimpleLoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const router = useRouter();

  const handlePhoneNumberChange = (e: { target: { value: string } }) => {
    const convertedNumber = convertArabicToEnglishNumbers(e.target.value);
    setPhoneNumber(convertedNumber);
    setErrorMessage("");
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    if (phoneNumber.length !== 10) {
      setErrorMessage("يرجى إدخال رقم جوال صحيح مكون من 10 أرقام");
      setIsLoading(false); // Stop loading if the phone number is invalid
      return;
    }

    const cleanedPhoneNumber = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;
    const result = await login(cleanedPhoneNumber);

    setIsLoading(false); // Stop loading after API response
    if (result.success) {
      router.push(`/otp?phoneNumber=%2B966${cleanedPhoneNumber}`);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="flex flex-col  h-screen  justify-center">
      <form onSubmit={handleSubmit} className="text-right m-2" id="loginForm">
        <label htmlFor="phoneNumber" className="block m-2  text-xl">
          أدخل رقم الجوال
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="05xxxxxxx"
          required
          className="w-full p-3 text-right text-lg border-2 border-gray-300 rounded-md focus:outline-none focus:border-custom-green direction-rtl"
        />
        {errorMessage && (
          <div className="text-red-500 text-sm m-2">{errorMessage}</div>
        )}
      </form>
      <div className="p-6 mb-60">
        <div className="text-xs text-right">
          مع الاستمرار بتسجيل الدخول، أنت توافق على{" "}
          <a href="/terms" className="underline text-custom-green">
            الشروط والأحكام
          </a>
        </div>
        <button
          type="submit"
          form="loginForm"
          className="mt-2 px-6 py-4 w-full bg-custom-green text-white font-bold text-sm rounded-md focus:outline-none flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <div className="spinner"></div> : "تسجيل الدخول"}
        </button>
      </div>
    </div>
  );
};

export default SimpleLoginForm;
