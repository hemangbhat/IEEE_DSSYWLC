"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface GalleryItem {
  src: string;
  category: string;
  day: string;
  type: "image" | "video";
}

const gallery2023: GalleryItem[] = [
  // Day 1
  { src: "/gallery/2023/inauguration_1.jpg", category: "Inauguration", day: "Day 1", type: "image" },
  { src: "/gallery/2023/inauguration_2.jpg", category: "Inauguration", day: "Day 1", type: "image" },
  { src: "/gallery/2023/keynote_1.jpg", category: "Keynote Session", day: "Day 1", type: "image" },
  { src: "/gallery/2023/keynote_2.jpg", category: "Keynote Session", day: "Day 1", type: "image" },
  { src: "/gallery/2023/keynote_video.mov", category: "Keynote Session", day: "Day 1", type: "video" },
  { src: "/gallery/2023/artist_performance_1.jpg", category: "Artist Performance", day: "Day 1", type: "image" },
  { src: "/gallery/2023/artist_performance_2.jpg", category: "Artist Performance", day: "Day 1", type: "image" },
  { src: "/gallery/2023/creators_talk_1.jpg", category: "Creator's Talk", day: "Day 1", type: "image" },
  { src: "/gallery/2023/creators_talk_2.jpg", category: "Creator's Talk", day: "Day 1", type: "image" },
  { src: "/gallery/2023/groove_move_1.jpg", category: "Groove & Move", day: "Day 1", type: "image" },
  { src: "/gallery/2023/melody_1.jpg", category: "Melody", day: "Day 1", type: "image" },
  { src: "/gallery/2023/think_tank_1.jpg", category: "Think Tank", day: "Day 1", type: "image" },
  { src: "/gallery/2023/think_tank_2.jpg", category: "Think Tank", day: "Day 1", type: "image" },
  { src: "/gallery/2023/sponsor_1.jpg", category: "Sponsor Session", day: "Day 1", type: "image" },
  // Day 2
  { src: "/gallery/2023/alumni_1.jpg", category: "Alumni Meet", day: "Day 2", type: "image" },
  { src: "/gallery/2023/alumni_2.jpg", category: "Alumni Meet", day: "Day 2", type: "image" },
  { src: "/gallery/2023/brand_crafters_1.jpg", category: "Brand Crafters", day: "Day 2", type: "image" },
  { src: "/gallery/2023/brand_crafters_2.jpg", category: "Brand Crafters", day: "Day 2", type: "image" },
  { src: "/gallery/2023/humor_hustle_1.jpg", category: "Humor Hustle", day: "Day 2", type: "image" },
  { src: "/gallery/2023/lmag_1.jpg", category: "LMAG", day: "Day 2", type: "image" },
  { src: "/gallery/2023/lmag_2.jpg", category: "LMAG", day: "Day 2", type: "image" },
  { src: "/gallery/2023/lmag_3.jpg", category: "LMAG", day: "Day 2", type: "image" },
  { src: "/gallery/2023/spiritual_serenity_1.jpg", category: "Spiritual Serenity", day: "Day 2", type: "image" },
  { src: "/gallery/2023/spiritual_serenity_2.jpg", category: "Spiritual Serenity", day: "Day 2", type: "image" },
  { src: "/gallery/2023/stem_storytelling_1.jpg", category: "STEM Storytelling", day: "Day 2", type: "image" },
  { src: "/gallery/2023/stem_storytelling_2.jpg", category: "STEM Storytelling", day: "Day 2", type: "image" },
  { src: "/gallery/2023/venture_voyage_1.jpg", category: "Venture Voyage", day: "Day 2", type: "image" },
  { src: "/gallery/2023/venture_voyage_2.jpg", category: "Venture Voyage", day: "Day 2", type: "image" },
  { src: "/gallery/2023/venture_voyage_3.jpg", category: "Venture Voyage", day: "Day 2", type: "image" },
];

