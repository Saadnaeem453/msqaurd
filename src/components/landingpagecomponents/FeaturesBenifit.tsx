import { IoMdAdd } from "react-icons/io";

const FeaturesBenifit = () => {
  return (
    <section className="bg-[#897957] text-white py-16 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-7xl">

        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="text-center lg:text-left">
            <p className="uppercase tracking-wide text-xs sm:text-sm font-light flex items-center justify-center lg:justify-start gap-1 text-[#FCF8EC] mb-1">
              <IoMdAdd className="text-[#FCF8EC] text-sm" />FEATURES & BENEFITS
            </p>

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#FCF8EC] leading-tight mb-3">
              Why Medina House?
            </h2>
          </div>


          <div className="space-y-2">

            <div className="border border-transparent rounded-lg p-2 bg-[#7A6B4D] bg-opacity-40">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Ease of Use</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                The platform is designed with simplicity in mind, ensuring that masjid admins and community members can easily navigate and access services without technical hurdles. It's intuitive and requires no advanced tech skills.
              </p>
            </div>


            <div className="border border-[#7A6B4D] border-opacity-50 rounded-lg p-2">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Comprehensive Tools</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                Medina House offers everything a masjid needs to run educational programs, cultural events, social services, and more—all under one centralized platform. No more juggling multiple systems; it's all integrated for your convenience.
              </p>
            </div>


            <div className="border border-[#7A6B4D] border-opacity-50 rounded-lg p-2">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Access Anytime, Anywhere</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                Optimized for both mobile devices and desktops, the platform allows users to access services and stay connected wherever they are.
              </p>
            </div>


            <div className="border border-[#7A6B4D] border-opacity-50 rounded-lg p-2">
              <h3 className="text-sm sm:text-base font-medium text-[#FCF8EC]">Community-Focused</h3>
              <p className="mt-0.5 text-justify text-xs text-[#FCF8ECB2] leading-snug">
                Designed with the community in mind, Medina House empowers masjids to create maintain strong bonds within their local Muslim community. From event organizing to social services, the platform helps masjids engage effectively with their members.
              </p>
            </div>
          </div>
        </div>


        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="rounded-3xl overflow-hidden shadow-lg w-full">
            <img
              src="/featureimg.svg"
              alt="Features Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBenifit;