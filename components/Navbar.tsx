"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-[100] bg-[#7B1F34] shadow-md transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="section-container flex justify-between items-center py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-lg tracking-tight">DSSYWLC &apos;25</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/#about" className="text-sm text-white/80 hover:text-white transition-colors">About</Link>
          <Link href="/#speakers" className="text-sm text-white/80 hover:text-white transition-colors">Speakers</Link>
          <Link href="/#schedule" className="text-sm text-white/80 hover:text-white transition-colors">Program</Link>
          <Link href="/#registration" className="text-sm text-white/80 hover:text-white transition-colors">Registration</Link>
          <Link href="/#accommodation" className="text-sm text-white/80 hover:text-white transition-colors">Accommodation</Link>
          <Link href="/#contact" className="text-sm text-white/80 hover:text-white transition-colors">Contact</Link>
        </div>

        {/* CTA + Auth */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton>
              <button className="hidden sm:block text-sm text-white/80 hover:text-white transition-colors cursor-pointer">
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </Show>
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} lg:hidden px-6 py-4 border-t border-white/10 space-y-3 bg-[#7B1F34]`}>
        <Link href="/#about" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
        <Link href="/#speakers" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Speakers</Link>
        <Link href="/#schedule" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Program</Link>
        <Link href="/#registration" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Registration</Link>
        <Link href="/#accommodation" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Accommodation</Link>
        <Link href="/#contact" className="block text-sm text-white/80" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        <Show when="signed-out">
          <SignInButton>
            <button className="w-full bg-white text-[#7B1F34] py-2.5 rounded text-sm font-bold mt-3 cursor-pointer">Sign In</button>
          </SignInButton>
        </Show>
      </div>
    </nav>
  );
}
