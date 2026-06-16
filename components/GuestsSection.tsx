export default function GuestsSection() {
  type Guest = {
    name: string;
    role: string;
    img: string;
    objectPosition?: string;
    objectFit?: string;
  };

  const chiefGuests: Guest[] = [
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
  ];

  const keynoteSpeakers: Guest[] = [
    {
      name: "Mr. Raghav Garg",
      role: "Lead Instructor, PW Skills",
      img: "/speakers/Raghav Garg.png",
    },
    {
      name: "Mr. Ayush Maiti",
      role: "Bain & Company, ex- EY\nMBA, IIM Lucknow\nex-IEEE NSUT Vice-Chair, ex-Delhi Section SSN",
      img: "/speakers/Ayush Maiti.png",
    },
    {
      name: "Dr. Ashwini Aggarwal",
      role: "Chair, IEEE EPS Delhi Section\nProfessor of Practice, MRIIRS",
      img: "/speakers/Dr. Ashwini-K Aggarwal.png",
    },
    {
      name: "Prof. Ramneek Kalra",
      role: "Chair, IEEE YP Delhi Section\nIEEE Impact Creator",
      img: "/speakers/Ramneek Kalra Sir.png",
      objectPosition: "top",
    },
  ];

  const distinguishedGuests: Guest[] = [
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
      role: "Treasurer, IEEE Delhi Section\nShaheed Rajguru College, University of Delhi",
      img: "/speakers/sneha-kabra.jpeg",
    },
    {
      name: "Dr. Richa Gupta",
      role: "Vice Chair, IEEE YP Delhi Section\nAssistant Professor, Jamia Hamdard",
      img: "/speakers/Dr. Richa Gupta.png",
      objectPosition: "top",
    },
  ];

  const renderCard = (guest: Guest, size: "2x" | "1.75x" | "1x") => {
    const imgSize =
      size === "2x"
        ? "w-44 h-44"
        : size === "1.75x"
          ? "w-36 h-36"
          : "w-28 h-28";
    const nameSize =
      size === "2x"
        ? "text-base"
        : size === "1.75x"
          ? "text-sm"
          : "text-sm";
    const roleSize =
      size === "2x"
        ? "text-sm"
        : size === "1.75x"
          ? "text-xs"
          : "text-xs";
    const padding =
      size === "2x"
        ? "p-8"
        : size === "1.75x"
          ? "p-7"
          : "p-6";

    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 ${padding} text-center hover:shadow-lg transition-shadow h-full w-full flex flex-col items-center justify-start`}
      >
        <div
          className={`${imgSize} mx-auto mb-5 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center`}
        >
          {guest.img ? (
            <img
              src={guest.img}
              alt={guest.name}
              className={`w-full h-full ${guest.objectFit === "contain" ? "object-contain" : "object-cover"}`}
              style={
                guest.objectPosition
                  ? { objectPosition: guest.objectPosition }
                  : undefined
              }
            />
          ) : (
            <svg
              className="w-12 h-12 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
        <h3 className={`text-slate-800 font-bold ${nameSize} mb-1`}>
          {guest.name}
        </h3>
        <p className={`text-[#7B1F34] ${roleSize} leading-relaxed`}>
          {guest.role.split("\n").map((line, j) => (
            <span key={j} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    );
  };

  return (
    <section className="py-20 bg-white" id="guests">
      <div className="section-container">
        {/* Chief Guests */}
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Chief Guests
          </h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mb-20 animate-on-scroll items-stretch">
          {chiefGuests.map((guest, i) => (
            <div key={i} className="flex w-full">
              {renderCard(guest, "2x")}
            </div>
          ))}
        </div>

        {/* Keynote Speakers */}
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Keynote Speakers
          </h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20 animate-on-scroll items-stretch">
          {keynoteSpeakers.map((guest, i) => (
            <div key={i} className="flex w-full">
              {renderCard(guest, "1.75x")}
            </div>
          ))}
        </div>

        {/* Distinguished Guests */}
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Distinguished Guests
          </h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto animate-on-scroll items-stretch">
          {distinguishedGuests.map((guest, i) => (
            <div key={i} className="flex w-full">
              {renderCard(guest, "1x")}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
