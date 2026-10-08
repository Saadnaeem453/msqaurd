
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CompletionPageProps {
  userName: string;
  location: string;
  interests: string[];
  onReviewPreferences: () => void;
}

const CompletionPage: React.FC<CompletionPageProps> = ({
  userName,
  location,
  interests,
  onReviewPreferences,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vy: number;
      vx: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#e50a15', '#e9bcb6', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b6b'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentYear = new Date().getFullYear();
  const topInterest = interests.length > 0 ? interests[0] : 'Islamic Talks';
  const displayName = userName || 'User Name';
  const displayLocation = location || 'London';

  return (
    <div className="min-h-screen bg-[#121317] text-white font-inter flex flex-col relative overflow-hidden">

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />


      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl text-center">

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>


          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            You're all set, <span className="text-primary">{displayName}</span>!
          </h1>


          <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto mb-8">
            Based on your interest in{' '}
            <span className="text-white font-medium">{topInterest}</span> and location in{' '}
            <span className="text-white font-medium">{displayLocation}</span>, we've found 12 events for you.
          </p>


          <div className="relative">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute w-[80%] h-[80%] bg-primary/10 rounded-full blur-2xl"></div>
            </div>

            <div className="relative space-y-4 text-left">

              <div className="bg-black/80 backdrop-blur-sm rounded-xl p-5 border border-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wider">TOP MATCH</span>
                  <span className="text-primary text-[10px] font-bold uppercase tracking-wider">ISLAMIC TALK</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-1">Spirituality in the Modern City</h3>
                <p className="text-secondary/50 text-xs font-light">
                  Central London Community Hub • 2.4 miles away
                </p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-secondary/10">
                  <h4 className="text-white text-sm font-semibold mb-0.5">Youth Leadership Circle</h4>
                  <p className="text-secondary/50 text-xs font-light">Tomorrow • East London</p>
                  <button className="mt-2 text-primary text-xs font-medium hover:text-secondary transition-colors">
                    VIEW DETAILS
                  </button>
                </div>

              </div>
            </div>
          </div>


          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/layout/overview', { replace: true })}
              className="w-full bg-primary hover:bg-primary/80 transition-colors text-white font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              Explore Events Near You →
            </button>
          </div>


          <div className="mt-4 text-center">
            <button
              onClick={onReviewPreferences}
              className="text-secondary/40 text-xs font-light hover:text-secondary transition-colors"
            >
              Review My Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;