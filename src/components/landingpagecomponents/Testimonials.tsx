import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Testimonials = () => {
  return (
    <section className="bg-[#7A6B4D] py-20 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Top Text with Plus Icon */}
        <div className="text-center mb-4">
          <p className="uppercase tracking-wide text-sm font-light flex items-center justify-center gap-1 text-[#FCF8EC]">
            <IoMdAdd className="text-[#FCF8EC]" /> HEAR FROM OUR COMMUNITY
          </p>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#FCF8EC] text-center mb-12">
          Testimonials & Success Stories
        </h2>

        {/* Testimonial Card */}
        <div className="rounded-3xl p-2">
          <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-6">
            {/* Left Side - Image (1/3) */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 rounded-xl lg:h-64 overflow-hidden">
                <img
                  src="/testimonial.svg"
                  alt="Testimonial"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Text (2/3) */}
            <div className="w-full md:w-2/3 text-center md:text-left">
              <p className="text-base sm:text-lg md:text-lg lg:text-2xl text-[#F6E5CF] leading-relaxed mb-12">
                "When I did try to work with our traditional agency, I realized quickly there was a difference. Podcasting is its own unique channel, and we really wanted someone who knew podcasts inside and out."
              </p>
              
              {/* Name with Half Underline */}
              <div className="relative inline-block">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  Lindsay Lapchuk
                </h3>
              </div>
              
              <p className="text-sm text-[#F6E5CF]/70 mt-1">
                Director of Communication
              </p>
            </div>
          </div>

          {/* Navigation Circles - Updated with light border */}
          <div className="flex justify-center md:justify-end gap-4 mt-8">
            <button className="w-12 h-12 rounded-full bg-transparent border border-[#F6E5CF] flex items-center justify-center text-[#F6E5CF] hover:bg-[#F6E5CF] hover:text-[#7A6B4D] transition-all duration-300">
              <FaArrowLeft className="text-lg" />
            </button>
            <button className="w-12 h-12 rounded-full bg-transparent border border-[#F6E5CF] flex items-center justify-center text-[#F6E5CF] hover:bg-[#F6E5CF] hover:text-[#7A6B4D] transition-all duration-300">
              <FaArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;