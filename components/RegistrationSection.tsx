import Link from "next/link";

export default function RegistrationSection() {
  return (
    <section className="py-20 bg-white" id="registration">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Registration Plans</h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-on-scroll">
          {/* IEEE Member */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4">IEEE Members</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Access to all technical sessions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Delegate kit &amp; certificates
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34]"></span> Meals included both days
              </li>
            </ul>
          </div>

          {/* Non-IEEE Member */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Non-IEEE Members</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Access to all technical sessions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Delegate kit &amp; certificates
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Meals included both days
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
          <p className="text-gray-400 text-sm mt-3">Both IEEE and Non-IEEE members register here</p>
        </div>
      </div>
    </section>
  );
}
