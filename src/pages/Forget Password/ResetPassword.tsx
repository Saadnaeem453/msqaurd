// pages/Forget Password/ResetPassword.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import secureimg from '../../assets/secure.svg';
import supportimg from '../../assets/support.svg';
import { authApi } from '../../services/auth_service';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.sendPasswordResetCode(email.trim());
      if (!result.ok) {
        setError(result.detail || 'Failed to send reset link. Please try again.');
        setLoading(false);
        return;
      }
      setSuccess(true);
      // Navigate to new password page after a short delay
   
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#121317] text-white font-inter flex flex-col">
      {/* Top Bar - MSQUARED left, Question icon right */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-primary text-xl font-jakrata md:text-2xl font-bold font-inter tracking-tight">
          <Link to="/">MSQUARED</Link>
        </h1>
        <div className="flex items-center gap-2 text-secondary/70 hover:text-secondary transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-light tracking-wide">Support</span>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">
          {/* Form Container */}
          <div className="bg-black border border-border_color rounded-xl p-6 md:p-8 py-10">
            <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">
              Reset Your Password
            </h2>
            <p className="text-secondary text-sm md:text-base font-light leading-relaxed mb-6">
              Enter your registered email address below and we'll send you instructions to regain access to your OS.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="name@organization.com"
                    className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs font-light">{error}</p>}
              {success && <p className="text-green-400 text-xs font-light">Reset link sent! Redirecting...</p>}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Centered text under button */}
            <div className="mt-16 text-secondary/60 text-sm text-center space-y-2">
              <p className="flex items-center justify-center gap-2 mb-4">
                <span className="text-primary">•</span>
                <span>Expect an email within 2-3 minutes.</span>
              </p>
              <Link to="/login" className="flex items-center justify-center gap-2 hover:text-primary transition-colors">
                <span className="text-primary">←</span>
                <span className="text-gray-200 hover:text-primary">Back to Login</span>
              </Link>
            </div>
          </div>

          {/* Secure Access & Need Help - Row below form */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-black rounded-xl p-4 border border-secondary/20 flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-xl flex items-center justify-center">
                <img src={secureimg} className="w-5 h-5" alt="Secure" />
              </div>
              <div>
                <h3 className="text-gray-300 text-sm font-semibold mb-0.5">Secure Access</h3>
                <p className="text-secondary text-xs font-light">Multi-factor authentication ready.</p>
              </div>
            </div>
            <div className="bg-black rounded-xl p-4 border border-secondary/20 flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-xl flex items-center justify-center">
                <img src={supportimg} className="w-5 h-5" alt="Help" />
              </div>
              <div>
                <h3 className="text-gray-300 text-sm font-semibold mb-0.5">Need Help?</h3>
                <p className="text-secondary text-xs font-light">Support is available 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Full width, same as login */}
      <footer className="border-t border-secondary/10 bg-[#121317] py-6 px-4 text-xs flex flex-col md:flex-row justify-between items-center gap-4 w-full mx-auto">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-white font-medium"><Link to="/">MSQUARED</Link></span>
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

export default ResetPassword;