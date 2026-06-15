export default function GuestsSection() {
  const guests: { name: string; role: string; img: string; objectPosition?: string; objectFit?: string }[] = [
    {
      name: "Prof. Prerna Gaur",
      role: "Chair, IEEE India Council\nDirector, NSUT West Campus\nDirector, NSUT IIF",
      img: "https://res.cloudinary.com/dlia5xgwx/image/upload/v1770186781/drprernagaur_lp5okn.jpg",
    },
    {
      name: "Prof. M.N. Hoda",
      role: "Chair, IEEE Delhi Section\nDirector, BVICAM",
      img: "https://res.cloudinary.com/dlia5xgwx/image/upload/v1770186780/mnhoda_thmusc.jpg",
    },
    {
      name: "Prof. Rajnish Sharma",
      role: "Vice Chair, IEEE Delhi Section\nVC, Chitkara University",
      img: "/speakers/Rajnish-Sharma.png",
    },
    {
      name: "Dr. Abdul Quaiyam Ansari",
      role: "Chair, IEEE Delhi Section SIGHT\nProfessor, Jamia Millia Islamia",
      img: "/speakers/Abdul Q. Ansari.png",
    },
    {
      name: "Mr. H.L. Bajaj",
      role: "Chair, IEEE LMAG Delhi Section\nEx Chairman, CEA",
      img: "/speakers/H L Bajaj.png",
      objectFit: "contain",
    },
    {
      name: "Mr. Rajendra K. Asthana",
      role: "Advisor, IEEE India Council\nEx-Director, SDS Softpro (P) Ltd.",
      img: "/speakers/Mr. Rajendra K. Asthana.png",
      objectPosition: "center 20%",
    },
    {
      name: "Dr. Rachana Garg",
      role: "Immediate Past Chair, IEEE Delhi Section\nHOD, Electrical Engineering, DTU",
      img: "/speakers/Dr. Rachana Garg.png",
      objectPosition: "top",
    },
    {
      name: "Dr. Sneha Kabra",
      role: "Treasurer, IEEE Delhi Section\nShaheed Rajguru College of Applied Sciences for Women\nUniversity of Delhi",
      img: "/speakers/sneha-kabra.jpeg",
    },
    {
      name: "Prof. Ramneek Kalra",
      role: "Chair, IEEE YP Delhi Section\nIEEE Impact Creator",
      img: "/speakers/Ramneek Kalra Sir.png",
      objectPosition: "top",
    },
    {
      name: "Dr. Richa Gupta",
      role: "Vice Chair, IEEE YP Delhi Section\nAssistant Professor, Jamia Hamdard",
      img: "/speakers/Dr. Richa Gupta.png",
      objectPosition: "top",
    },
    {
      name: "Mr. Raghav Garg",
      role: "Lead Instructor, PW Skills",
      img: "/speakers/Raghav Garg.png",
    },
  ];

  return (
    <section className="py-20 bg-white" id="guests">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Distinguished Guests
          </h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto animate-on-scroll">
          {guests.map((guest, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">
                {guest.img ? (
                  <img
                    src={guest.img}
                    alt={guest.name}
                    className={`w-full h-full ${guest.objectFit === "contain" ? "object-contain" : "object-cover"}`}
                    style={guest.objectPosition ? { objectPosition: guest.objectPosition } : undefined}
                  />
                ) : (
                  <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-slate-800 font-bold text-sm mb-1">
                {guest.name}
              </h3>
              <p className="text-[#7B1F34] text-xs leading-relaxed">
                {guest.role.split("\n").map((line, j) => (
                  <span key={j} className="block">{line}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
