import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Registration Profile | DSSYWLC 2025",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
