
import React from 'react';
import events from "/events.svg"
import { Link } from 'react-router-dom';
const HeroSection = () => {
    const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen bg-[#121317] text-white overflow-hidden font-inter">

      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero.png')",
          filter: 'brightness(1.2) contrast(1.1)',
          scale: '1.1'
        }}
      />


      <div className="absolute inset-0 bg-gradient-to-b from-[#121317]/40 via-[#121317]/50 to-[#121317]/80" />


      <nav className="relative z-20 flex items-center justify-between px-8 py-6 w-full mx-auto">
        <div  className="text-secondary text-3xl font-bold tracking-tighter"><Link to ="/">MSQUARED</Link></div>

        <div className="text-secondary/80 hover:text-secondary cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 01-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </nav>


      <div className="relative z-20 flex flex-col justify-center min-h-[calc(100vh-80px)] px-6 md:px-12 w-full mx-auto">
        <div className="max-w-2xl">

          <div className="flex items-center gap-2 text-secondary text-sm tracking-widest mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            THE MUSLIM EVENTS OS
          </div>


          <h1 className="text-6xl md:text-5xl font-bold leading-[1.05] tracking-tighter mb-6">
            Discover Your Next <span className="text-primary">Community</span> Moment.
          </h1>


          <p className="text-lg md:text-xl text-secondary max-w-lg leading-relaxed mb-10">
            The professional gateway to mobilizing, managing, and experiencing community events with high-energy precision.
          </p>


       <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="bg-primary hover:bg-primary/80 transition-colors text-white px-8 py-3 rounded-xl font-medium text-lg inline-block"
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="bg-[#121115] border border-gray-800 hover:bg-secondary/10 transition-colors text-white px-8 py-3 rounded-lg font-medium text-lg inline-block"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>


<div className="relative z-20">
  <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
    <div className="flex flex-wrap justify-end gap-12 md:gap-16">

      <div className="border border-gray-800 bg-[#141317] py-3 w-[130px] px-3 rounded-lg">
        <img src={events} className='w-4 h-4' alt="" />
        <p className="text-[10px] text-secondary mt-1">Active Leaders</p>
        <div className="flex items-center justify-start gap-2 text-secondary">
          <span className="text-lg text-white font-normal">1.2K+</span>
        </div>
      </div>


      <div className="border border-gray-800 bg-[#141317] py-3 w-[130px] px-3 rounded-lg">
        <img src={events} className='w-4 h-4' alt="" />
        <p className="text-[10px] text-secondary mt-1">Live Events</p>
        <div className="flex items-center justify-start gap-2 text-secondary">
          <span className="text-lg text-white font-normal">450</span>
        </div>
      </div>


      <div className="border border-gray-800 bg-[#141317] py-3 w-[130px] px-3 rounded-lg">
        <img src={events} className='w-4 h-4' alt="" />
        <p className="text-[10px] text-secondary mt-1">OS Response</p>
        <div className="flex items-center justify-start gap-2 text-secondary">
          <span className="text-lg text-white font-normal">24ms</span>
        </div>
      </div>
    </div>
  </div>
</div>


      <footer className="relative z-20 mt-10 border-t border-secondary/10 bg-black py-6 px-8 text-xs flex flex-col md:flex-row justify-between items-center gap-4 w-full mx-auto">
        <div className="flex flex-col items-start gap-1 sm:gap-2">
          <span className="text-white font-medium"><Link to ="/">MSQUARED</Link></span>
          <span className="text-secondary">© {currentYear} MSQUARED. THE MUSLIM EVENTS OS.</span>
        </div>
        <div className="flex gap-6 text-secondary">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-secondary transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;