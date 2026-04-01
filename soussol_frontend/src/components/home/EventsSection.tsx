"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { eventApi } from "@/lib/api";
import type { Event } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function formatEventDate(dateStr: string, timeStr?: string) {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (!timeStr) return formatted;
  // Convert "19:00:00" → "7:00 PM"
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const time = `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  return `${formatted} · ${time}`;
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    eventApi.getUpcoming().then(setEvents).catch(() => {});
  }, []);

  if (!events.length) return null;

  return (
    <section className="py-28 bg-ss-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
            Coming Up
          </p>
          <h2 className="font-display text-5xl text-ss-cream mb-5">
            Events & Evenings
          </h2>
          <div className="flex items-center justify-center gap-5">
            <div className="h-px w-14 bg-ss-gold/30" />
            <span className="text-ss-gold text-xs">◆</span>
            <div className="h-px w-14 bg-ss-gold/30" />
          </div>
        </div>

        {/* Events grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group border border-ss-border hover:border-ss-gold/25 transition-all duration-500 bg-ss-dark"
            >
              {/* Image */}
              {event.imageUrl && (
                <div className="aspect-video overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${API_URL}${event.imageUrl}`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ss-dark/80 to-transparent" />
                </div>
              )}

              <div className="p-6">
                {/* Date */}
                {event.date && (
                  <p className="text-ss-gold text-[10px] tracking-[0.35em] uppercase mb-3">
                    {formatEventDate(event.date, event.time)}
                  </p>
                )}

                {/* Title */}
                <h3 className="font-display text-2xl text-ss-cream group-hover:text-ss-gold transition-colors duration-300 mb-3 leading-snug">
                  {event.title}
                </h3>

                {/* Description */}
                {event.description && (
                  <p className="text-ss-muted text-sm leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Link */}
                {event.reservationLink && (
                  <div className="mt-5">
                    <a
                      href={event.reservationLink}
                      className="inline-flex items-center gap-2 text-ss-gold text-[10px] tracking-[0.3em] uppercase hover:text-ss-gold-light transition-colors group/link"
                    >
                      Reserve for This Event
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/reservations"
            className="inline-block border border-ss-border text-ss-muted hover:border-ss-gold hover:text-ss-gold px-10 py-4 text-xs tracking-[0.35em] uppercase transition-all duration-300"
          >
            Book a Table
          </Link>
        </div>
      </div>
    </section>
  );
}
