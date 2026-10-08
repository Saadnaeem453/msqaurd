
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animationRef = useRef(null);

  useEffect(() => {
    const duration = 5000;
    const targetProgress = 47;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      const currentProgress = Math.min((progressPercent / 100) * targetProgress, targetProgress);

      setProgress(Math.round(currentProgress));

      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] font-['Poppins',sans-serif] m-0 p-0 relative overflow-hidden">


      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '720px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(63, 17, 24, 0.75) 0%, rgba(63, 17, 24, 0.55) 25%, rgba(55, 20, 28, 0.40) 45%, rgba(40, 15, 22, 0.22) 65%, rgba(20, 10, 15, 0.08) 80%, transparent 92%)',
          borderRadius: '50%',
          filter: 'blur(18px)',
          zIndex: 1,
          opacity: 0.92,
        }}
      />

      <div className="flex flex-col items-center justify-center w-full max-w-[480px] mx-auto px-4 relative z-10">

        <h1 className="text-5xl font-extrabold font-jakarta text-primary mb-0 drop-shadow-[0_0_40px_rgba(255,59,59,0.8)]">
          <Link to ="/">MSQUARED</Link>
        </h1>


        <p className="text-[#E9BCB6] text-lg tracking-wider font-light text-center mt-10 mb-[60px]">
          Where the Ummah connects, attends, and grows.
        </p>


        <div className="w-[350px]">

          <div className="w-full h-[4px] bg-[#2a2a2f] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary rounded-full transition-all duration-75 ease-linear"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>


          <div className="flex justify-between items-center mt-2">
            <span className="text-[#E9BCB6] opacity-50 text-[10px] tracking-[0.2em] uppercase font-light">
              INITIALIZING OS
            </span>
            <span className="text-[#e9bcb6] text-[10px] font-light">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;