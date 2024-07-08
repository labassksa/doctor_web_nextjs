// components/otp/OTPBottomText.tsx
import React from "react";

const OTPBottomText = () => {
  return (
    <div className="text-center mt-4">
      <p className="text-gray-600">
        لم استلم الكود{" "}
        <span className="text-blue-600 cursor-pointer">
          اضغط هنا لاعادة ارساله
        </span>
      </p>
    </div>
  );
};

export default OTPBottomText;
