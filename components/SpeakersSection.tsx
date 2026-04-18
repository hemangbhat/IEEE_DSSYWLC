export default function SpeakersSection() {
  const speakers = [
    { name: "Prof. (Dr.) Prerna Gaur", role: "Director, NSUT West Campus, Chair-IEEE India Council", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoX8PR_uj_MFmZvwo9hoxjg6lyssU4xo9CHDkdA7Uo6uM1ZsB-soNoKG-hj4EfL_hV8QcUisK-EccRslAjCwO95OkSDLr7vqQKXGa0BZjw-mwYE2zOefdtr2bQaOtJOtJJWLvF2F7WfkKX7ZGqUkgrD2qk-meSHsFoGTrHnJMr6oYB2XTIboOhmBLKNQa6ObrIBhVj5NA52ynR-Ghc51E6K4rTHxyfd7UEgWfYl6xK6AByT3nGCx3a2-wyrtsM6l9gKaxF1MQmeAM" },
    { name: "Dr. M.N. Hoda", role: "Director, Bharti Vidyapeeth, Chairperson IEEE Delhi Section", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmWsXSKH_MOnm2wu2HPtxtwt_s-6G0pmSrVfMGFR2V23S54ndp-wnD6YCKbbyJ7wJRPGHmGw2p4yjvoPWvFvqKb50doVfebgUUS3U15-7yI6kget59Qf3jDkcXPY_njUGQFAMJ3jqGdcTyc7BdDwd3nWoxjnU0cXAEFMTDw8WjtPDI09UonEjHnNu7ZP4ZdQZTLmnwsb1nd-IgttT75ud-5QqTwSGipRp-tIZ2LolOrUDaEpgtWgRS1bnS7SL2ON0jimvkLRuYXHQ" },
    { name: "Dr. Archana Mantri", role: "Vice Chair, IEEE Delhi Section", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQWubPBC354YYt3asJpYJAeIltjq5OZe2r7x7wGs36KkXpT8gsR7q7QKRYIPd_VbA1TdZkgtW6csRsNIRtI0KuYgFwq356BsmMuUGSeewHyF6FLKaFkPH4YPHLIEshkvdmITcfw73XtAHVLBuRZszwSCSDwiFSxcoWBdI750VfHvZra-tO6ycTPBaxWUz85aMEAMeXLymAsiOlTARroiodAvMbvRtHnUIZo3Sh5f471tVWKWGcAlaYmSSt1ACEom0bQZHRIV-n-eQ" },
    { name: "Dr. Rajnish Sharma", role: "Secretary, IEEE Delhi Section", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDh5MPTOrFvt0Ys9ce19FRe0-GqexyHPOH9U4Mnp3g4eknrVMnqpICjPZey4W4SRWWnfrUoMpk0AMEPiBoU6tkwC4Ee5vFKHC3hp6GdHI1W5u6LCJpgDzUiAOvQe3ufbLH-XDX09CdGITV9NdSmHjrH8grBqQqrpp1Mvrfu_RO8brzTkyN4bpUpKGhpzjB3liJf3XVS_PFcjIqZtgF4ZnEWdFqQRm69dQzUUuOsgg7_p7ZIQCK8pVLWoYkM1bqz5UxCWztwsUShUAc" },
  ];

  return (
    <section className="py-20 bg-white" id="speakers">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Distinguished Speakers</h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-on-scroll">
          {speakers.map((speaker, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={speaker.img} alt={speaker.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-slate-800 font-bold text-base mb-1">{speaker.name}</h3>
              <p className="text-[#7B1F34] text-sm leading-relaxed">{speaker.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
