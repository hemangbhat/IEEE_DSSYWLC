export default function AboutSection() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="section-container animate-on-scroll">
        {/* About text block */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <p className="text-gray-600 leading-relaxed mb-6">
            The DSSYWLC 2025 represents a premier flagship event of the IEEE Delhi Section. It serves as a unified platform bringing together three vital pillars of the engineering community: Young Professionals &amp; Students, Women in Engineering (WIE), and Life Members.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to foster a collaborative environment where experience meets innovation. Through technical sessions, leadership workshops, and networking forums, we aim to bridge the generational and gender gap in engineering, paving the way for sustainable technological advancement.
          </p>
        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <span className="material-symbols-outlined text-[#00546B] text-4xl mb-4 block">school</span>
            <h4 className="text-slate-800 font-bold text-base mb-2">Academia-Industry Collaboration</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Bridging the gap between theoretical knowledge and industrial application through expert discourse.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-[#00546B] text-4xl mb-4 block">diversity_3</span>
            <h4 className="text-slate-800 font-bold text-base mb-2">Leadership Development</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Cultivating the next generation of engineering leaders through mentorship and strategic workshops.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-[#00546B] text-4xl mb-4 block">star</span>
            <h4 className="text-slate-800 font-bold text-base mb-2">Empowerment</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Dedicated tracks for Women in Engineering (WIE) to foster inclusivity and representation in STEM.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-[#00546B] text-4xl mb-4 block">groups</span>
            <h4 className="text-slate-800 font-bold text-base mb-2">Community Engagement</h4>
            <p className="text-sm text-gray-500 leading-relaxed">Strengthening the IEEE Delhi Section community through networking and shared technological vision.</p>
          </div>
        </div>
      </div>

      {/* Organized By */}
      <div className="py-20 bg-white mt-16 border-t border-gray-100">
        <div className="section-container text-center animate-on-scroll">
          <p className="text-[#c9a227] font-bold text-sm uppercase tracking-widest mb-3">Organized By</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">IEEE Delhi Section Student Activities Committee</h2>
          <p className="text-gray-500 leading-relaxed max-w-3xl mx-auto">
            The Student Activities Committee (SAC) of IEEE Delhi Section is dedicated to the holistic development of student members across North India. With over 100+ active student branches, we strive to provide technical exposure, leadership opportunities, and professional networking platforms.
          </p>
        </div>
      </div>
    </section>
  );
}
