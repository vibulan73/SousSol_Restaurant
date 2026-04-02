"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroApi } from "@/lib/api";
import type { HeroImage } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function HeroSection() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    heroApi.getActive().then(setImages).catch(() => {});
    // Trigger text entrance animation
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Cycle through hero images
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length);
    }, 10000);
    return () => clearInterval(id);
  }, [images]);

  const img = images[current];

  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background image from API, or gradient fallback */}
      <Image
        src={img?.imageUrl ? `${API_URL}${img.imageUrl}` : "/hero.jpeg"}
        alt="Sous Sol atmosphere"
        fill
        className="object-cover"
        priority
      />

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-ss-black/70 via-ss-black/30 to-ss-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-ss-black/40 via-transparent to-ss-black/40" />

      {/* Content */}
      <div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Pre-heading ornament */}
        <div className={`flex items-center justify-center gap-5 mb-7 ${visible ? "hero-line-1" : "opacity-0"}`}>
          <div className="h-px w-14 bg-ss-gold/40" />
          <span className="text-ss-gold text-[10px] tracking-[0.6em] uppercase">Est. Norwood</span>
          <div className="h-px w-14 bg-ss-gold/40" />
        </div>

        {/* Restaurant name */}
        <h1 className={`font-display text-[72px] sm:text-8xl md:text-[108px] text-ss-gold tracking-[0.18em] uppercase leading-none mb-5 ${visible ? "hero-line-2" : "opacity-0"}`}>
          Sous Sol
        </h1>

        {/* Diamond divider */}
        <div className={`flex items-center justify-center gap-4 mb-6 ${visible ? "hero-line-3" : "opacity-0"}`}>
          <div className="h-px w-10 bg-ss-gold/35" />
          <span className="text-ss-gold text-xs ss-gold-glow">◆</span>
          <div className="h-px w-10 bg-ss-gold/35" />
        </div>

        {/* Tagline */}
        <p className={`font-accent text-xl sm:text-2xl text-ss-cream/90 italic tracking-wide mb-4 ${visible ? "hero-line-4" : "opacity-0"}`}>
          Hidden Below. Found By Few.
        </p>

        {/* Subline */}
        <p className={`text-ss-muted text-xs sm:text-sm tracking-[0.25em] uppercase mb-12 max-w-lg mx-auto leading-relaxed ${visible ? "hero-line-5" : "opacity-0"}`}>
          A clandestine dining experience beneath the streets of Norwood
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${visible ? "hero-line-6" : "opacity-0"}`}>
          <Link
            href="/reservations"
            className="border border-ss-gold text-ss-gold hover:bg-ss-gold hover:text-ss-black px-10 py-4 text-xs tracking-[0.35em] uppercase transition-all duration-300 min-w-[200px] text-center ss-btn-3d"
          >
            Reserve Your Table
          </Link>
          <Link
            href="/menu"
            className="border border-ss-cream/20 text-ss-cream/60 hover:border-ss-cream/50 hover:text-ss-cream px-10 py-4 text-xs tracking-[0.35em] uppercase transition-all duration-300 min-w-[200px] text-center ss-btn-3d"
          >
            Explore the Menu
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
        <span className="text-ss-muted text-[9px] tracking-[0.5em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-ss-gold/50 to-transparent" />
      </div>

      {/* Image dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-10 right-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 transition-all duration-300 ${
                i === current ? "bg-ss-gold scale-125" : "bg-ss-muted/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
