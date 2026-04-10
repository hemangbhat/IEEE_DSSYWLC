export default function HeroSection() {
  return (
    <header className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="IEEE Delhi Section Congress"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCFguEiQfcA7VJXZ0rH8gt7f3Vzfh59eNjrMeMyYOWubIWdBGcMvXkVEUBDlaRGEzVoDom6soKTofj18YoEccwK0KxUMGidvtyT75rUdjaOHnxeMhsJCzWri2zHZC6U6KiiNEpFtPeKamAWJfUdBhrXFye7G23J1JBgvBFrSk1CcZI_ce6CSmvSE7nj87fCIxVOycdQrT13Xd8c3oBBOUbziljItOWwsrvdzWHWsmAcHOxAQicTVrTEueRxQgguOV6l9bK-unG2SE"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00546B]/90 via-[#00546B]/70 to-[#00546B]/40"></div>
      </div>

      {/* Content — left-aligned */}
      <div className="relative z-10 section-container py-20 animate-on-scroll">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-white/10 border border-white/20 mb-8">
            <span className="text-xs font-semibold text-white">Official Congress</span>
            <span className="text-white/60">•</span>
            <span className="text-xs text-white/80">IEEE Delhi Section</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
            Delhi Section Student, Young Professionals &amp; Women in Engineering and Life member Congress
          </h1>

          <p className="text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
            Converging young minds, visionary women engineers, and distinguished life members for a future of innovation.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-white text-[#00546B] rounded font-bold text-sm hover:bg-gray-100 transition-all shadow-md">
              View Schedule
            </button>
            <button className="px-8 py-3 bg-[#c9a227] text-white rounded font-bold text-sm hover:brightness-110 transition-all shadow-md">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
