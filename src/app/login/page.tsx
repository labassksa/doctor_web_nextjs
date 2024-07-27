import React from "react";
import SimpleLoginForm from "./_components/login/form";

const LoginPage: React.FC = () => {
  return (
    <div
      className="flex flex-col justify-between text-lg text-black bg-white min-h-screen rtl"
      style={{ overflow: 'hidden', height: '100vh' }}
    >
      <h1 className="text-right text-bold text-4xl m-6">تسجيل الدخول</h1>
      <div className="flex-1 flex items-center justify-center">
        <SimpleLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
