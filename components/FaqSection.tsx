"use client";

import { useState } from "react";

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How can I register for the event?", a: "You can register directly through the 'Register Now' buttons on this website. Registration is handled via our secure IEEE portal." },
    { q: "Is the registration fee refundable?", a: "No. Registration is non-transferable and non-refundable. Workshop seats will be allocated on a first-come, first-served basis." },
    { q: "Is accommodation included in the fee?", a: "No, the registration fee covers all technical sessions, delegate kits, lunches, and high tea for both days. Accommodation must be booked separately; please refer to the accommodation section." },
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-[#e8956a] rounded-full mx-auto"></div>
          </div>
          <div className="space-y-3 animate-on-scroll">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item border border-gray-200 rounded-lg overflow-hidden transition-all ${activeIndex === i ? "active bg-gray-50" : "bg-white"}`}
              >
                <div
                  className="flex justify-between items-center p-5 cursor-pointer"
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                >
                  <h4 className="text-slate-800 font-semibold text-sm">{faq.q}</h4>
                  <span className="faq-icon material-symbols-outlined text-gray-400 text-xl transition-transform flex-shrink-0 ml-4">add</span>
                </div>
                <div className="faq-content px-5 text-sm text-gray-500 leading-relaxed pb-5">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
