import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import TopBanner from "@/components/TopBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DSSYWLC 2025 | IEEE Delhi Section Congress",
  description:
    "Join DSSYWLC 2025 - Delhi Section Student, Young Professionals & Women in Engineering and Life member Congress. February 07-08, 2026 at Poornima Institute of Engineering & Technology, Jaipur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-white`}>
        <ClerkProvider>
          <TopBanner />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
