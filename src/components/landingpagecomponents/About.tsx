import { IoMdAdd } from "react-icons/io";
import { HiArrowLongRight } from "react-icons/hi2";

const About = () => {
  return (
    <section className="bg-[#897957] text-white py-16 px-4 sm:px-6 lg:px-16" id="About">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-7xl">
        {/* Left Text Section - Height matched to image */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between h-full">
          <div className="text-center lg:text-left">
            <p className="uppercase tracking-wide text-xs sm:text-sm font-light flex items-center justify-center lg:justify-start gap-1 text-[#FCF8EC] mb-1">
              <IoMdAdd className="text-[#FCF8EC] text-sm" />THE STORY OF MEDINA HOUSE
            </p>
            
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#FCF8EC] leading-tight mb-3">
              A Sunnah Inspired By <br />The Prophet ﷺ
            </h2>
          </div>

          {/* Content section - Compact to match image height */}
          <div className="space-y-2">
            <div className="border border-transparent rounded-lg bg-transparent">
              <p className="text-justify text-xs leading-snug text-[#FCF8ECB2]">
                A brief historical recount of Masjid Quba's significance during the Prophet's ﷺ Hijrah and how it shaped the role of masjids as community hubs. Highlight how this legacy inspired the vision of Medina House.
              </p>
            </div>
            
            <div className="border border-transparent rounded-lg bg-transparent">
              <p className="text-justify text-xs leading-snug text-[#FCF8ECB2]">
                Historical Overview: Start by explaining Masjid Quba's importance during the Prophet's ﷺ Hijrah (migration) to Medina. When the Prophet ﷺ arrived in Medina, his first act was to lay the foundation of Masjid Quba, which became a hub for learning, social interaction, and community building.
              </p>
            </div>
            
            <div className="border border-transparent rounded-lg bg-transparent">
              <p className="text-justify text-xs leading-snug text-[#FCF8ECB2]">
                The Role of Masjid Quba: Highlight how it wasn't just a space for worship, but also for resolving conflicts, spreading knowledge, and fostering unity among different tribes. This diverse role in community life is key to understanding how masjids should function.
              </p>
            </div>
            
            <div className="border border-transparent rounded-lg bg-transparent">
              <p className="text-justify text-xs leading-snug text-[#FCF8ECB2]">
                The Prophet ﷺ established a model where every masjid should serve as a comprehensive space for faith, education, culture, and social unity. This legacy of Masjid Quba laid the groundwork for what masjids should continue to be: vibrant, thriving centers of community life.
              </p>
            </div>
          </div>

          {/* Button section */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button className="px-4 py-2 bg-[#FCF8EC] text-brown font-medium rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-1 text-xs sm:text-sm">
              Join the Movement<HiArrowLongRight />
            </button>
            <button className="px-4 py-2 bg-transparent text-white border border-[#F6E5CF] font-medium rounded-xl shadow-md hover:shadow-lg transition-shadow text-xs sm:text-sm">
              Get Involved
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="rounded-3xl overflow-hidden shadow-lg w-full">
            <img
              src="/src/assets/featureimg.png"
              alt="House of Wisdom Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;