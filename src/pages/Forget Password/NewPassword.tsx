
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../services/auth_service";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();


  const emailFromState = (location.state as { email?: string } | null)?.email;
  const emailFromQuery = searchParams.get('email');
  const email = emailFromState || emailFromQuery || '';


  const code = searchParams.get('code');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!email) {
      setFormError("Email address is missing. Please start the reset process again.");
      return;
    }
    if (!code) {
      setFormError("Reset code is missing. Please use the link from your email.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setSuccess(false);

    try {
      const result = await authApi.resetPassword({
        email,
        code,
        password,
      });
      if (!result.ok) {
        setFormError(result.detail || "Failed to reset password.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        navigate("/successmessage");
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#121317] text-white font-inter flex flex-col">

      <div className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-primary text-xl font-jakrata md:text-2xl font-bold font-inter tracking-tight">
          <a href="/">MSQUARED</a>
        </h1>
        <div className="flex items-center gap-2 text-secondary/70 hover:text-secondary transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-light tracking-wide">Support</span>
        </div>
      </div>


      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">

          <div className="bg-black border border-border_color rounded-xl p-6 md:p-8 py-10">
            <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">
              Set New Password
            </h2>
            <p className="text-secondary text-sm md:text-base font-light leading-relaxed mb-6">
              Enter your new password below. Make sure it's at least 6 characters.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                    required
                    disabled={submitting || success}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                  </button>
                </div>
              </div>


              <div>
                <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                    required
                    disabled={submitting || success}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                  </button>
                </div>
              </div>

              {formError && <p className="text-red-400 text-xs font-light">{formError}</p>}
              {success && <p className="text-green-400 text-xs font-light">Password reset successful! Redirecting...</p>}

              <button
                type="submit"
                disabled={submitting || success}
                className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Reset Password"}
              </button>
            </form>


            <div className="mt-16 text-secondary/60 text-sm text-center space-y-2">
              <Link to="/login" className="flex items-center justify-center gap-2 hover:text-primary transition-colors">
                <span className="text-primary">←</span>
                <span className="text-gray-200 hover:text-primary">Back to Login</span>
              </Link>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-black rounded-xl p-4 border border-secondary/20 flex items-center gap-3">

              <div>
                <h3 className="text-gray-300 text-sm font-semibold mb-0.5">Secure Access</h3>
                <p className="text-secondary text-xs font-light">Multi-factor authentication ready.</p>
              </div>
            </div>
            <div className="bg-black rounded-xl p-4 border border-secondary/20 flex items-center gap-3">

              <div>
                <h3 className="text-gray-300 text-sm font-semibold mb-0.5">Need Help?</h3>
                <p className="text-secondary text-xs font-light">Support is available 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <footer className="border-t border-secondary/10 bg-[#121317] py-6 px-4 text-xs flex flex-col md:flex-row justify-between items-center gap-4 w-full mx-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-white font-medium"><a href="/">MSQUARED</a></span>
          <span className="text-secondary/50">© {currentYear} MSQUARED. THE MUSLIM EVENTS OS.</span>
        </div>
        <div className="flex gap-6 text-secondary/50">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-secondary transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default NewPassword;