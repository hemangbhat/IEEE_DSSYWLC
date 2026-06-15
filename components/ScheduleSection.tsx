"use client";

import { useState } from "react";

type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  highlight: boolean;
  speakers?: string[];
  parallel?: { title: string; description?: string }[];
  tag?: string;
};

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const day1: ScheduleItem[] = [
    {
      time: "08:30 AM",
      title: "Registration",
      description: "Participant Registration & Refreshment Kit",
      highlight: false,
    },
    {
      time: "10:00 – 11:30 AM",
      title: "Inauguration Ceremony",
      description: "Formal welcome & inaugural addresses",
      highlight: true,
    },
    {
      time: "11:30 AM – 12:00 PM",
      title: "Tea Break (Networking Session 1)",
      description: "Open networking session for all attendees",
      highlight: false,
    },
    {
      time: "12:00 – 12:30 PM",
      title: "Breaking the Ice",
      description: "",
      highlight: true,
    },
    {
      time: "12:30 – 01:00 PM",
      title: "Café Samvaad 3.0",
      description: "Senior IEEE Members engage with young professionals",
      highlight: false,
      tag: "Life Members Interacting with Young Professionals",
    },
    {
      time: "01:00 – 01:30 PM",
      title: "IEEE Opportunities Unlocked",
      description: "Funding, Scholarships & More",
      highlight: false,
      tag: "Young Professionals Session",
    },
    {
      time: "01:30 – 02:00 PM",
      title: "Keynote Speaker Session",
      description: "",
      highlight: true,
    },
    {
      time: "02:00 – 03:00 PM",
      title: "Lunch Break (Networking Session 2)",
      description: "Open networking session for all attendees",
      highlight: false,
    },
    {
      time: "03:00 – 04:00 PM",
      title:
        "Beyond the Degree: Building Impact Through Leadership, Innovation and Community",
      description:
        "How students and young professionals can create meaningful impact through technical excellence, leadership roles, entrepreneurship, IEEE volunteering, research, and industry engagement.",
      highlight: true,
      tag: "WIE: Panel Discussion",
    },
    {
      time: "04:00 – 06:00 PM",
      title: "Awards",
      description: "",
      highlight: true,
    },
    {
      time: "06:00 – 07:00 PM",
      title: "TriFecta",
      description:
        "Trifecta is a three-round team event that combines music, communication, and puzzle-solving in a fun and engaging format.",
      highlight: false,
    },
    {
      time: "07:00 – 08:30 PM",
      title: "Dinner",
      description: "",
      highlight: false,
    },
  ];

  const day2: ScheduleItem[] = [
    {
      time: "09:30 – 10:15 AM",
      title: "IEEE VTools Reporting",
      description:
        "Learn how to effectively use IEEE vTools to report events, manage records, and maintain proper documentation. Understand best practices to ensure your activities are recognised and aligned with IEEE guidelines.",
      highlight: false,
    },
    {
      time: "10:15 AM – 12:00 PM",
      title: "Student Branch Chairs Meet and Presentation",
      description: "",
      highlight: true,
    },
    {
      time: "12:00 – 12:30 PM",
      title: "High Tea (Networking - 4)",
      description: "",
      highlight: false,
    },
    {
      time: "12:30 – 02:00 PM",
      title: "Keynote Speaker Session",
      description: "",
      highlight: true,
    },
    {
      time: "02:00 – 03:00 PM",
      title: "Lunch (Networking - 5)",
      description: "",
      highlight: false,
    },
    {
      time: "03:00 – 04:30 PM",
      title: "Competitions",
      description: "",
      highlight: true,
      parallel: [
        {
          title: "IEEE DataPort ML Challenge",
          description: "Machine Learning competition",
        },
        {
          title: "DsaVerse 2.0",
          description: "Data Structures & Algorithms competition",
        },
      ],
    },
    {
      time: "04:30 – 05:00 PM",
      title: "Tea Session (Networking - 6)",
      description:
        "A light and refreshing break to recharge and unwind amidst the day's activities. Enjoy a selection of snacks while connecting and relaxing with fellow participants.",
      highlight: false,
    },
    {
      time: "05:00 – 06:00 PM",
      title: "Jamming / Cultural Night",
      description:
        "An electrifying evening filled with music, dance, and vibrant performances celebrating diverse talents and cultures. Experience unforgettable moments as the stage comes alive with energy, creativity, and pure entertainment.",
      highlight: true,
    },
  ];

  const schedule = activeDay === 1 ? day1 : day2;

  return (
    <section className="py-20 bg-white" id="schedule">
      <div className="section-container">
        <div className="text-center mb-10 animate-on-scroll">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Program Schedule
          </h2>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto mb-8"></div>

          {/* Day Tabs */}
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-6 py-2.5 text-sm font-bold transition-colors ${
                activeDay === 1
                  ? "bg-[#7B1F34] text-white"
                  : "bg-white text-slate-600 hover:bg-gray-50"
              }`}
            >
              Day 1 · June 20
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-6 py-2.5 text-sm font-bold transition-colors ${
                activeDay === 2
                  ? "bg-[#7B1F34] text-white"
                  : "bg-white text-slate-600 hover:bg-gray-50"
              }`}
            >
              Day 2 · June 21
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto animate-on-scroll">
          {schedule.map((item, i) => (
            <div
              key={i}
              className="flex gap-8 border-b border-gray-100 py-6 last:border-b-0 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded"
            >
              {/* Time column */}
              <div className="w-36 flex-shrink-0 text-right">
                <span
                  className={`font-bold text-sm font-mono inline-block px-3 py-1 rounded ${
                    item.highlight ? "bg-[#7B1F34] text-white" : "text-gray-600"
                  }`}
                >
                  {item.time}
                </span>
              </div>
              {/* Vertical line */}
              <div className="w-px bg-gray-200 relative flex-shrink-0">
                <div className="absolute top-2 -left-[5px] w-[11px] h-[11px] rounded-full bg-[#7B1F34]"></div>
              </div>
              {/* Content */}
              <div className="flex-grow pb-2">
                {item.parallel?.length ? (
                  <>
                    <h3 className="text-slate-800 font-bold text-base mb-3">
                      {item.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.parallel.map((track, k) => (
                        <div
                          key={k}
                          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                        >
                          <h4 className="text-slate-800 font-bold text-sm mb-1">
                            {track.title}
                          </h4>
                          {track.description && (
                            <p className="text-gray-500 text-xs">
                              {track.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {item.tag && (
                      <span className="inline-block mb-2 rounded bg-[#7B1F34] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                        {item.tag}
                      </span>
                    )}
                    <h3 className="text-slate-800 font-bold text-base mb-1">
                      {item.title.split("\n").map((line, idx) => (
                        <span key={idx} className={idx > 0 ? "block text-sm font-medium text-slate-600" : ""}>
                          {line}
                        </span>
                      ))}
                    </h3>
                    {item.description && (
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    )}
                  </>
                )}
                {item.speakers?.length ? (
                  <ul className="mt-3 space-y-1">
                    {item.speakers.map((speaker, j) => (
                      <li
                        key={j}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7B1F34] mt-1.5 flex-shrink-0"></span>
                        {speaker}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
