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
              Delhi Section Student, Young Professionals &amp; Women in
              Engineering and Life Member Congress
            </h1>

            <p className="text-lg text-white/90 max-w-2xl mb-10 leading-relaxed" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              Converging young minds, visionary women engineers, and distinguished
              life members for a future of innovation.
            </p>
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
                alt="DSSYWLC '25 — IEEE Delhi Section SAC"
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
