import Link from "next/link";

export default function RegistrationSection() {
  return (
    <section className="py-20 bg-white" id="registration">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Registration Plans</h2>
          <p className="text-gray-500 mb-4">Choose the plan that suits you best. Early bird registration ends soon.</p>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-on-scroll">
          {/* IEEE Member — Recommended */}
          <div className="bg-white rounded-lg border-2 border-[#7B1F34] p-8 shadow-sm relative">
            <div className="absolute -top-3 right-6 bg-[#7B1F34] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
              Recommended
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">IEEE Members</h3>
            <p className="text-3xl font-bold text-[#7B1F34] mb-6">₹700</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Full Access to All Sessions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Conference Kit
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Lunch &amp; High Tea
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Certificate of Participation
              </li>
            </ul>
          </div>

          {/* Non-IEEE Member */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Non-IEEE Members</h3>
            <p className="text-3xl font-bold text-slate-800 mb-6">₹1000</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Full Access to All Sessions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Conference Kit
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Lunch &amp; High Tea
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Certificate of Participation
              </li>
            </ul>
          </div>
        </div>

        {/* Single unified Register Now CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <Link
            href="/register"
            className="inline-block px-12 py-4 bg-[#7B1F34] text-white rounded-lg font-bold text-base hover:brightness-110 transition-all shadow-md"
          >
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
}
