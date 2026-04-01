"use client";

import { useEffect, useState } from "react";
import { galleryApi } from "@/lib/api";
import type { GalleryItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    galleryApi.getAll().then(setItems).catch(() => {});
  }, []);

  if (!items.length) return null;

  // Limit to 9 for a clean 3-column masonry
  const displayed = items.slice(0, 9);

  return (
    <section className="py-28 bg-ss-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
            The Space
          </p>
          <h2 className="font-display text-5xl text-ss-cream mb-5">
            The Atmosphere
          </h2>
          <div className="flex items-center justify-center gap-5">
            <div className="h-px w-14 bg-ss-gold/30" />
            <span className="text-ss-gold text-xs">◆</span>
            <div className="h-px w-14 bg-ss-gold/30" />
          </div>
          <p className="text-ss-muted text-sm mt-5 max-w-md mx-auto leading-relaxed">
            Candlelight. Brick. Jazz. Some things can&apos;t be described — only
            experienced.
          </p>
        </div>

        {/* Masonry-style gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {displayed.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative overflow-hidden bg-ss-dark"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${API_URL}${item.imageUrl}`}
                alt={item.caption || "Sous Sol atmosphere"}
                className="w-full block group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-ss-black/0 group-hover:bg-ss-black/35 transition-all duration-500" />
              {/* Caption */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ss-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-ss-cream text-sm">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
