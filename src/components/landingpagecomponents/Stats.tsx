const Stats = () => {
  return (
    <section className="bg-[#7A6B4D] py-20 px-4 sm:px-6 lg:px-16">
      <div className="container mx-auto max-w-7xl">
        {/* Top Text */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-wide text-xs sm:text-sm font-light text-[#FCF8EC] mb-2">
            + EFFICIENT MANAGEMENT AND COMMUNITY ENGAGEMENT
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#FCF8EC]">
            Medina House CRM Worldwide
          </h2>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Total Join Countries */}
          <div className="bg-[#E3CFB7] rounded-2xl p-6 md:py-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="/globe.svg" 
                  alt="Globe icon" 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-2xl text-center pb-1 sm:text-3xl md:text-4xl font-bold text-black leading-tight">
                  42+
                </div>
                <div className="text-sm sm:text-base md:text-md text-black/70 mt-1">
                  Total Join Countries
                </div>
              </div>
            </div>
          </div>

          {/* Total Join Mosques */}
          <div className="bg-[#E3CFB7] rounded-2xl p-6 md:py-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="/mosque.svg" 
                  alt="Mosque icon" 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-2xl sm:text-3xl text-center pb-1 md:text-4xl font-bold text-black leading-tight">
                  532+
                </div>
                <div className="text-sm sm:text-base md:text-md text-black/70 mt-1">
                  Total Join Mosques
                </div>
              </div>
            </div>
          </div>

          {/* Total Join Students */}
          <div className="bg-[#E3CFB7] rounded-2xl p-6 md:py-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="/mortarboard.svg" 
                  alt="Mortarboard icon" 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-2xl sm:text-3xl text-center pb-1 md:text-4xl font-bold text-black leading-tight">
                  6,347+
                </div>
                <div className="text-xs sm:text-base md:text-md text-black/70 mt-1">
                  Total Join Students
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;