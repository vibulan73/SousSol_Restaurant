"use client";

import { useState } from "react";
import { newsletterApi } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await newsletterApi.subscribe(email.trim());
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-24 bg-ss-dark border-t border-ss-border">
      <div className="max-w-lg mx-auto px-6 text-center">
        <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
          Stay Informed
        </p>
        <h2 className="font-display text-4xl text-ss-cream mb-4">
          Stay in the Know
        </h2>
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="h-px w-10 bg-ss-gold/30" />
          <span className="text-ss-gold text-xs">◆</span>
          <div className="h-px w-10 bg-ss-gold/30" />
        </div>
        <p className="text-ss-muted text-sm leading-relaxed mb-8">
          We rarely send word — but when we do, it&apos;s worth reading.
          Seasonal menus, private events, and the occasional secret.
        </p>

        {status === "success" ? (
          <div className="border border-ss-gold/30 bg-ss-surface px-6 py-5 text-center">
            <span className="text-ss-gold text-sm tracking-[0.3em] uppercase">
              Welcome to the fold.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={status === "loading"}
              className="flex-1 bg-ss-surface border border-ss-border border-r-0 text-ss-cream placeholder-ss-muted px-4 py-3.5 text-sm focus:border-ss-gold/50 transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-ss-gold text-ss-black hover:bg-ss-gold-light px-6 py-3.5 text-xs tracking-[0.3em] uppercase transition-colors disabled:opacity-60 shrink-0 font-medium"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-400/70 text-xs mt-3 tracking-wider">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
