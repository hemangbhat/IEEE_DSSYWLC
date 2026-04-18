export default function AccommodationSection() {
  return (
    <section className="py-20 bg-[#f0f4f8]" id="accommodation">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Accommodation</h2>
          <p className="text-gray-500 mb-4">Comfortable stay options near the venue.</p>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        {/* Table */}
        <div className="max-w-4xl mx-auto animate-on-scroll">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pr-4">Hotel Name</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pr-4">Distance from Venue</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pr-4">Room Charges</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-6 pr-4">
                    <p className="text-slate-800 font-bold text-sm">In-Campus Hostel</p>
                  </td>
                  <td className="py-6 pr-4">
                    <p className="text-gray-500 text-sm">In the Venue</p>
                  </td>
                  <td className="py-6 pr-4">
                    <p className="text-slate-800 text-sm">Standard Room: Rs. 500</p>
                  </td>
                  <td className="py-6">
                    <p className="text-slate-800 text-sm font-semibold">Jane Doe</p>
                    <a href="tel:+919876543210" className="text-[#7B1F34] text-sm font-semibold hover:underline">+91 98765 43210</a>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-6 pr-4">
                    <p className="text-slate-800 font-bold text-sm">Hotel Urban Cruise</p>
                  </td>
                  <td className="py-6 pr-4">
                    <p className="text-gray-500 text-sm">4 km from Venue</p>
                  </td>
                  <td className="py-6 pr-4">
                    <p className="text-slate-800 text-sm">Room: Rs. 2500</p>
                  </td>
                  <td className="py-6">
                    <p className="text-slate-800 text-sm font-semibold">Hotel Front Desk</p>
                    <a href="tel:+911411234567" className="text-[#7B1F34] text-sm font-semibold hover:underline">+91 141 1234567</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="bg-red-50 border-l-4 border-[#7B1F34] rounded-r-lg p-5 mt-10">
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
