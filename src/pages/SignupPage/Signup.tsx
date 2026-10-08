
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/auth_service';
import { organizerApi } from '../../services/organizer.service';

declare global {
  interface Window {
    google: any;
    AppleID: any;
  }
}

type AccountType = 'attendee' | 'organizer';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>('attendee');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    agreeTerms: false,
    organizationName: '',
    organizationType: 'event_organizer' as 'masjid' | 'isoc' | 'event_organizer' | 'brand' | 'community',
    jobTitle: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleAccountTypeToggle = (type: AccountType) => {
    setAccountType(type);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (accountType === 'organizer' && !formData.organizationName.trim()) {
      setError('Organization name is required for organizer accounts');
      return;
    }

    setLoading(true);
    try {
      if (accountType === 'organizer') {
        const response = await organizerApi.signup({
          full_name: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          job_title: formData.jobTitle.trim() || undefined,
          bio: formData.bio.trim() || undefined,
          organization_name: formData.organizationName.trim(),
          organization_type: formData.organizationType,
        });

        const signupSucceeded = response.ok || response.success === true;

        if (signupSucceeded) {
          setSuccessMsg('Organizer account created! Please check your email for the verification code.');
          navigate('/verify-email', {
            state: { email: formData.email.trim(), accountType: 'organizer' },
            replace: true,
          });
        }
      } else {

        const response = await authApi.signup({
          full_name: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        const signupSucceeded = response.ok || response.success === true;

        if (signupSucceeded) {
          setSuccessMsg('Account created! Please check your email for the verification code.');
          navigate('/verify-email', {
            state: { email: formData.email.trim(), accountType: 'attendee' },
            replace: true,
          });
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignup = () => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.prompt();
      };
      document.body.appendChild(script);
    } else {
      window.google.accounts.id.prompt();
    }
  };

  const handleGoogleCallback = async (response: any) => {
    const idToken = response.credential;
    if (!idToken) {
      setError('Google sign‑in failed: no token received');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.googleLogin({ idToken });
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Google sign‑in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleAppleSignup = () => {
    if (!window.AppleID) {
      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.AppleID.auth.init({
          clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
          scope: 'name email',
          redirectURI: window.location.origin + '/callback',
          state: 'signup',
          usePopup: true,
        });
        window.AppleID.auth.signIn();
      };
      document.body.appendChild(script);
    } else {
      window.AppleID.auth.signIn();
    }
  };

  useEffect(() => {
    const handleAppleMessage = async (event: MessageEvent) => {
      if (event.origin !== 'https://appleid.apple.com') return;
      const data = event.data;
      if (data && data.id_token) {
        const idToken = data.id_token;
        setLoading(true);
        try {
          const result = await authApi.appleLogin({ idToken });
          if (result.success) {
            navigate('/dashboard');
          }
        } catch (err: any) {
          const msg = err.response?.data?.detail || 'Apple sign‑in failed.';
          setError(msg);
        } finally {
          setLoading(false);
        }
        window.removeEventListener('message', handleAppleMessage);
      }
    };
    window.addEventListener('message', handleAppleMessage);
    return () => window.removeEventListener('message', handleAppleMessage);
  }, [navigate]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#111214] text-white font-inter overflow-hidden flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">

        <div className="relative lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden min-h-[50vh] lg:min-h-screen">
          <div className="absolute inset-0 bg-[#111214]">
            <div className="absolute inset-0 "></div>
            <div className="absolute inset-0 opacity-60 bg-black">
              <img src="/signup.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-[8%] left-[20%] w-20 h-20 bg-primary/90 rounded-full blur-2xl"></div>
            <div className="absolute top-[15%] left-[60%] w-28 h-28 bg-primary/40 rounded-full blur-2xl"></div>
            <div className="absolute top-[30%] left-[35%] w-16 h-16 bg-primary/50 rounded-full blur-xl"></div>
            <div className="absolute top-[50%] left-[20%] w-24 h-24 bg-primary/50 rounded-full blur-3xl"></div>
            <div className="absolute top-[70%] left-[55%] w-32 h-32 bg-primary/60 rounded-full blur-2xl"></div>
            <div className="absolute top-[40%] left-[70%] w-12 h-12 bg-primary/40 rounded-full blur-xl"></div>
            <div className="absolute top-[82%] left-[30%] w-20 h-20 bg-primary/40 rounded-full blur-2xl"></div>
            <div className="absolute top-[5%] left-[45%] w-10 h-10 bg-primary/45 rounded-full blur-xl"></div>
            <div className="absolute top-[88%] left-[60%] w-16 h-16 bg-primary/40 rounded-full blur-2xl"></div>
            <div className="absolute top-[55%] left-[45%] w-14 h-14 bg-primary/40 rounded-full blur-xl"></div>
            <div className="absolute top-[22%] left-[78%] w-18 h-18 bg-primary/30 rounded-full blur-2xl"></div>
            <div className="absolute top-[65%] left-[75%] w-22 h-22 bg-primary/45 rounded-full blur-3xl"></div>
            <div className="absolute top-[38%] left-[12%] w-15 h-15 bg-primary/55 rounded-full blur-xl"></div>
            <div className="absolute top-[28%] left-[10%] w-12 h-12 bg-primary/40 rounded-full blur-2xl"></div>
            <div className="absolute top-[72%] left-[15%] w-20 h-20 bg-primary/40 rounded-full blur-3xl"></div>
            <div className="absolute top-[48%] left-[82%] w-16 h-16 bg-primary/35 rounded-full blur-2xl"></div>
            <div className="absolute top-[78%] left-[42%] w-18 h-18 bg-primary/50 rounded-full blur-3xl"></div>
          </div>


          <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
            <h1 className="text-primary text-3xl md:text-4xl font-bold font-inter tracking-tight mb-10">
              <Link to="/">MSQUARED</Link>
            </h1>
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 max-w-xl">
              Join the Global Muslim Event Graph.
            </h2>
            <p className="text-secondary pb-24 text-sm md:text-base font-light leading-relaxed max-w-md mb-8">
              Unlock a premium operating system designed for the next generation of community leaders and event organizers.
            </p>
            <div className="flex items-center gap-4 ">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border border-secondary/20 flex items-center justify-center text-[10px] text-secondary font-medium">A</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 border border-secondary/20 flex items-center justify-center text-[10px] text-secondary font-medium">M</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-secondary/20 flex items-center justify-center text-[10px] text-secondary font-medium">Z</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/25 to-secondary/5 border border-secondary/20 flex items-center justify-center text-[10px] text-secondary font-medium">K</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/35 to-primary/15 border border-secondary/20 flex items-center justify-center text-[10px] text-secondary font-medium">+</div>
              </div>
              <div>
                <div className="text-secondary text-base font-bold">+2.4k</div>
                <p className="text-secondary/50 text-[10px] font-light uppercase tracking-wider">organizers joined this week</p>
              </div>
            </div>
          </div>
        </div>


        <div className="lg:w-1/2 flex items-center justify-center p-4 md:p-6 lg:p-8 bg-[#111214]">
          <div className="w-full max-w-[420px] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-1">
              Create Account
            </h2>
            <p className="text-secondary text-base font-light mb-6">
              {accountType === 'organizer' ? 'Start organizing events for your community.' : 'Empowering your community journeys.'}
            </p>


            <div className="flex gap-2 mb-6 p-1 bg-secondary/5 rounded-lg border border-secondary/10">
              <button
                type="button"
                onClick={() => handleAccountTypeToggle('attendee')}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                  accountType === 'attendee'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-secondary hover:text-white hover:bg-secondary/10'
                }`}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeToggle('organizer')}
                className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                  accountType === 'organizer'
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-secondary hover:text-white hover:bg-secondary/10'
                }`}
              >
                Organizer
              </button>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Hassan Ahmed"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                  USERNAME
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="hassan_ahmed"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hassan@example.com"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                  required
                  minLength={6}
                />
              </div>


              {accountType === 'organizer' && (
                <>
                  <div className="pt-2 border-t border-secondary/10">
                    <label className="text-primary text-[10px] uppercase tracking-[0.15em] font-medium block mb-1.5">
                      ORGANIZATION NAME *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Al-Furqan Masjid"
                      className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                      ORGANIZATION TYPE
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none"
                    >
                      <option value="event_organizer" className="bg-[#111214]">Event Organizer</option>
                      <option value="masjid" className="bg-[#111214]">Masjid</option>
                      <option value="isoc" className="bg-[#111214]">ISOC (Islamic Society)</option>
                      <option value="brand" className="bg-[#111214]">Brand</option>
                      <option value="community" className="bg-[#111214]">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                      JOB TITLE (Optional)
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="Imam, Director, Coordinator"
                      className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
                      BIO (Optional)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your organization..."
                      rows={2}
                      className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm resize-none"
                    />
                  </div>
                </>
              )}


              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 bg-transparent border border-secondary/30 rounded checked:bg-primary checked:border-primary transition-colors cursor-pointer flex-shrink-0"
                  required
                />
                <label className="text-secondary text-xs leading-relaxed">
                  I agree to the <a href="#" className="text-white underline hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="text-white underline hover:text-primary transition-colors">Privacy Policy</a>.
                </label>
              </div>

              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              {successMsg && <p className="text-green-400 text-sm mt-2">{successMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Creating {accountType} account...
                  </>
                ) : (
                  <>
                    Create {accountType === 'organizer' ? 'Organizer' : ''} Account →
                  </>
                )}
              </button>
            </form>

            <p className="text-secondary/40 text-sm text-center mt-6">
              Already have an account? <Link to="/login" className="text-primary hover:text-primary transition-colors font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>


      <footer className="relative z-20 border-t border-secondary/10 bg-black py-6 px-8 text-xs flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="flex flex-col items-center md:items-start gap-1 sm:gap-2">
          <span className="text-white font-medium">MSQUARED</span>
          <span className="text-secondary">© {currentYear} MSQUARED. THE MUSLIM EVENTS OS.</span>
        </div>
        <div className="flex gap-6 text-secondary">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-secondary transition-colors">Help Center</a>
        </div>
      </footer>


      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Signup;