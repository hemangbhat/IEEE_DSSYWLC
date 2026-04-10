export default function ScheduleSection() {
  const scheduleItems = [
    { time: "09:00 - 09:30", title: "Registration & Kit Distribution", location: "Main Lobby" },
    { time: "09:30 - 10:15", title: "Inauguration Ceremony", speaker: "Prof. Prerna Gaur", location: "Main Auditorium" },
    { time: "10:15 - 11:00", title: "Keynote: AI in Engineering", speaker: "Industry Experts", location: "Main Auditorium" },
    { time: "11:00 - 11:30", title: "Pause & Pour (Tea Break)", location: "Old Canteen Area" },
    { time: "11:30 - 12:15", title: "Student Branch Presentation", location: "Seminar Hall" },
    { time: "12:15 - 13:00", title: "WIE BrainWave (Tech Competition)", location: "Seminar Hall", tag: "Technical Track" },
    { time: "13:00 - 14:00", title: "Table Talks (Lunch)", location: "Old Canteen Area" },
    { time: "14:00 - 15:00", title: "Bridging Education to Employment", speaker: "Dr. Parul Malik", location: "Seminar Hall" },
    { time: "15:15 - 16:00", title: "Workshop on Design Thinking IDEA Lab", speaker: "Dr. Ashish Laddha", location: "IDEA Lab / Seminar Hall" },
    { time: "16:00 - 16:30", title: "High Tea", location: "Old Canteen Area" },
  ];

  return (
    <section className="py-20 bg-white" id="schedule">
      <div className="section-container">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Program Schedule</h2>
          <div className="w-16 h-1 bg-[#e8956a] rounded-full mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto animate-on-scroll">
          {scheduleItems.map((item, i) => (
            <div key={i} className="flex gap-8 border-b border-gray-100 py-6 last:border-b-0 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded">
              {/* Time column */}
              <div className="w-36 flex-shrink-0 text-right">
                <span className="text-[#00546B] font-bold text-sm font-mono">{item.time}</span>
              </div>
              {/* Vertical line */}
              <div className="w-px bg-gray-200 relative flex-shrink-0">
                <div className="absolute top-2 -left-[3px] w-[7px] h-[7px] rounded-full bg-[#00546B]"></div>
              </div>
              {/* Content */}
              <div className="flex-grow pb-2">
                <h3 className="text-slate-800 font-bold text-base mb-1">{item.title}</h3>
                {item.speaker && (
                  <p className="text-gray-500 text-sm mb-1">- {item.speaker}</p>
                )}
                {item.location && (
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span> {item.location}
                  </p>
                )}
                {item.tag && (
                  <span className="inline-block mt-2 px-3 py-0.5 border border-[#00546B] text-[#00546B] text-xs rounded font-medium">
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
