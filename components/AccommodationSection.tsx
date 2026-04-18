export default function AccommodationSection() {
  return (
    <section className="py-20 bg-[#f0f4f8]" id="accommodation">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Accommodation</h2>
          <p className="text-gray-500 mb-4">Comfortable stay options near the venue.</p>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 animate-on-scroll">
          {/* In-Campus */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-slate-800 font-bold text-base mb-1">In-Campus Hostel</h3>
                <p className="text-gray-500 text-sm">Standard Room</p>
              </div>
              <div className="text-right">
                <p className="text-[#7B1F34] font-bold text-xl font-mono">Rs. 500</p>
                <p className="text-gray-400 text-xs">per night</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Contact: Pranav Khandelwal</p>
              <a href="tel:+918302801639" className="text-[#7B1F34] font-semibold text-sm hover:underline">+91 83028 01639</a>
            </div>
          </div>

          {/* Hotel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-slate-800 font-bold text-base mb-1">Hotel Accommodation</h3>
                <p className="text-gray-500 text-sm">Room</p>
              </div>
              <div className="text-right">
                <p className="text-[#7B1F34] font-bold text-xl font-mono">Rs. 2500</p>
                <p className="text-gray-400 text-xs">per night</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Contact: Front Desk</p>
              <a href="tel:+911413103838" className="text-[#7B1F34] font-semibold text-sm hover:underline">+91 141 3103838</a>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-red-50 border-l-4 border-[#7B1F34] rounded-r-lg p-5">
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              <strong>In-Campus Hostel Update:</strong> On-campus room booking will be available from the afternoon of the 6th to the afternoon of the 8th.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              <strong>Food Provision:</strong> Meals will be provided only on the event dates, i.e., 7th and 8th February.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Note:</strong> In the event of an extreme emergency, you may contact us for last minute assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
