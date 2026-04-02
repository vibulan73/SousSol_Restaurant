"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { menuApi } from "@/lib/api";
import type { MenuItem } from "@/types";
import Reveal from "@/components/ui/Reveal";
import { MOCK_ENABLED, getMockPopularItems } from "@/lib/mockData";

export default function FeaturedSection() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (MOCK_ENABLED) { setItems(getMockPopularItems()); return; }
    menuApi.getPopularItems().then(setItems).catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section className="py-28 bg-ss-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <Reveal className="text-center mb-16">
          <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">Signature</p>
          <h2 className="font-display text-5xl text-ss-cream mb-5">From the Kitchen</h2>
          <div className="flex items-center justify-center gap-5">
            <div className="h-px w-14 bg-ss-gold/30" />
            <span className="text-ss-gold text-xs ss-gold-glow">◆</span>
            <div className="h-px w-14 bg-ss-gold/30" />
          </div>
          <p className="text-ss-muted text-sm mt-5 max-w-md mx-auto leading-relaxed">
            A selection of what the season brings. Rotating. Always premium.
          </p>
        </Reveal>

        {/* Items grid — seamless panel layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ss-border">
          {items.slice(0, 4).map((item, i) => (
            <Reveal key={item.id} delay={(i % 4) as 0 | 1 | 2 | 3 | 4}>
            <div
              className="group bg-ss-surface hover:bg-ss-black transition-colors duration-500 p-7 flex flex-col ss-card-3d h-full"
            >
              {/* Category label */}
              {item.categoryName && (
                <p className="text-ss-gold/50 text-[9px] tracking-[0.5em] uppercase mb-4">
                  {item.categoryName}
                </p>
              )}

              {/* Name */}
              <h3 className="font-display text-xl text-ss-cream group-hover:text-ss-gold transition-colors duration-300 mb-3 leading-snug">
                {item.name}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="text-ss-muted text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
                  {item.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-ss-border/40 mt-auto">
                <span className="font-accent text-2xl text-ss-gold">
                  ${item.price.toFixed(2)}
                </span>
                <div className="flex gap-1.5">
                  {item.isPopular && (
                    <span className="text-[9px] text-ss-gold border border-ss-gold/30 px-2 py-0.5 tracking-[0.25em] uppercase">✦</span>
                  )}
                  {item.isVegan && (
                    <span className="text-[9px] text-emerald-400 border border-emerald-400/30 px-2 py-0.5 tracking-[0.25em] uppercase">V</span>
                  )}
                  {item.isSpicy && (
                    <span className="text-[9px] text-orange-400 border border-orange-400/30 px-2 py-0.5 tracking-[0.25em] uppercase">Hot</span>
                  )}
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-block border border-ss-gold text-ss-gold hover:bg-ss-gold hover:text-ss-black px-10 py-4 text-xs tracking-[0.35em] uppercase transition-all duration-300 ss-btn-3d"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
