import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/auth_service";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const result = await authApi.sendPasswordResetCode(email);
      if (!result.ok) {
        setFormError(result.detail || "Failed to send reset code.");
        return;
      }
      setSuccessMessage("Reset code sent! Check your email.");
      // Navigate after a short delay so user sees success message
      setTimeout(() => {
        navigate("/resetpassword", { state: { email } });
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

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
        {/* MSQUARED Logo (optional, matches other pages) */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-primary text-3xl font-bold font-inter tracking-tight">
            <Link to="/">MSQUARED</Link>
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-black rounded-xl p-6 md:p-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-1">
            Forgot Password?
          </h2>
          <p className="text-secondary text-sm md:text-base font-light mb-6">
            No worries, we'll send you reset instructions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@domain.com"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                  required
                />
              </div>
            </div>

            {formError && <p className="text-red-400 text-xs font-light">{formError}</p>}
            {successMessage && <p className="text-green-400 text-xs font-light">{successMessage}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-secondary/60 hover:text-secondary transition-colors text-sm font-light flex items-center justify-center gap-1"
            >
              <GoArrowLeft className="w-4 h-4" /> Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;