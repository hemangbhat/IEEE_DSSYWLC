import Link from "next/link";

export default function TopBanner() {
  return (
    <div className="bg-[#E60000] text-white py-2.5 px-4 text-center text-sm md:text-base font-semibold shadow-sm w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="text-xl leading-none">⚠️</span>
        <span className="inline-block">
          Last Day to Register! Registrations close on 5th February 2026.{" "}
          <Link href="/register" className="underline font-bold hover:text-gray-200 ml-1">
            Register Now
          </Link>
        </span>
        <span className="text-xl leading-none">⚠️</span>
      </div>
    </div>
  );
}
