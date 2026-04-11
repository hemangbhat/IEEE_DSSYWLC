"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Alert Banner */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-semibold tracking-wide z-[110] relative">
        ⚠️ Last Day to Register! Registrations close on 5th February 2026. ⚠️
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-[100] bg-[#00546B] shadow-md transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="section-container flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-black border border-white/30">
              DSSYWLC
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="#about" className="text-sm text-white/80 hover:text-white transition-colors">About</Link>
            <Link href="#speakers" className="text-sm text-white/80 hover:text-white transition-colors">Speakers</Link>
            <Link href="#schedule" className="text-sm text-white/80 hover:text-white transition-colors">Program</Link>
            <Link href="#accommodation" className="text-sm text-white/80 hover:text-white transition-colors">Accommodation</Link>
            <Link href="#sponsors" className="text-sm text-white/80 hover:text-white transition-colors">Sponsors</Link>
            <Link href="#gallery" className="text-sm text-white/80 hover:text-white transition-colors">Gallery</Link>
            <Link href="#contact" className="text-sm text-white/80 hover:text-white transition-colors">Contact</Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:block bg-[#c9a227] text-white px-5 py-2 rounded text-sm font-bold hover:brightness-110 transition-all">
              Sign In
            </button>
            <button className="hidden sm:block border border-white text-white px-5 py-2 rounded text-sm font-bold hover:bg-white/10 transition-all">
              Sign Up
            </button>
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:hidden px-6 py-4 border-t border-white/10 space-y-3 bg-[#00546B]`}>
          <Link href="#about" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="#speakers" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Speakers</Link>
          <Link href="#schedule" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Program</Link>
          <Link href="#accommodation" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Accommodation</Link>
          <Link href="#gallery" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
          <Link href="#contact" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <button className="w-full bg-[#c9a227] text-white py-2.5 rounded text-sm font-bold mt-3">Register Now</button>
        </div>
      </nav>
    </>
  );
}
