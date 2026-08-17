import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../services/auth_service";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail =
    (location.state as { email?: string } | null)?.email ?? "";
  const initialAccountType =
    (location.state as { accountType?: "attendee" | "organizer" } | null)?.accountType ??
    (typeof window !== "undefined" ? localStorage.getItem("accountType") : null) ??
    "attendee";

  const [email, setEmail] = useState(initialEmail);
  const [accountType] = useState<"attendee" | "organizer">(
    initialAccountType as "attendee" | "organizer"
  );
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    if (!email || !code) {
      setFormError("Please enter your email and verification code.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const result = await authApi.verifyAccount({ email, code });

    setSubmitting(false);

    // Check if verification succeeded and we have token+user
    if (!result.ok || !result.token || !result.user) {
      setFormError(result.detail || "Verification failed. Please try again.");
      return;
    }

    // ─── SUCCESS: extract token and user ──────────────────────────────
    const { token, user } = result;
    const isOrganizer = user.role === "organizer";
    const accountType = isOrganizer ? "organizer" : "attendee";
    const onboardingCompleted = isOrganizer
      ? true
      : Boolean(user.onboarding_completed ?? false);

    // Store all required data
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accountType", accountType);
    localStorage.setItem("onboardingCompleted", String(onboardingCompleted));

    // ─── Redirect based on role and onboarding ─────────────────────────
    if (isOrganizer) {
      navigate("/organizer", { replace: true });
    } else if (onboardingCompleted) {
      navigate("/layout/overview", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  };

  const handleResend = async () => {
    if (!email) {
      setFormError("Please enter your email to resend the code.");
      return;
    }

    setFormError(null);
    setResendMessage(null);
    const result = await authApi.resendOtp(email);
    if (result.ok) {
      setResendMessage("A new verification code has been sent.");
    } else {
      setFormError(result.detail || "Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121317] text-white font-inter flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background blur effects – same as before */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-primary text-3xl font-bold font-inter tracking-tight">
            MSQUARED
          </h1>
        </div>

        <div className="bg-black rounded-xl p-6 md:p-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-1">
            Verify Your Email
          </h2>
          <p className="text-secondary text-sm md:text-base font-light mb-6">
            We've sent a 6-digit code to your email address. Enter it below to activate your account.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                VERIFICATION CODE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  placeholder="6-digit code"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm tracking-[0.3em]"
                  required
                />
              </div>
            </div>

            {formError && (
              <p className="text-red-400 text-xs font-light">{formError}</p>
            )}
            {resendMessage && (
              <p className="text-green-400 text-xs font-light">{resendMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2"
              disabled={submitting}
            >
              {submitting ? "Verifying..." : "Verify and Continue"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-secondary/60">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;