"use client";

import { useState } from "react";
import Image from "next/image";
import { newsletterApi } from "@/lib/api";
import Reveal from "@/components/ui/Reveal";

const INSTAGRAM     = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM         || "";
const FACEBOOK      = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK          || "";
const TIKTOK        = process.env.NEXT_PUBLIC_SOCIAL_TIKTOK            || "";
const EMAIL         = process.env.NEXT_PUBLIC_RESTAURANT_EMAIL         || "";
const PHONE         = process.env.NEXT_PUBLIC_RESTAURANT_PHONE         || "";
const ADDR1         = process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS_LINE1 || "";
const ADDR2         = process.env.NEXT_PUBLIC_RESTAURANT_ADDRESS_LINE2 || "";
const MAPS_URL      = process.env.NEXT_PUBLIC_RESTAURANT_MAPS_URL      || "#";

const hours = [
  { day: "Wednesday – Thursday", time: "5:00 pm – 12:00 am" },
  { day: "Friday – Saturday",    time: "5:00 pm – 1:00 am" },
  { day: "Sunday – Tuesday",     time: "Closed" },
];

const SOCIAL_ICONS = [
  {
    url: INSTAGRAM, label: "Instagram",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    url: FACEBOOK, label: "Facebook",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    url: TIKTOK, label: "TikTok",
    icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus("loading");
    try {
      await newsletterApi.subscribe(email.trim());
      setSubStatus("success");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <footer className="bg-ss-black border-t border-ss-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">

        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <Reveal delay={0}><div>
              <div className="mb-5">
              <Image src="/logo.jpg" alt="Sous Sol" width={56} height={56} className="h-12 w-auto object-contain mb-3" />
              <p className="text-ss-muted text-[9px] tracking-[0.5em] uppercase mb-1">Est. Norwood</p>
              <h3 className="font-display text-2xl tracking-[0.25em] uppercase text-ss-gold">Sous Sol</h3>
            </div>
            <p className="text-ss-muted text-sm leading-relaxed mb-6">
              Hidden below. Found by few. A clandestine dining experience beneath
              the streets of Norwood.
            </p>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map(({ url, label, icon }) =>
                url ? (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    aria-label={label} className="text-ss-muted hover:text-ss-gold transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={icon} /></svg>
                  </a>
                ) : (
                  <span key={label} aria-label={label} className="text-ss-muted/30 cursor-default">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={icon} /></svg>
                  </span>
                )
              )}
            </div>
          </div></Reveal>

          {/* Newsletter */}
          <Reveal delay={1}><div>
            <h4 className="text-ss-cream text-[10px] tracking-[0.5em] uppercase mb-6">Stay in the Know</h4>
            <p className="text-ss-muted text-sm leading-relaxed mb-5">
              We rarely send word — but when we do, it&apos;s worth reading.
              Seasonal menus, private events, and the occasional secret.
            </p>
            {subStatus === "success" ? (
              <div className="border border-ss-gold/30 px-4 py-3 text-center">
                <span className="text-ss-gold text-xs tracking-[0.3em] uppercase">Welcome to the fold.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={subStatus === "loading"}
                  className="w-full bg-ss-black border border-ss-border text-ss-cream placeholder-ss-muted/60 px-4 py-3 text-sm focus:border-ss-gold/50 transition-colors outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  className="w-full bg-ss-gold text-ss-black hover:bg-ss-gold-light px-4 py-3 text-xs tracking-[0.3em] uppercase transition-colors disabled:opacity-60 font-medium"
                >
                  {subStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            {subStatus === "error" && (
              <p className="text-red-400/70 text-xs mt-2 tracking-wider">Something went wrong. Please try again.</p>
            )}
          </div></Reveal>

          {/* Hours */}
          <Reveal delay={2}><div>
            <h4 className="text-ss-cream text-[10px] tracking-[0.5em] uppercase mb-6">Hours</h4>
            <ul className="space-y-4">
              {hours.map(({ day, time }) => (
                <li key={day}>
                  <p className="text-ss-muted text-xs tracking-wide mb-0.5">{day}</p>
                  <p className={`text-sm font-medium ${time === "Closed" ? "text-ss-muted/60" : "text-ss-gold"}`}>
                    {time}
                  </p>
                </li>
              ))}
            </ul>
          </div></Reveal>

          {/* Find Us */}
          <Reveal delay={3}><div>
            <h4 className="text-ss-cream text-[10px] tracking-[0.5em] uppercase mb-6">Find Us</h4>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-ss-muted text-xs tracking-[0.3em] uppercase mb-1">Address</p>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                  className="text-ss-cream/80 hover:text-ss-gold transition-colors">
                  <p>Sous Sol</p>
                  <p>{ADDR1}</p>
                  <p className="text-ss-muted">{ADDR2}</p>
                </a>
              </div>
              {EMAIL && (
                <div>
                  <p className="text-ss-muted text-xs tracking-[0.3em] uppercase mb-1">Email</p>
                  <a href={`mailto:${EMAIL}`}
                    className="text-ss-cream/80 hover:text-ss-gold transition-colors">
                    {EMAIL}
                  </a>
                </div>
              )}
              {PHONE && (
                <div>
                  <p className="text-ss-muted text-xs tracking-[0.3em] uppercase mb-1">Phone</p>
                  <a href={`tel:${PHONE.replace(/\s/g, "")}`}
                    className="text-ss-cream/80 hover:text-ss-gold transition-colors">
                    {PHONE}
                  </a>
                </div>
              )}
            </div>
          </div></Reveal>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ss-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ss-muted text-xs tracking-wider">
            © {new Date().getFullYear()} Sous Sol. All rights reserved.
          </p>
          <a href="https://www.codeglofix.com" target="_blank" rel="noopener noreferrer"
            className="text-ss-muted text-xs tracking-wider italic hover:text-ss-gold transition-colors">
            Developed by CodeGloFix Pvt Ltd
          </a>
        </div>

      </div>
    </footer>
  );
}
