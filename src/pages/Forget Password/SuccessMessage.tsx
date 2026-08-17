// pages/Forget Password/SuccessMessage.tsx
import React from "react";
import { CiCircleCheck } from "react-icons/ci";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

const PasswordResetSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#121317] text-white font-inter flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background blur effects (same as Login/Signup) */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[440px]">
        {/* MSQUARED Logo */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-primary text-3xl font-bold font-inter tracking-tight">
            <Link to="/">MSQUARED</Link>
          </h1>
        </div>

        {/* Card */}
        <div className="bg-black rounded-xl p-6 md:p-8 text-center">
          {/* Checkmark Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <CiCircleCheck className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-2">
            All Done
          </h2>
          <p className="text-secondary text-base font-light mb-8">
            Your password has been reset.
          </p>

          {/* Return to Login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-secondary/60 hover:text-secondary transition-colors text-sm font-light"
          >
            <GoArrowLeft className="w-4 h-4" />
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;