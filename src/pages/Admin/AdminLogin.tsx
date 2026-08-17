import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/auth_service";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.signin({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user, ok } = response;

      if (!ok || !(token && user)) {
        setError(response.detail || "Login failed. Please check your credentials.");
        return;
      }

      const role = (user?.role || "").toLowerCase();

      if (role !== "admin") {
        setError("Access denied. Administrator privileges required.");
        return;
      }

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accountType", "admin");
      localStorage.setItem("onboardingCompleted", "true");

      navigate("/admin", { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white overflow-hidden flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">
        {/* ── LEFT SIDE – Command Center Visual ─────────────────── */}
        <div className="relative lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-10 overflow-hidden min-h-[50vh] lg:min-h-screen">
          {/* Layered background */}
          <div className="absolute inset-0 bg-[#0d0e12]">
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(#e50a15 1px, transparent 1px), linear-gradient(90deg, #e50a15 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(229,10,21,0.08)_0%,transparent_60%)]" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d0e12] via-transparent to-[#0a0b0e]" />
          </div>

          {/* Top-left brand */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center shadow-lg shadow-primary/20">
                <div className="grid grid-cols-2 gap-[3px] w-[14px] h-[14px]">
                  <div className="bg-white rounded-[1px]" />
                  <div className="bg-white/60 rounded-[1px]" />
                  <div className="bg-white/60 rounded-[1px]" />
                  <div className="bg-white rounded-[1px]" />
                </div>
              </div>
              <div>
                <span className="text-primary text-sm font-bold tracking-tight font-jakarta">
                  MSQUARED
                </span>
                <span className="text-white/70 text-xs font-medium ml-1.5">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center lg:ml-8 py-8 max-w-md">
            {/* Badge */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 mb-6 w-fit">
              <Shield size={12} className="text-primary" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
                Restricted Access
              </span>
            </div>

            <h2 className="text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-4 font-jakarta">
              System Command
              <br />
              <span className="text-primary">Center.</span>
            </h2>

            <p className="text-secondary/60 text-sm md:text-base font-light leading-relaxed max-w-sm mb-8">
              Authenticate to access the admin control plane — platform
              oversight, user management, moderation, and system-level
              configuration.
            </p>

            {/* Status indicators */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-secondary/50 text-xs uppercase tracking-[0.15em]">
                  All Systems Operational
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-secondary/50 text-xs uppercase tracking-[0.15em]">
                  Admin Portal Active
                </span>
              </div>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-primary/40 to-transparent" />
            <p className="text-secondary/30 text-[10px] uppercase tracking-[0.2em]">
              Encrypted Session
            </p>
          </div>
        </div>

        {/* ── RIGHT SIDE – Login Form ───────────────────────────── */}
        <div className="lg:w-1/2 flex flex-col items-center justify-start p-8 md:p-12 lg:p-8 bg-[#0a0b0e]">
          {/* Top-right support link */}
          <div className="w-full max-w-[420px] flex justify-end">
            <div className="flex items-center gap-2 text-secondary/50 hover:text-secondary/80 transition-colors cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-light tracking-wide">Support</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-[420px] bg-[#131418] border border-secondary/10 rounded-xl p-6 md:p-8 mt-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Lock size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold font-jakarta leading-tight">
                  Administrator Access
                </h2>
                <p className="text-secondary/40 text-xs font-light">
                  Authorized personnel only
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-medium block mb-2">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@msquared.io"
                    className="w-full bg-[#0d0e12] border border-secondary/10 hover:border-secondary/25 focus:border-primary/50 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-secondary/25 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-secondary/50 text-[10px] uppercase tracking-[0.15em] font-medium block">
                    Password
                  </label>
                  <Link
                    to="/resetpassword"
                    className="text-primary/70 hover:text-primary text-[11px] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0d0e12] border border-secondary/10 hover:border-secondary/25 focus:border-primary/50 rounded-lg py-3 pl-10 pr-11 text-sm text-white placeholder:text-secondary/25 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/30 hover:text-secondary/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/85 transition-colors text-white font-semibold py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    Access Control Panel
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-6">
              <div className="h-px flex-1 bg-secondary/10" />
              <span className="text-secondary/25 text-[10px] uppercase tracking-widest">
                Session
              </span>
              <div className="h-px flex-1 bg-secondary/10" />
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-2.5 mt-4">
              <Lock size={12} className="text-secondary/25 mt-0.5 flex-shrink-0" />
              <p className="text-secondary/30 text-[11px] leading-relaxed">
                All sessions are monitored and logged. Unauthorized access
                attempts will be reported to system security.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full max-w-[420px] mt-6 text-center">
            <p className="text-secondary/30 text-[10px]">
              © {currentYear} MSQUARED ADMIN PORTAL. ALL RIGHTS RESERVED.
            </p>
            <div className="flex justify-center gap-4 mt-1.5 text-secondary/20 text-[10px]">
              <a href="#" className="hover:text-secondary/40 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-secondary/40 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-secondary/40 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
