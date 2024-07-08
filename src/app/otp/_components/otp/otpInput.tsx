import React, { forwardRef } from "react";

interface OTPInputProps {
  value: string;
  index: number;
  onChange: (value: string, index: number) => void;
  autoFocus?: boolean;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, index, onChange, autoFocus }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.trim().length <= 1 && !isNaN(Number(val))) {
        // Ensure single digit numerical input
        onChange(val, index);
      }
    };

    return (
      <input
        type="tel"
        maxLength={1}
        value={value}
        autoFocus={autoFocus}
        onChange={handleInputChange}
        className="w-16 h-16 m-2 text-center text-3xl text-black border rounded-lg focus:border-custom-green  focus:outline-none focus:shadow-md"
        autoComplete="one-time-code"
        inputMode="numeric"
        pattern="[0-9]*"
        ref={ref}
      />
    );
  }
);

// Set the displayName property for the forwardRef component
OTPInput.displayName = "OTPInput";

export default OTPInput;
