import { HiArrowLongRight } from "react-icons/hi2";

const CTA = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#897957] p-4 md:p-10 lg:p-10">
      <div className="relative w-full max-w-[1256px] rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/bgimg.png')" }}
        ></div>
        
        {/* Black Overlay with Opacity */}
        <div className="absolute inset-0 bg-black/75"></div>
        
        {/* Content */}
        <div className="relative z-10 text-white rounded-3xl p-6 md:p-10 lg:p-16 text-center">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold">Join The Revival Of The Sunnah</h1>
          <p className="mt-4 text-xs md:text-sm lg:text-base text-gray-300 max-w-3xl mx-auto px-4 md:px-8 lg:px-20">
            The Medina House Platform is not just a digital tool; it's a movement—a call to restore 
            the Sunnah of the Prophet Muhammad ﷺ in our modern communities.
          </p>
          
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <button className="flex items-center justify-center gap-1 px-6 py-2 bg-[#FCF8EC] text-[#7A6B4D] rounded-md font-semibold text-sm shadow-md hover:bg-gray-200 transition">
              Sign Up <HiArrowLongRight />
            </button>
            <button className="px-6 py-2 border border-white rounded-md font-normal shadow-md hover:bg-white hover:text-black transition">
              Support the Movement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;