const gallery2024: GalleryItem[] = [
  // Day 1
  { src: "/gallery/2024/inaugural_1.jpg", category: "Inaugural Ceremony", day: "Day 1", type: "image" },
  { src: "/gallery/2024/inaugural_2.jpg", category: "Inaugural Ceremony", day: "Day 1", type: "image" },
  { src: "/gallery/2024/cultural_1.jpg", category: "Cultural Events", day: "Day 1", type: "image" },
  { src: "/gallery/2024/cultural_2.jpg", category: "Cultural Events", day: "Day 1", type: "image" },
  { src: "/gallery/2024/entrepreneurial_1.jpg", category: "Entrepreneurial Horizons", day: "Day 1", type: "image" },
  { src: "/gallery/2024/yp_panel_1.jpg", category: "IEEE YP Panel", day: "Day 1", type: "image" },
  { src: "/gallery/2024/keynote_sahai_1.jpg", category: "Keynote Session", day: "Day 1", type: "image" },
  { src: "/gallery/2024/session_kalra_1.jpg", category: "Expert Session", day: "Day 1", type: "image" },
  { src: "/gallery/2024/wie_discussion_1.jpg", category: "WIE Discussion", day: "Day 1", type: "image" },
  { src: "/gallery/2024/lmag_panel_1.jpg", category: "LMAG Panel", day: "Day 1", type: "image" },
  { src: "/gallery/2024/registration_1.jpg", category: "Registration", day: "Day 1", type: "image" },
  { src: "/gallery/2024/wie_panel_1.jpg", category: "WIE Panel", day: "Day 1", type: "image" },
  // Day 2
  { src: "/gallery/2024/valedictory_1.jpg", category: "Valedictory Ceremony", day: "Day 2", type: "image" },
  { src: "/gallery/2024/branch_presentations_1.jpg", category: "Branch Presentations", day: "Day 2", type: "image" },
  { src: "/gallery/2024/coding_clash_1.jpg", category: "Coding Clash", day: "Day 2", type: "image" },
  { src: "/gallery/2024/inspiring_session_1.jpg", category: "Inspiring Session", day: "Day 2", type: "image" },
  { src: "/gallery/2024/logo_logic_1.jpg", category: "Logo Logic", day: "Day 2", type: "image" },
  { src: "/gallery/2024/music_1.jpg", category: "Music", day: "Day 2", type: "image" },
  { src: "/gallery/2024/prasar_1.jpg", category: "Prasar", day: "Day 2", type: "image" },
  { src: "/gallery/2024/sporty_1.jpg", category: "Sports", day: "Day 2", type: "image" },
  { src: "/gallery/2024/web_wizardry_1.jpg", category: "Web Wizardry", day: "Day 2", type: "image" },
];

type YearKey = "2023" | "2024";

