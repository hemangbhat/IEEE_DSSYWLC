import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import AboutSection from "@/components/AboutSection";
import HostInstitution from "@/components/HostInstitution";
import SpeakersSection from "@/components/SpeakersSection";
import RegistrationSection from "@/components/RegistrationSection";
import ScheduleSection from "@/components/ScheduleSection";
import AccommodationSection from "@/components/AccommodationSection";
import SponsorsSection from "@/components/SponsorsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollProvider from "@/components/ScrollProvider";

export default function Home() {
  return (
    <>
      <ScrollProvider />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <AboutSection />
      <HostInstitution />
      <SpeakersSection />
      <RegistrationSection />
      <ScheduleSection />
      <AccommodationSection />
      <SponsorsSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </>
  );
}
