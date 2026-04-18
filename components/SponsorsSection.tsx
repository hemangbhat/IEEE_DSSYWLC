export default function SponsorsSection() {
  return (
    <section className="py-16 bg-white border-t border-gray-100" id="sponsors">
      <div className="section-container text-center animate-on-scroll">
        <p className="text-gray-500 text-sm mb-10">Proudly supported by industry leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
          <span className="text-gray-400 text-lg font-bold tracking-tight hover:text-[#7B1F34] transition-colors cursor-default">UPSTAIRS</span>
          <span className="text-gray-400 text-lg font-bold tracking-tight hover:text-[#7B1F34] transition-colors cursor-default">CELEBAL</span>
          <span className="text-gray-400 text-lg font-bold tracking-tight hover:text-[#7B1F34] transition-colors cursor-default">IEEE DELHI</span>
          <span className="text-gray-400 text-lg font-bold tracking-tight hover:text-[#7B1F34] transition-colors cursor-default">WIE</span>
        </div>
      </div>
    </section>
  );
}
