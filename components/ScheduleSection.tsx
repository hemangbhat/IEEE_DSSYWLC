export default function ScheduleSection() {
  const scheduleItems = [
    { time: "10:00 AM", title: "Session Title", description: "Workshops & Freelance of Engineering", highlight: false },
    { time: "10:30 AM", title: "Session 1 - Session 2", description: "Closing and preparatory cross-passion manifestationships", highlight: false },
    { time: "10:00 AM", title: "Session 2- Session 3", description: "Women in Student", highlight: true },
    { time: "10:30 AM", title: "Session Inspiration", description: "Symposials & Women in Engineering", highlight: false },
    { time: "12:00 PM", title: "Copiate Tiora", description: "", highlight: true },
  ];

  return (
    <section className="py-20 bg-white" id="schedule">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Program Schedule</h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto animate-on-scroll">
          {scheduleItems.map((item, i) => (
            <div key={i} className="flex gap-8 border-b border-gray-100 py-6 last:border-b-0 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded">
              {/* Time column */}
              <div className="w-28 flex-shrink-0 text-right">
                <span className={`font-bold text-sm font-mono inline-block px-3 py-1 rounded ${
                  item.highlight
                    ? "bg-[#7B1F34] text-white"
                    : "text-gray-600"
                }`}>
                  {item.time}
                </span>
              </div>
              {/* Vertical line */}
              <div className="w-px bg-gray-200 relative flex-shrink-0">
                <div className="absolute top-2 -left-[5px] w-[11px] h-[11px] rounded-full bg-[#7B1F34]"></div>
              </div>
              {/* Content */}
              <div className="flex-grow pb-2">
                <h3 className="text-slate-800 font-bold text-base mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-500 text-sm">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
