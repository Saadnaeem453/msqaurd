
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { onboardingApi, OnboardingSubmitData } from '../../../services/onboarding_service';


import islamicimg from '/onboarding_icons/islamic.svg';
import sportsimg from '/onboarding_icons/sports.svg';
import artimg from '/onboarding_icons/arts.svg';
import socialimg from '/onboarding_icons/socials.svg';
import networkingimg from '/onboarding_icons/networking.svg';
import charityimg from '/onboarding_icons/charity.svg';


import ummaImage from '/onboarding_icons/umma.png';
import CompletionPage from './CompletionPage';


const categories = [
  'Islamic Talks',
  'Sports',
  'Socials',
  'Networking',
  'Charity',
  'Arts & Culture',
];

const categoryIcons: Record<string, string> = {
  'Islamic Talks': islamicimg,
  Sports: sportsimg,
  Socials: socialimg,
  Networking: networkingimg,
  Charity: charityimg,
  'Arts & Culture': artimg,
};


const categoryIdMap: Record<string, string> = {
  'Islamic Talks': 'islamic_talks',
  Sports: 'sports',
  Socials: 'socials',
  Networking: 'networking',
  Charity: 'charity',
  'Arts & Culture': 'arts_culture',
};
const categoryNameMap: Record<string, string> = {};
Object.entries(categoryIdMap).forEach(([name, id]) => {
  categoryNameMap[id] = name;
});

