// src/pages/CardDetailsPage.tsx
import React from "react";
import SimpleLoginForm from "./_components/login/form";

const LoginPage: React.FC = () => {
  return (
    <div className="flex  flex-col items-center justify-between text-lg text-black min-h-screen w-full rtl ">
      <h1 className="text-right text-bold text-4xl m-6 text-gray-500">تسجيل الدخول</h1>
      <div  /> {/* This will push the form down */}
      <SimpleLoginForm />
    </div>
  );
};

export default LoginPage;
