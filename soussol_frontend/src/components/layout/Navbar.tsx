"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

// Sun icon (shown in dark mode → click to go light)
function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    </svg>
  );
}

// Moon icon (shown in light mode → click to go dark)
function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-xs tracking-[0.35em] uppercase transition-colors duration-200 ${
      isActive(href)
        ? "text-ss-gold"
        : "text-ss-cream/60 hover:text-ss-gold"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-ss-black/96 backdrop-blur-md border-b border-ss-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.jpg"
            alt="Sous Sol"
            width={48}
            height={48}
            className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          {/* Menu dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onMouseEnter={() => setMenuOpen(true)}
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-xs tracking-[0.35em] uppercase transition-colors duration-200 ${
                isActive("/menu") ? "text-ss-gold" : "text-ss-cream/60 hover:text-ss-gold"
              }`}
            >
              Menu
              <svg
                className={`w-3 h-3 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div
                onMouseLeave={() => setMenuOpen(false)}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-ss-dark border border-ss-border animate-slide-down shadow-xl shadow-black/40"
              >
                {[
                  { label: "Main Menu", tab: "main" },
                  { label: "Drinks", tab: "drinks" },
                  { label: "Wine", tab: "wine" },
                  { label: "Late Night", tab: "late-nite", time: "10:30pm – Close" },
                ].map(({ label, tab, time }) => (
                  <Link
                    key={tab}
                    href={`/menu?tab=${tab}`}
                    className="block px-5 py-3 text-xs text-ss-cream/60 hover:text-ss-gold hover:bg-ss-surface tracking-[0.3em] uppercase transition-colors border-b border-ss-border/50 last:border-0"
                  >
                    <span>{label}</span>
                    {time && (
                      <span className="block text-[9px] text-ss-gold/60 tracking-[0.2em] normal-case mt-0.5">
                        {time}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/reservations" className={linkClass("/reservations")}>
            Reservations
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="text-ss-muted hover:text-ss-gold transition-colors duration-200 p-1"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="text-ss-muted hover:text-ss-gold transition-colors p-1"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-ss-gold p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-ss-black border-t border-ss-border px-6 py-8 flex flex-col gap-6">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <div className="space-y-4 pl-0">
            <p className="text-ss-muted text-[10px] tracking-[0.5em] uppercase">Menu</p>
            {[
              { label: "Main Menu", tab: "main" },
              { label: "Drinks", tab: "drinks" },
              { label: "Wine", tab: "wine" },
              { label: "Late Night", tab: "late-nite", time: "10:30pm – Close" },
            ].map(({ label, tab, time }) => (
              <Link
                key={tab}
                href={`/menu?tab=${tab}`}
                className="block text-ss-cream/60 hover:text-ss-gold text-xs tracking-[0.35em] uppercase pl-3 border-l border-ss-border"
              >
                {label}
                {time && (
                  <span className="block text-[9px] text-ss-gold/60 tracking-[0.2em] normal-case mt-0.5">
                    {time}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <Link href="/reservations" className={linkClass("/reservations")}>
            Reservations
          </Link>
          <Link
            href="/reservations"
            className="border border-ss-gold text-ss-gold text-xs tracking-[0.3em] uppercase px-6 py-3.5 text-center hover:bg-ss-gold hover:text-ss-black transition-all duration-300"
          >
            Reserve a Table
          </Link>
        </div>
      )}
    </nav>
  );
}
