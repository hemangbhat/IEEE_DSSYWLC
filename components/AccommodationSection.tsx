export default function AccommodationSection() {
  const hotels = [
    {
      name: "New Moon",
      location: "Sector 13, Dwarka",
      contact: "070118 41234",
      pricing: [
        { label: "Double Sharing", price: "₹2,000 / night" },
        { label: "Extra Mattress", price: "₹300 - ₹400" },
      ],
      distance: "1.5 km",
    },
    {
      name: "Southwest Inn",
      location: "Sector 13, Dwarka",
      contact: "87004 10756",
      pricing: [
        { label: "Standard Room", price: "₹3,500 / night" },
        { label: "Breakfast", price: "Included" },
      ],
      distance: "2.0 km",
    },
    {
      name: "Hotel Grand Parisian",
      location: "Sector 13, Dwarka",
      contact: "011 4305 3102",
      pricing: [
        { label: "Standard Room", price: "₹3,500 / night (+ tax)" },
      ],
      distance: "2.0 km",
    },
    {
      name: "Hotel Dwarka Inn",
      location: "Sector 15, Dwarka",
      contact: "78408 00036",
      pricing: [
        { label: "Standard Room", price: "₹2,500 / night" },
      ],
      distance: "2.2 km",
    },
    {
      name: "FabHotel White House",
      location: "Sector 17, Dwarka",
      contact: "70424 24242",
      pricing: [
        { label: "Double Sharing", price: "₹3,192 / night" },
        { label: "Extra Mattress", price: "₹500" },
      ],
      distance: "3.1 km",
    },
    {
      name: "SSS Group Hotel",
      location: "Mahavir Enclave",
      contact: "98189 14386",
      pricing: [
        { label: "Double Sharing", price: "₹1,100 / night" },
        { label: "Triple Sharing", price: "₹1,400 / night" },
        { label: "Breakfast", price: "₹150 / person additional" },
      ],
      distance: "6.1 km",
    },
  ];

  return (
    <section className="py-20 bg-[#f0f4f8]" id="accommodation">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Accommodation
          </h2>
          <p className="text-gray-500 mb-4">
            Comfortable stay options near the venue, sorted by distance.
          </p>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        {/* Table Container */}
        <div className="max-w-5xl mx-auto animate-on-scroll">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Hotel Info
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Distance
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Room Rates & Options
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hotels.map((hotel, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Location */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-slate-800 font-bold text-base mb-1">
                            {hotel.name}
                          </p>
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-gray-400">
                              location_on
                            </span>
                            {hotel.location}
                          </p>
                        </div>
                      </td>

                      {/* Distance */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#7B1F34]/5 text-[#7B1F34] border border-[#7B1F34]/15">
                          <span className="material-symbols-outlined text-[14px]">
                            directions_walk
                          </span>
                          {hotel.distance}
                        </span>
                      </td>

                      {/* Room Rates */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5 max-w-sm">
                          {hotel.pricing.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs sm:text-sm bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 gap-4"
                            >
                              <span className="text-slate-500 font-medium">
                                {item.label}
                              </span>
                              <span className="text-slate-800 font-bold">
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-5">
                        {hotel.contact ? (
                          <span className="text-slate-600 text-sm font-medium">
                            {hotel.contact}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="max-w-3xl mx-auto mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#7B1F34] mt-0.5">
                info
              </span>
              <div className="space-y-2 text-sm text-slate-700">
                <p className="leading-relaxed">
                  <strong className="text-slate-800">In-Campus Hostel Update:</strong>{" "}
                  For the congress on 20–21 June 2026, on-campus hostel
                  accommodation availability is to be confirmed by 10th June 2026.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-slate-800">Note:</strong> In the event of an
                  extreme emergency, you may contact us for last-minute assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
