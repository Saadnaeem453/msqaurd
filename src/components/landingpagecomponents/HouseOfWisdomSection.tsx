import { IoMdAdd } from "react-icons/io";

const HouseOfWisdomSection = () => {
  return (
    <section className="bg-brown text-white py-16 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-7xl">
        {/* Left Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="rounded-3xl overflow-hidden shadow-lg w-full">
            <img
              src="/src/assets/landingimg2.svg"
              alt="House of Wisdom Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right Text Section - Height matched to image */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="text-center lg:text-left">
            <p className="uppercase tracking-wide text-xs sm:text-sm font-light flex items-center justify-center lg:justify-start gap-1 text-[#FCF8EC] mb-1">
              <IoMdAdd className="text-[#FCF8EC] text-sm" />THE MEDINA HOUSE PITCH
            </p>
            
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#FCF8EC] leading-tight mb-3">
              Reviving the Sunnah for Modern Muslim Communities
            </h2>
          </div>

          {/* Content sections - Compact to match image height */}
          <div className="space-y-2">
            {/* Educational Programmes */}
            <div className="border border-transparent rounded-lg p-2 bg-[#897957] bg-opacity-40">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Educational Programmes</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                Our educational programmes offer a wide range of Quranic classes, Islamic history, and skills development for all ages.
              </p>
            </div>
            
            {/* Cultural & Social Activities */}
            <div className="border border-[#897957] border-opacity-50 rounded-lg p-2">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Cultural & Social Activities</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                Through engaging event activities, masjids can foster unity among the community, celebrate Islamic heritage, and bring people together in a spirit of collaboration.
              </p>
            </div>
            
            {/* Community Services */}
            <div className="border border-[#897957] border-opacity-50 rounded-lg p-2">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Community Services</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                We offer critical services such as mediation, counselling, financial aid, family support. The Medina House platform ensures that masjids serve as an accessible resource for individuals and families in need, promoting compassion, community welfare.
              </p>
            </div>
            
            {/* Youth Engagement */}
            <div className="border border-[#897957] border-opacity-50 rounded-lg p-2">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Youth Engagement</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                Empowering the next generation of Muslims is a key part of our mission. Through mentorship and leadership programmes, the platform helps youth develop the skills they need to lead with confidence, reinforcing the values of Islamic character.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HouseOfWisdomSection;