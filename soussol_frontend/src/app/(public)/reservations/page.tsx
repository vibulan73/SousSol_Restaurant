"use client";

import { useState } from "react";
import { reservationApi } from "@/lib/api";
import type { ReservationDTO } from "@/types";

// ── Constants ─────────────────────────────────────────────────────────────────


const TIME_SLOTS = [
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "21:30", label: "9:30 PM" },
];

type FormStatus = "idle" | "loading" | "success" | "error";

// ── Input component ───────────────────────────────────────────────────────────

const inputClass =
  "w-full min-w-0 bg-ss-surface border border-ss-border text-ss-cream placeholder-ss-muted/60 px-4 py-3.5 text-base sm:text-sm focus:border-ss-gold/50 transition-colors";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReservationsPage() {
  const [form, setForm] = useState<ReservationDTO & { phone: string }>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    notes: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await reservationApi.create(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-ss-black pt-16 md:pt-20">
      {/* Page header */}
      <div className="py-20 text-center border-b border-ss-border ss-enter-3d">
        <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
          Secure Your Place
        </p>
        <h1 className="font-display text-6xl text-ss-cream mb-5">
          Reservations
        </h1>
        <div className="flex items-center justify-center gap-5 mb-6">
          <div className="h-px w-14 bg-ss-gold/30" />
          <span className="text-ss-gold text-xs ss-gold-glow">◆</span>
          <div className="h-px w-14 bg-ss-gold/30" />
        </div>
        <p className="text-ss-muted text-sm max-w-xl mx-auto leading-relaxed px-4">
          We keep our dining room intimate. Tables are limited and evenings fill
          quickly. We recommend booking ahead.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid gap-16">

          {/* ── Reservation form ── */}
          <div className="ss-enter-3d">
            <h2 className="font-display text-3xl text-ss-cream mb-2">
              Make a Reservation
            </h2>
            <p className="text-ss-muted text-sm mb-10">
              Fill in the details below and we&apos;ll confirm your booking
              within 24 hours.
            </p>

            {status === "success" ? (
              <div className="border border-ss-gold/25 bg-ss-surface px-8 py-10 text-center">
                <div className="text-ss-gold text-3xl mb-5">◆</div>
                <h3 className="font-display text-3xl text-ss-cream mb-4">
                  Request Received
                </h3>
                <p className="text-ss-muted text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you, {form.name}. We&apos;ll be in touch shortly to confirm
                  your reservation. We look forward to welcoming you.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      name: "", email: "", phone: "", date: "",
                      time: "", guests: 2, notes: "",
                    });
                  }}
                  className="mt-8 border border-ss-border text-ss-muted hover:border-ss-gold hover:text-ss-gold text-xs tracking-[0.3em] uppercase px-8 py-3 transition-colors"
                >
                  Make Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                      Full Name <span className="text-ss-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                      Email <span className="text-ss-gold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className={inputClass}
                  />
                </div>

                {/* Date + Time + Guests */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="min-w-0">
                    <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                      Date <span className="text-ss-gold">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      min={todayStr}
                      className={inputClass}
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                      Time <span className="text-ss-gold">*</span>
                    </label>
                    <select
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      {TIME_SLOTS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                      Guests <span className="text-ss-gold">*</span>
                    </label>
                    <select
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Dietary requirements, occasions, preferences..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <p className="text-red-400/70 text-xs tracking-wider">
                    Something went wrong. Please try again or contact us at{" "}
                    <a
                      href={`mailto:${process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || ""}`}
                      className="underline hover:text-red-400 transition-colors"
                    >
                      {process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "us"}
                    </a>
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-ss-gold text-ss-black hover:bg-ss-gold-light py-4 text-xs tracking-[0.35em] uppercase transition-colors disabled:opacity-60 font-semibold mt-2 ss-btn-3d"
                >
                  {status === "loading" ? "Sending..." : "Request Reservation"}
                </button>
              </form>
            )}
          </div>

          {/* ── Info column ── */}
          <div className="space-y-8 ss-enter-3d-delay">

            {/* Philosophy quote */}
            <div className="border border-ss-gold/20 bg-ss-surface px-8 py-10 relative">
              <div className="absolute top-5 left-7 text-ss-gold/20 font-display text-6xl leading-none select-none">&ldquo;</div>
              <p className="font-accent text-lg text-ss-cream/80 italic leading-relaxed pt-4">
                We don&apos;t take walk-ins. We don&apos;t take
                same-day bookings. We take guests who appreciate that some things
                are worth planning for.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px w-8 bg-ss-gold/40" />
                <span className="text-ss-muted text-[10px] tracking-[0.4em] uppercase">The Sous Sol Way</span>
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              {[
                { label: "Confirmation", body: "We confirm all reservations within 24 hours by email." },
                { label: "Party Size", body: "We accommodate groups of 1–8. For larger parties, contact us directly." },
                { label: "Cancellations", body: "Please give us 24 hours notice if your plans change." },
              ].map(({ label, body }) => (
                <div key={label} className="flex gap-4 border border-ss-border bg-ss-surface/50 px-5 py-4">
                  <div className="w-px bg-ss-gold/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ss-cream text-xs tracking-[0.3em] uppercase mb-1">{label}</p>
                    <p className="text-ss-muted text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
