// pages/LoginPage/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/auth_service';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.signin({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user, detail, ok, verify } = response;
      const normalizedDetail = (detail || '').toLowerCase();
      const isEmailVerified = user?.email_verified === true || verify === true;

      // A failed signin response should surface as a credential error,
      // not as a redirect to the verify-email page.
      if (!ok || !(token && user)) {
        setError(detail || 'Login failed. Please check your credentials.');
        return;
      }

      const verificationRequired =
        verify === false ||
        user?.email_verified === false ||
        normalizedDetail.includes('verify') ||
        normalizedDetail.includes('verified') ||
        normalizedDetail.includes('verification') ||
        normalizedDetail.includes('otp') ||
        normalizedDetail.includes('code');

      // ─── EMAIL NOT VERIFIED – redirect without saving anything ──────────
      if (verificationRequired && !isEmailVerified) {
        const accountType = user?.role === 'organizer' ? 'organizer' : 'attendee';
        // ❌ Do NOT set localStorage here
        navigate('/verify-email', {
          replace: true,
          state: { email: (user?.email || formData.email.trim()), accountType },
        });
        return;
      }

      // ─── SUCCESSFUL LOGIN ────────────────────────────────────────────────

      // Determine account type
      const isOrganizer = user.role === 'organizer';
      const accountType = isOrganizer ? 'organizer' : 'attendee';

      // Organizers skip onboarding — set completed to true
      const onboardingCompleted = isOrganizer ? true : Boolean(user.onboarding_completed ?? false);

      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accountType', accountType);
      localStorage.setItem('onboardingCompleted', String(onboardingCompleted));

      // If email is not verified (should have been caught above, but just in case)
      if (!isEmailVerified) {
        navigate('/verify-email', {
          replace: true,
          state: { email: user.email, accountType },
        });
        return;
      }

      // Redirect based on role and onboarding
      if (isOrganizer) {
        navigate('/organizer', { replace: true });
      } else if (onboardingCompleted) {
        navigate('/layout/overview', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-black text-white font-inter overflow-hidden flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">
        {/* LEFT SIDE - Content with Background (unchanged) */}
        <div className="relative lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-8 overflow-hidden min-h-[50vh] lg:min-h-screen">
          <div className="absolute inset-0 bg-[#131418]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#131418] via-[#0f1013] to-[#0a0b0e]"></div>
            <div className="absolute inset-0 opacity-80">
              <img src="/login.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-primary text-2xl font-jakrata md:text-3xl font-bold font-inter tracking-tight">
              <Link to="/">MSQUARED</Link>
            </h1>
          </div>
          <div className="relative z-10 flex-1 flex flex-col justify-center lg:ml-20 py-8">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-lg">
              Welcome Back to the <span className="text-primary">Ecosystem.</span>
            </h2>
            <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-sm mb-8">
              Access the most powerful operating system for Muslim student events and community leadership.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
              <span className="text-secondary text-xs uppercase tracking-[0.2em] font-light">SYSTEM ONLINE</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form (unchanged) */}
        <div className="lg:w-1/2 flex flex-col items-center justify-start p-8 md:p-12 lg:p-8 bg-black">
          <div className="w-full max-w-[420px] flex justify-end">
            <div className="flex items-center gap-2 text-secondary/70 hover:text-secondary transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-light tracking-wide">Support</span>
            </div>
          </div>

          <div className="w-full max-w-[420px] bg-[#131418] md:mt-12 lg:mt-28 rounded-xl p-6 md:p-8 mt-4">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-1">Login</h2>
            <p className="text-secondary text-base font-light mb-6">Please enter your credentials to continue</p>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@organization.org"
                    className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                    PASSWORD
                  </label>
                  <div className="text-right mt-1">
                    <Link to="/resetpassword" className="text-primary text-xs hover:text-primary/80 transition-colors font-light">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="******"
                    className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Access Dashboard'}
              </button>
            </form>

            <p className="text-secondary text-sm text-center mt-6">
              Don't have an account? <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">Sign Up</Link>
            </p>
          </div>

          <div className="w-full max-w-[420px] mt-6 text-center">
            <p className="text-secondary/50 text-[10px]">© {currentYear} MSQUARED. THE MUSLIM EVENTS OS.</p>
            <div className="flex justify-center gap-4 mt-1 text-gray-500 text-[10px]">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;