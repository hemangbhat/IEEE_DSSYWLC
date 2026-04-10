export default function ContactSection() {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-on-scroll">
          {/* Left: Contact info */}
          <div>
            <p className="text-gray-500 text-sm mb-8">
              For inquiries regarding registration or sponsorship, please reach out to the respective coordinators.
            </p>

            <div className="space-y-8">
              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-2">Congress Venue</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Poornima Institute of Engineering &amp; Technology, Jaipur<br />
                  ISI - 2, Poornima Marg, Sitapura<br />
                  Jaipur, Rajasthan 302022, India
                </p>
              </div>

              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-2">Contact</h4>
                <a href="tel:+918302801639" className="text-[#00546B] text-sm font-semibold hover:underline">+91 8302801639</a>
              </div>

              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-2">General Inquiries</h4>
                <a href="mailto:ieee@poornima.org" className="text-[#00546B] text-sm font-semibold hover:underline">ieee@poornima.org</a>
              </div>

              {/* Coordinators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <h5 className="text-slate-700 font-bold text-xs uppercase tracking-wider mb-3">IEEE Student Branch Representatives</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Pranav Khandelwal — <a href="tel:+918302801639" className="text-[#00546B] hover:underline">+91 83028 01639</a></p>
                    <p>Kartikey Sharma — <a href="tel:+919413120504" className="text-[#00546B] hover:underline">+91 94131 20504</a></p>
                  </div>
                </div>
                <div>
                  <h5 className="text-slate-700 font-bold text-xs uppercase tracking-wider mb-3">IEEE Student Section Representatives</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Shubham Gupta — <a href="tel:+919667979306" className="text-[#00546B] hover:underline">+91 96679 79306</a></p>
                    <p>Garima Singh — <a href="tel:+919560884883" className="text-[#00546B] hover:underline">+91 95608 84883</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map / How to Reach */}
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-8">
              <img className="w-full h-[300px] object-cover" alt="Map view of PIET Jaipur" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDME8If4lXPmeOz3ez1yra5hT6s9IS4q9UnEYJsAjdY1nf22sexeSYspxmdXC_Ec78zMp4upYGxXhUzektXo0iWPhCJeouB538a2e5ArzhytHp7uYl2ZO1wRqJYsadAwbggUozmI4G8QmeqDPZp1UJvpzD0oTZFBJmuGWPivdnUTy6yqNZB7abMHBlkfUg0dDMz6bm0j8lPPLcu-ITrGpiimcn8yTuX2BGfUrz2zoF4Hdr8v12mGDsITn0xyvzI8bNqgZk8PAY9Qnk"/>
            </div>

            <h4 className="text-slate-800 font-bold text-sm mb-4">How to Reach</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00546B] text-lg mt-0.5">flight</span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">From Jaipur International Airport</p>
                  <p className="text-gray-400 text-xs">30 minutes drive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00546B] text-lg mt-0.5">train</span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">From Gandhinagar Railway Station</p>
                  <p className="text-gray-400 text-xs">40 minutes drive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#00546B] text-lg mt-0.5">train</span>
                <div>
                  <p className="text-slate-700 text-sm font-semibold">From Jaipur Central Station</p>
                  <p className="text-gray-400 text-xs">40 minutes drive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
