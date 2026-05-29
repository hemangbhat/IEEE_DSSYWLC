import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import TopBanner from "@/components/TopBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "DSSYWLC 2025 | IEEE Delhi Section Congress",
  description:
    "Join DSSYWLC 2025 - Delhi Section Student, Young Professionals & Women in Engineering and Life member Congress. February 07-08, 2026 at Netaji Subhas University of Technology (NSUT), Dwarka, New Delhi.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "DSSYWLC 2025 | IEEE Delhi Section Congress",
    description:
      "Join DSSYWLC 2025 - Delhi Section Student, Young Professionals & Women in Engineering and Life member Congress. February 07-08, 2026 at Netaji Subhas University of Technology (NSUT), Dwarka, New Delhi.",
    url: "https://ieeensut.com",
    siteName: "IEEE NSUT",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSSYWLC 2025 - IEEE Delhi Section Congress",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a1628" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${inter.className} bg-white`}>                    
        <TopBanner />
        {children}
      </body>
    </html>
  );
}
