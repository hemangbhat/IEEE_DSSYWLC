import Link from "next/link";

export default function RegistrationsClosed() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] px-4 py-12">
      <div className="mx-auto max-w-lg rounded-xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#7B1F34]/10">
          <span className="material-symbols-outlined text-3xl text-[#7B1F34]">
            event_busy
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-slate-800">
          Registrations Closed
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Thank you for your interest in DSSYWLC &apos;25. Registrations are now
          closed. If you have already registered, you can still track your
          status using your profile link. We look forward to seeing you at the
          congress!
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-[#7B1F34] px-8 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
