// components/otp/OTPTopText.tsx
import React from "react";

const OTPTopText = ({ phoneNumber }: { phoneNumber: string | null }) => {
  return (
    <div className="text-center mt-20 mx-4">
      <h2 className="text-xl font-bold">
        الرجاء إدخال الرمز المكون من 4 ارقام
      </h2>
      <p className="text-gray-600 m-4">
        تم إرسال الرمز الى الرقم{" "}
        <span className="font-bold">{phoneNumber}</span> الرجاء ادخال الرمز
        المكون من ٤ أرقام
      </p>
    </div>
  );
};

export default OTPTopText;