const OnboardingPage = () => {
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [locationInput, setLocationInput] = useState('');
  const [mapLat, setMapLat] = useState(51.505);
  const [mapLng, setMapLng] = useState(-0.09);
  const [zoom, setZoom] = useState(14);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');


  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const fullName = user?.full_name || 'User';


  useEffect(() => {
    const fetchStep = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await onboardingApi.getStep();
        const payload = (res?.data ?? {}) as Record<string, any>;
        const stepPayload = payload.data ?? payload;

        const rawStep = stepPayload?.step ?? payload?.step ?? payload?.current_step ?? 1;
        const resolvedStep = Number(rawStep);
        const currentStep = Number.isFinite(resolvedStep) && resolvedStep >= 1 && resolvedStep <= 4
          ? resolvedStep
          : 1;

        const onboardingCompleted = Boolean(
          stepPayload?.onboarding_completed ?? payload?.onboarding_completed ?? false
        );

        if (onboardingCompleted) {
          navigate('/layout/overview');
          return;
        }

        setStep(currentStep);


        if (currentStep === 1) {
          const stepData = stepPayload?.data ?? stepPayload ?? {};
          if (stepData.city) setLocationInput(stepData.city);
          else if (stepData.zip_code) setLocationInput(stepData.zip_code);
          if (stepData.latitude && stepData.longitude) {
            setMapLat(parseFloat(stepData.latitude as any));
            setMapLng(parseFloat(stepData.longitude as any));
          }
        } else if (currentStep === 2) {
          const categoriesData = stepPayload?.data?.categories ?? stepPayload?.categories ?? [];
          const selected = categoriesData
            ?.filter((c: any) => c.selected)
            .map((c: any) => c.id) || [];
          const names = selected.map((id: string) => categoryNameMap[id] || id);
          setSelectedCategories(names);
        } else if (currentStep === 3) {
          const stepData = stepPayload?.data ?? stepPayload ?? {};
          if (stepData.age_group) setAgeGroup(stepData.age_group);
          if (stepData.gender_preference) setGender(stepData.gender_preference);
          if (stepData.dob) setDob(stepData.dob);
        }
      } catch (err) {
        console.error('Failed to fetch onboarding step:', err);
        setStep(1);
      } finally {
        setFetching(false);
      }
    };

    fetchStep();
  }, [navigate]);


  const getMapSrc = (lat: number, lng: number, z: number) => {
    const offset = 0.05 / (z / 14);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - offset}%2C${lat - offset}%2C${lng + offset}%2C${lat + offset}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  const geocodeLocation = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
      });
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapLat(parseFloat(lat));
        setMapLng(parseFloat(lon));
        setZoom(14);
        setLocationInput(query.trim());
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error fetching location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapLat(latitude);
          setMapLng(longitude);
          setZoom(15);
          setLocationInput(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          setLoading(false);
        },
        () => {
          alert('Unable to detect your location. Please enter a city or zip code.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') geocodeLocation(locationInput);
  };


  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };


  const handleFinalize = async () => {
    const payload: OnboardingSubmitData = {
      city: locationInput,
      zip_code: '',
      latitude: mapLat,
      longitude: mapLng,
      interests: selectedCategories.map(name => categoryIdMap[name]),
      age_group: ageGroup,
      gender_preference: gender,
      dob: dob || undefined,
    };

    try {
      const res = await onboardingApi.submitOnboarding(payload);
      if (res.data.success) {
        localStorage.setItem('onboardingCompleted', 'true');
        setStep(4);
      } else {
        alert(res.data.detail || 'Onboarding failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
    }
  };


  const goToNextStep = () => {
    if (step === 3) {
      handleFinalize();
    } else {
      setStep(step + 1);
    }
  };

  const goToPrevStep = () => setStep(step - 1);


  const currentYear = new Date().getFullYear();

  const TopBar = () => (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center border-b border-secondary/10">
      <h1 className="text-primary text-2xl md:text-3xl font-bold font-inter tracking-tight"><Link to="/">MSQUARED</Link></h1>
      <div className="flex items-center gap-2 text-secondary/70 hover:text-secondary transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-light tracking-wide">Support</span>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="border-t border-secondary/10 bg-black py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-white font-medium"><Link to="/">MSQUARED</Link></span>
          <span className="text-secondary">© {currentYear} MSQUARED. THE MUSLIM EVENTS OS.</span>
        </div>
        <div className="flex gap-6 text-secondary">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-secondary transition-colors">Help Center</a>
        </div>
      </div>
    </footer>
  );


  const Step1 = () => (
    <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-8 lg:py-12 gap-8 lg:gap-12">
      <div className="lg:w-1/2 flex flex-col justify-center">
        <div className="text-secondary text-xs uppercase tracking-[0.2em] font-light mb-2">STEP 1 OF 3</div>
        <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-3">
          Where are you located?
        </h2>
        <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-sm mb-8">
          We'll show you events and communities happening in your immediate vicinity.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light block mb-1.5">
              ENTER CITY OR ZIP CODE
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. New York, NY"
                className="w-full bg-transparent border-b border-secondary/10 hover:border-secondary/30 focus:border-primary transition-colors pl-10 py-2 text-white text-sm outline-none placeholder:text-secondary/30 placeholder:text-sm"
              />
              <button
                onClick={() => geocodeLocation(locationInput)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-secondary transition-colors text-xs font-medium"
                disabled={loading}
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>
          </div>
          <button
            onClick={handleAutoDetect}
            className="w-full bg-black hover:bg-primary/10 text-secondary text-sm font-light transition-colors flex items-center justify-center gap-2 py-2.5 rounded-lg border border-secondary/10"
            disabled={loading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {loading ? 'Locating...' : 'Auto-detect my location'}
          </button>
        </div>
        <div className="flex items-center justify-between mt-8">
          <Link to="/" className="text-secondary/60 hover:text-secondary transition-colors text-sm font-light flex items-center gap-1">
            ← Back
          </Link>
          <button
            onClick={goToNextStep}
            className="bg-primary hover:bg-primary/80 transition-colors text-white font-medium px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 h-[300px] md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden border border-secondary/10 relative">
        <iframe
          src={getMapSrc(mapLat, mapLng, zoom)}
          style={{ width: '100%', height: '100%', border: 'none' }}
          loading="lazy"
          title="Location Map"
          className="bg-[#1a1a1a]"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-secondary text-sm">
            Loading map...
          </div>
        )}
      </div>
    </div>
  );


  const Step2 = () => (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-secondary text-xs uppercase tracking-[0.2em] font-light mb-2">STEP 2 OF 3</div>
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2">
          What interests you?
        </h2>
        <p className="text-secondary text-sm md:text-base font-light leading-relaxed mb-8">
          Select categories to personalize your event feed. You can select multiple.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all border ${isSelected ? 'border-primary bg-primary/10' : 'border-secondary/20 hover:border-secondary/60'
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#292a2e] flex items-center justify-center">
                  <img src={categoryIcons[category]} alt={category} className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                  {category}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={goToPrevStep}
            className="text-secondary/60 hover:text-secondary transition-colors text-sm font-light flex items-center gap-1"
          >
            ← Back
          </button>
          <button
            onClick={goToNextStep}
            className="bg-primary hover:bg-primary/80 transition-colors text-white font-medium px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );


  const Step3 = () => (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-secondary text-xs uppercase tracking-[0.2em] font-light mb-2">
          STEP 3 OF 3
        </div>
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-2">
          Tell us a bit more about yourself.
        </h2>
        <p className="text-secondary text-sm md:text-base font-light leading-relaxed mb-8 max-w-2xl">
          We use this information to personalize your event feed and suggest local Muslim community circles that fit your lifestyle.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 md:flex-[7]">
            <div className="mb-6">
              <div className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light mb-3">
                SELECT AGE GROUP
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { age: '18-24', stage: 'Student / Early Career' },
                  { age: '25-34', stage: 'Professional' },
                  { age: '35+', stage: 'Established' },
                ].map((item) => (
                  <button
                    key={item.age}
                    onClick={() => setAgeGroup(item.age)}
                    className={`bg-black rounded-xl p-4 text-center transition-all border ${ageGroup === item.age
                      ? 'border-primary'
                      : 'border-secondary/10 hover:border-secondary/30'
                      }`}
                  >
                    <div className="text-white text-xl mb-2 font-bold">{item.age}</div>
                    <div className="text-secondary/70 text-[10px] font-light uppercase tracking-wider">
                      {item.stage}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-secondary text-[10px] uppercase tracking-[0.15em] font-light">
                  GENDER PREFERENCE
                </span>
                <span className="text-secondary/70 text-[10px] font-light">Optional</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {['brother', 'sister', 'prefer not to say'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${gender === g
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-secondary/20 text-secondary hover:border-secondary/60'
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-xl p-5 border-2 border-primary border-l-4">
              <h3 className="text-white text-sm font-bold tracking-wide">Privacy First.</h3>
              <p className="text-secondary/70 text-xs font-light mt-0.5">
                Your demographic data is encrypted and only used to filter public events.
              </p>
              <p className="text-secondary/50 text-xs font-light mt-0.5">
                It is never sold to third parties.
              </p>
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goToPrevStep}
                className="text-secondary/60 hover:text-secondary transition-colors text-sm font-light flex items-center gap-1"
              >
                ← Back
              </button>
              <button
                onClick={goToNextStep}
                className="bg-primary hover:bg-primary/80 transition-colors text-white font-medium px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
              >
                Finalize →
              </button>
            </div>
          </div>

          <div className="md:flex-[3] flex items-center justify-center">
            <div className="relative w-full max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden">
              <img src={ummaImage} alt="Ummah" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 p-4 text-left w-full bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-white text-lg font-bold leading-tight tracking-wider">
                  THE OS FOR
                </div>
                <div className="text-white text-lg font-bold leading-tight tracking-wider">
                  THE MODERN
                </div>
                <div className="text-white text-lg font-bold leading-tight tracking-wider">
                  UMMAH.
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-secondary text-[8px] tracking-wider font-light">
                    SYSTEM ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  if (fetching) {
    return (
      <div className="min-h-screen bg-[#121317] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary text-sm">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121317] text-white font-inter flex flex-col">
      <TopBar />
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && (
        <CompletionPage
          userName={fullName}
          location={locationInput || 'your city'}
          interests={selectedCategories}
          onReviewPreferences={() => setStep(2)}
        />
      )}
      <Footer />
    </div>
  );
};

export default OnboardingPage;