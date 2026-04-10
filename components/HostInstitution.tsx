export default function HostInstitution() {
  return (
    <section className="py-20 bg-[#f0f4f8]">
      <div className="section-container animate-on-scroll">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Host Institution</h2>
            <p className="text-gray-600 text-lg mb-1">Poornima Institute of Engineering &amp; Technology</p>
            <div className="w-16 h-1 bg-[#e8956a] rounded-full mb-8"></div>

            <p className="text-gray-500 leading-relaxed mb-6">
              Poornima Institute of Engineering and Technology (PIET) is an Autonomous institution in engineering education, established in the academic year 2007, affiliated with Rajasthan Technical University (Kota), approved by AICTE, and recognized under UGC 2(f). With over 1700 students, the institute offers eight specialized undergraduate engineering programs, focused on imparting robust technical skills and holistic development.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              In recognition of its sustained quality enhancement, PIET was accredited with NAAC &apos;A&apos; Grade in 2025. PIET has consistently ranked among the top five institutions under the QIV Ranking by RTU, Kota and holds a Diamond rating by QS I-Gauge.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e8956a]"></span>
                <span className="text-slate-700 font-semibold text-sm">NAAC Accredited Programs</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e8956a]"></span>
                <span className="text-slate-700 font-semibold text-sm">Top-Tier Research Labs</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#e8956a]"></span>
                <span className="text-slate-700 font-semibold text-sm">Award-Winning IEEE SB</span>
              </li>
            </ul>

            <a href="https://poornimainstitute.edu.in" target="_blank" rel="noopener noreferrer" className="text-[#00546B] font-semibold text-sm hover:underline inline-flex items-center gap-1">
              Visit Institute Website <span className="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>

          {/* Right: image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              className="w-full h-full object-cover"
              alt="Poornima Institute campus"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo9fGP_rCsilouwZjARaG_z_HtX4lJTKlvgsuQMajtiokI2l4X2Rc-jhszN2hZpn480IEaNNgjZFvwSWEM3p_W_13xxaeZRPCTV5dSWt_meD9Nkx3QqbujptYb0fF9YT-M5GUhqNkrAkwSwS26I5xqyqetidW8-e3r_79dVrT6frDgS_LYg2yhkhXtYRSKxamUBLpjQ-dJOvKTwEo30pUoDudWBRqDvXktd5b_Y9fV4qycC6uG-d4ewyxxd3o2hco4IXIoV4Xprik"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
