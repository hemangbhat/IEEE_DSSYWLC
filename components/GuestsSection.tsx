export default function GuestsSection() {
  const guests = [
    // Hidden for now — keep details/image to re-add later.
    // {
    //   name: "Prof. Anand Srivastava",
    //   role: "Vice Chancellor, NSUT",
    //   img: "/speakers/vc-nsut.png",
    // },
    {
      name: "Prof. Prerna Gaur",
      role: "Chair — IEEE India Council",
      img: "https://res.cloudinary.com/dlia5xgwx/image/upload/v1770186781/drprernagaur_lp5okn.jpg",
    },
    {
      name: "Dr. Preeti Bajaj",
      role: "Chair-Elect — IEEE India Council",
      img: "/speakers/preeti-bajaj.png",
    },
    {
      name: "Prof. M.N. Hoda",
      role: "Chairperson — IEEE Delhi Section",
      img: "https://res.cloudinary.com/dlia5xgwx/image/upload/v1770186780/mnhoda_thmusc.jpg",
    },
    {
      name: "Mr. Deepak Mathur",
      role: "Past VP — IEEE Member & Geographic Activities",
      img: "/speakers/deepak-mathur.png",
    },
    {
      name: "Dr. S.S. Jamuar",
      role: "Delhi Section LMAG Secretary",
      img: "/speakers/sudhanshujamuar.jpg",
    },
    {
      name: "Ms. Sneha Kabra",
      role: "Secretary — IEEE Delhi Section",
      img: "/speakers/sneha-kabra.jpeg",
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
                    className="w-full h-full object-cover"
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
                {guest.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
