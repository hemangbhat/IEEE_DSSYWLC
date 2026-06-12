import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col overflow-hidden">
      {/* 1. Main Hero Area (Above Part with premium background picture) */}
      <div className="relative min-h-[75vh] flex items-center py-28 md:py-36 z-0">
        {/* Background Image with normal brightness */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/logos/image.webp')" }}
        />
        {/* Legibility scrim: darker behind the left-aligned text, fades to
            transparent over India Gate so the photo stays vivid on the right */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="relative z-10 section-container animate-on-scroll">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl  lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              IEEE Delhi Section Students, Young Professionals, Women in
              Engineering and Life Members Congress
            </h1>

            <p className="text-lg text-white/90 max-w-2xl mb-7 leading-relaxed" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              Converging young minds, visionary women engineers, and distinguished
              life members for a future of innovation.
            </p>

            <div className="mb-10 flex flex-col gap-3 text-sm font-bold text-white sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 md:text-base">
              <div className="flex items-center gap-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-[#F2C14E]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <path d="M3 10h18" />
                  <path d="M5 4h14a2 2 0 0 1 2 2v16H3V6a2 2 0 0 1 2-2Z" />
                </svg>
                <span style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  20-21 June 2026
                </span>
              </div>

              <span className="hidden h-5 w-px bg-white/30 sm:block" />

              <div className="flex items-center gap-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-[#F2C14E]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  Netaji Subhas University of Technology (NSUT)
                </span>
              </div>
            </div>
            {/* Enhanced CTA buttons with rounded corners and hover animations */}

            <div className="flex flex-wrap gap-4">
              <a
                href="#schedule"
                className="px-8 py-3 bg-white text-[#7B1F34] rounded-xl font-bold text-sm hover:bg-gray-100 hover:scale-105 duration-300 transition-all shadow-md inline-block"
              >
                View Schedule
              </a>
              <Link
                href="/register"
                className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold text-sm hover:bg-white/10 hover:scale-105 duration-300 transition-all shadow-md inline-block"
              >
                Register Now
              </Link>
              <Link
                href="/bulk-register"
                className="px-8 py-3 border-2 border-white/60 text-white/90 rounded-xl font-bold text-sm hover:bg-white/10 hover:scale-105 duration-300 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  group
                </span>
                Bulk Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Organized By Area — fully centered, premium dark themed strip */}
      <div className="relative z-10 bg-[#120205] border-t border-[#7B1F34]/25 py-6 md:py-8">
        <div className="section-container animate-on-scroll">
          {/* Label centered above */}
          <p className="text-center text-[10px] uppercase tracking-[0.25em] font-bold text-white/40 mb-6">
            Organized by
          </p>
          {/* Logos row — centered, with thin separators */}
          <div className="flex flex-wrap items-center justify-center gap-0">
            {/* DSSYWLC */}
            <div className="flex items-center justify-center px-6 md:px-10 py-2 border-r border-white/10 last:border-r-0">
              <img
                src="/logos/dssywlc-logo.png"
                alt="DSSYWLC '25, IEEE Delhi Section SAC"
                className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
            {/* NSUT Branch */}
            <div className="flex items-center justify-center px-6 md:px-10 py-2 border-r border-white/10">
              <img
                src="/logos/ssn-logo.png"
                alt="IEEE NSUT Student Branch"
                className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
            {/* IEEE */}
            <div className="flex items-center justify-center px-6 md:px-10 py-2 border-r border-white/10">
              <img
                src="/logos/ieee-logo.png"
                alt="IEEE Delhi Section Student Activities Committee"
                className="h-16 w-auto object-contain opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
            {/* WIE — white pill container so purple logo is visible */}
            <div className="flex items-center justify-center px-6 md:px-10 py-2">
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="/logos/wie logo purple.png"
                  alt="IEEE Women in Engineering"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
