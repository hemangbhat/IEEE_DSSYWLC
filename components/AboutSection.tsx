export default function AboutSection() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="section-container animate-on-scroll">
        {/* About text block */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
            About the Congress
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The DSSYWLC 2025 represents a premier flagship event of the IEEE
            Delhi Section. It serves as a unified platform bringing together
            three vital pillars of the engineering community: Young
            Professionals &amp; Students, Women in Engineering (WIE), and Life
            Members.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our mission is to foster a collaborative environment where
            experience meets innovation. Through technical sessions, leadership
            workshops, and networking forums, we aim to bridge the generational
            and gender gap in engineering, paving the way for sustainable
            technological advancement.
          </p>
          <p className="text-gray-600 leading-relaxed">
            DSSYWLC brings these communities together under one roof through
            technical sessions, panel discussions, leadership talks, and
            cultural events. It celebrates engineering excellence and builds
            lasting connections across generations. Join us to learn, network,
            and be part of a vibrant IEEE community.
          </p>
        </div>
      </div>
    </section>
  );
}
