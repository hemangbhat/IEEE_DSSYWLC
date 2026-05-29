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
  title: "DSSYWLC 2025 | IEEE Delhi Section Congress at NSUT",
  description:
    "DSSYWLC 2025 - IEEE Delhi Section Student, YP & WIE Congress. Feb 07-08, 2026 at NSUT, New Delhi. Register now!",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "DSSYWLC 2025 | IEEE Delhi Section Congress at NSUT",
    description:
      "DSSYWLC 2025 - IEEE Delhi Section Student, YP & WIE Congress. Feb 07-08, 2026 at NSUT, New Delhi. Register now!",
    url: "https://dssywlcnsut.in",
    siteName: "IEEE NSUT - DSSYWLC",
    images: [
      {
        url: "https://dssywlcnsut.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSSYWLC 2025 - IEEE Delhi Section Congress at NSUT",
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
