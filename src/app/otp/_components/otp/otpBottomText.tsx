// components/otp/OTPBottomText.tsx
import React, { useState, useEffect } from "react";

interface OTPBottomTextProps {
  onResend: () => void;
}

const OTPBottomText: React.FC<OTPBottomTextProps> = ({ onResend }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendClick = () => {
    if (timeLeft === 0) {
      onResend();
      setTimeLeft(60); // Restart the timer
    }
  };

  return (
    <div className="text-center mt-4">
      <p className="text-gray-600">
        لم استلم الكود{" "}
        <span
          className={`text-blue-600 cursor-pointer ${
            timeLeft > 0 ? "pointer-events-none text-gray-400" : ""
          }`}
          onClick={handleResendClick}
        >
          اضغط هنا لاعادة ارساله {timeLeft > 0 && `(${timeLeft} ثانية)`}
        </span>
      </p>
    </div>
  );
};

export default OTPBottomText;
