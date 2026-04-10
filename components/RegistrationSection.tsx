export default function RegistrationSection() {
  return (
    <section className="py-20 bg-[#f0f4f8]" id="registration">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Registration Plans</h2>
          <p className="text-gray-500 mb-4">Choose the plan that suits you best. Early bird registration ends soon.</p>
          <div className="w-16 h-1 bg-[#e8956a] rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-on-scroll">
          {/* IEEE Member */}
          <div className="bg-white rounded-lg border-l-4 border-l-[#00546B] border-t border-r border-b border-t-gray-200 border-r-gray-200 border-b-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-800 mb-2">IEEE Members</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-[#00546B]">₹700</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00546B]"></span> Full Access to All Sessions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00546B]"></span> Conference Kit
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00546B]"></span> Lunch &amp; High Tea
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00546B]"></span> Certificate of Participation
              </li>
            </ul>
            <button className="w-full py-3 bg-[#00546B] text-white rounded font-bold text-sm hover:brightness-110 transition-all">Register Now</button>
          </div>

          {/* Non-IEEE Member */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Non-IEEE Members</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-slate-700">₹1000</span>
            </div>
            <ul className="space-y-3 mb-8">
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
            <button className="w-full py-3 border-2 border-[#00546B] text-[#00546B] rounded font-bold text-sm hover:bg-[#00546B] hover:text-white transition-all">Register Now</button>
          </div>
        </div>

        {/* Registration Rules */}
        <div className="max-w-4xl mx-auto mt-12 animate-on-scroll">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
            <h4 className="text-amber-800 font-bold text-base mb-3 flex items-center gap-2">
              ⚠️ Registration Rules
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mr-2"></span>
                <strong>Non-Transferable &amp; Non-Refundable:</strong> Registration is non-transferable and non-refundable
              </li>
              <li className="text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mr-2"></span>
                <strong>Workshop Allocation:</strong> Workshop seats will be allocated on a first-come, first-served basis
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