export default function GallerySection() {
  const [activeYear, setActiveYear] = useState<YearKey>("2024");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);
  const scrollPos2Ref = useRef(0);

  const galleryData: Record<YearKey, GalleryItem[]> = {
    "2023": gallery2023,
    "2024": gallery2024,
  };

  const currentGallery = galleryData[activeYear];

  // Split into two rows for the dual-row carousel
  const midpoint = Math.ceil(currentGallery.length / 2);
  const row1 = currentGallery.slice(0, midpoint);
  const row2 = currentGallery.slice(midpoint);

  // Lightbox navigation
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % currentGallery.length : 0));
    }
  }, [lightboxIndex, currentGallery.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + currentGallery.length) % currentGallery.length : 0));
    }
  }, [lightboxIndex, currentGallery.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, goNext, goPrev]);

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  // Auto-scroll both carousel rows
  useEffect(() => {
    const track1 = trackRef.current;
    const track2 = track2Ref.current;
    if (!track1 || !track2) return;

    // Reset positions on year change
    scrollPosRef.current = 0;
    // Start row 2 offset so it begins mid-scroll for visual variety
    const track2SingleSet = track2.scrollWidth / 2;
    scrollPos2Ref.current = track2SingleSet * 0.3;

    const speed = 0.5; // px per frame

    const animate = () => {
      if (!isPaused && lightboxIndex === null) {
        // Row 1: scroll right
        scrollPosRef.current += speed;
        const singleSetWidth1 = track1.scrollWidth / 2;
        if (scrollPosRef.current >= singleSetWidth1) {
          scrollPosRef.current -= singleSetWidth1;
        }
        track1.style.transform = `translateX(-${scrollPosRef.current}px)`;

        // Row 2: scroll left (opposite direction)
        scrollPos2Ref.current -= speed;
        const singleSetWidth2 = track2.scrollWidth / 2;
        if (scrollPos2Ref.current <= 0) {
          scrollPos2Ref.current += singleSetWidth2;
        }
        track2.style.transform = `translateX(-${scrollPos2Ref.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, lightboxIndex, activeYear]);

  const handleImageLoad = (src: string) => {
    setIsLoaded((prev) => ({ ...prev, [src]: true }));
  };

  // Scroll both rows by a chunk on button click (opposite directions)
  const scrollCarousel = (direction: "left" | "right") => {
    const jump = 400;
    // Row 1: follows the button direction
    if (direction === "left") {
      scrollPosRef.current = Math.max(0, scrollPosRef.current - jump);
    } else {
      scrollPosRef.current += jump;
    }
    // Row 2: goes the opposite direction
    if (direction === "left") {
      scrollPos2Ref.current += jump;
    } else {
      scrollPos2Ref.current = Math.max(0, scrollPos2Ref.current - jump);
    }

    const ease = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
    if (trackRef.current) {
      trackRef.current.style.transition = ease;
      trackRef.current.style.transform = `translateX(-${scrollPosRef.current}px)`;
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "none";
      }, 500);
    }
    if (track2Ref.current) {
      track2Ref.current.style.transition = ease;
      track2Ref.current.style.transform = `translateX(-${scrollPos2Ref.current}px)`;
      setTimeout(() => {
        if (track2Ref.current) track2Ref.current.style.transition = "none";
      }, 500);
    }
  };

  const renderCard = (item: GalleryItem, globalIndex: number) => (
    <div
      key={`${activeYear}-${item.src}-${globalIndex}`}
      className={`carousel-card ${isLoaded[item.src] ? "loaded" : ""}`}
      onClick={() => openLightbox(globalIndex)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {item.type === "video" ? (
        <div className="gallery-video-thumb">
          <video
            src={item.src}
            muted
            playsInline
            preload="metadata"
            className="gallery-media"
            onLoadedData={() => handleImageLoad(item.src)}
          />
          <div className="gallery-play-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 48 }}>
              play_circle
            </span>
          </div>
        </div>
      ) : (
        <Image
          src={item.src}
          alt={`${item.category} - DSSYWLC '${activeYear.slice(2)}`}
          fill
          sizes="320px"
          className="gallery-media"
          onLoad={() => handleImageLoad(item.src)}
        />
      )}
      {/* Overlay */}
      <div className="gallery-overlay">
        <span className="gallery-badge">{item.day}</span>
        <span className="gallery-category">{item.category}</span>
        {item.type === "video" && (
          <span className="gallery-type-badge">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>videocam</span>
            Video
          </span>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-[#f8fafb]" id="gallery">
      <div className="section-container animate-on-scroll">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#c9a227] font-bold text-sm uppercase tracking-widest mb-3">
            Glimpses from Previous Editions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Event Gallery</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Relive the moments from DSSYWLC through our curated collection of photographs and videos from past editions.
          </p>
        </div>

        {/* Year Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
            {(["2024", "2023"] as YearKey[]).map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`relative px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeYear === year
                  ? "bg-[#00546B] text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                DSSYWLC &apos;{year.slice(2)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel — full-width, bleeds outside container */}
      <div className="carousel-wrapper">
        {/* Nav arrows */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={() => scrollCarousel("left")}
          aria-label="Scroll left"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={() => scrollCarousel("right")}
          aria-label="Scroll right"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>

        {/* Row 1 — scrolls right */}
        <div className="carousel-track-container">
          <div className="carousel-track" ref={trackRef}>
            {/* Original set */}
            {row1.map((item, i) => renderCard(item, i))}
            {/* Duplicate set for seamless loop */}
            {row1.map((item, i) => renderCard(item, i))}
          </div>
        </div>

        {/* Row 2 — scrolls left (JS-controlled, opposite direction) */}
        <div className="carousel-track-container mt-4">
          <div className="carousel-track" ref={track2Ref}>
            {/* Original set */}
            {row2.map((item, i) => renderCard(item, midpoint + i))}
            {/* Duplicate set for seamless loop */}
            {row2.map((item, i) => renderCard(item, midpoint + i))}
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      {lightboxIndex !== null && currentGallery[lightboxIndex] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Prev button */}
            <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Previous image">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Media */}
            <div className="lightbox-media-container">
              {currentGallery[lightboxIndex].type === "video" ? (
                <video
                  src={currentGallery[lightboxIndex].src}
                  controls
                  autoPlay
                  className="lightbox-media"
                />
              ) : (
                <Image
                  src={currentGallery[lightboxIndex].src}
                  alt={`${currentGallery[lightboxIndex].category} - DSSYWLC '${activeYear.slice(2)}`}
                  fill
                  sizes="90vw"
                  className="lightbox-media"
                  priority
                />
              )}
            </div>

            {/* Next button */}
            <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Next image">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Caption */}
            <div className="lightbox-caption">
              <span className="lightbox-caption-badge">
                {currentGallery[lightboxIndex].day} • DSSYWLC &apos;{activeYear.slice(2)}
              </span>
              <span className="lightbox-caption-text">{currentGallery[lightboxIndex].category}</span>
              <span className="lightbox-counter">{lightboxIndex + 1} / {currentGallery.length}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
