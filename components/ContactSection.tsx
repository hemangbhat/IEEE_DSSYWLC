export default function ContactSection() {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-on-scroll">
          {/* Left: Contact info */}
          <div>
            <p className="text-gray-500 text-sm mb-8">
              For inquiries regarding registration or sponsorship, please reach
              out to the respective coordinators.
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-2">
                  Congress Venue
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Netaji Subhas University of Technology (NSUT)
                  <br />
                  Azad Hind Fauj Marg, Sector-3, Dwarka
                  <br />
                  New Delhi – 110078, India
                </p>
              </div>

              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-2">
                  Contact
                </h4>
                <a
                  href="tel:+911125099017"
                  className="text-[#7B1F34] text-sm font-semibold hover:underline"
                >
                  +91 11 2509 9017
                </a>
                <p className="text-gray-400 text-xs mt-1">
                  9:30 AM to 6:00 PM, Mon–Fri
                </p>
              </div>

              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-2">
                  General Inquiries
                </h4>
                <a
                  href="mailto:academic@nsut.ac.in"
                  className="text-[#7B1F34] text-sm font-semibold hover:underline"
                >
                  academic@nsut.ac.in
                </a>
              </div>

              {/* Coordinators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <h5 className="text-slate-700 font-bold text-xs uppercase tracking-wider mb-3">
                    IEEE Student Branch Representatives
                  </h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Aditya Mishra —{" "}
                      <a
                        href="tel:+918826490096"
                        className="text-[#7B1F34] hover:underline"
                      >
                        88264 90096
                      </a>
                    </p>
                    <p>
                      Akshat Kacodia —{" "}
                      <a
                        href="tel:+919310823970"
                        className="text-[#7B1F34] hover:underline"
                      >
                        93108 23970
                      </a>
                    </p>
                  </div>
                </div>
                <div>
                  <h5 className="text-slate-700 font-bold text-xs uppercase tracking-wider mb-3">
                    IEEE Student Section Representatives
                  </h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Garima Singh</p>
                    <p>Shubham Gupta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map / How to Reach */}
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8">
              <iframe
                className="w-full h-[300px]"
                src="https://www.google.com/maps?q=Netaji+Subhas+University+of+Technology,+Dwarka,+New+Delhi&output=embed"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NSUT Dwarka Campus Map"
              />
            </div>

            <h4 className="text-slate-800 font-bold text-sm mb-4">
              How to Reach
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#7B1F34] text-lg mt-0.5">
                  train
                </span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">
                    Dwarka Mor Metro Station (Blue Line)
                  </p>
                  <p className="text-gray-400 text-xs">
                    ~1 km — 5–7 min by auto / 15 min walk
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#7B1F34] text-lg mt-0.5">
                  flight
                </span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">
                    From IGI Airport
                  </p>
                  <p className="text-gray-400 text-xs">~12 km drive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#7B1F34] text-lg mt-0.5">
                  train
                </span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">
                    From New Delhi Railway Station
                  </p>
                  <p className="text-gray-400 text-xs">~30 km drive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#7B1F34] text-lg mt-0.5">
                  directions_bus
                </span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">
                    DTC / Cluster Bus Routes
                  </p>
                  <p className="text-gray-400 text-xs">
                    764, 765, 850, D-068, DW-3, DW-4, AIR-08
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
