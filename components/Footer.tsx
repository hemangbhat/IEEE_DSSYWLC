import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#7B1F34] text-white py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-1">DSSYWLC &apos;25</h3>
            <p className="text-white/80 text-sm font-medium mb-1">Delhi Section</p>
            <p className="text-white/60 text-sm leading-relaxed">
              IEEE Section Student, Young Professionals &amp; Women in Engineering and Life member Congress.
            </p>
            <div className="mt-4 space-y-1 text-sm text-white/70">
              <p>📞 +91 871 128 2398</p>
              <p>✉️ naaswlc@dssywlc.com</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider">Contact Info</h4>
            <div className="space-y-2">
              <Link href="#about" className="block text-white/60 text-sm hover:text-white transition-colors">About</Link>
              <Link href="#speakers" className="block text-white/60 text-sm hover:text-white transition-colors">Speakers</Link>
              <Link href="#schedule" className="block text-white/60 text-sm hover:text-white transition-colors">Program</Link>
              <Link href="#registration" className="block text-white/60 text-sm hover:text-white transition-colors">Registration</Link>
              <Link href="#accommodation" className="block text-white/60 text-sm hover:text-white transition-colors">Accommodation</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider">Links</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-white/60 text-sm hover:text-white transition-colors">Teach Us</Link>
              <Link href="#" className="block text-white/60 text-sm hover:text-white transition-colors">Links</Link>
              <Link href="#contact" className="block text-white/60 text-sm hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© 2025 – DSSYWLC Delhi Section</p>
          <p className="text-white/40 text-xs">
            <Link href="#" className="text-white/60 hover:text-white">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
