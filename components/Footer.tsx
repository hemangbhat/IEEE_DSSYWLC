import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#002147] text-white py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-3">IEEE DSSYWLC 2025</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              IEEE is the world&apos;s largest technical professional organization dedicated to advancing technology for the benefit of humanity.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              <Link href="#about" className="block text-white/60 text-sm hover:text-white transition-colors">About</Link>
              <Link href="#speakers" className="block text-white/60 text-sm hover:text-white transition-colors">Speakers</Link>
              <Link href="#schedule" className="block text-white/60 text-sm hover:text-white transition-colors">Program</Link>
              <Link href="#registration" className="block text-white/60 text-sm hover:text-white transition-colors">Registration</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 uppercase tracking-wider">Legal</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-white/60 text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="block text-white/60 text-sm hover:text-white transition-colors">Terms of Service</Link>
              <a href="mailto:ieee@poornima.org" className="block text-white/60 text-sm hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© 2026 IEEE. All rights reserved.</p>
          <p className="text-white/40 text-xs">
            Developed and maintained by <a href="https://akshatmehta.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white underline">Akshat Mehta</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
