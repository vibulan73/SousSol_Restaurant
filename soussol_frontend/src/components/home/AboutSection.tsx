import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function AboutSection() {
  return (
    <section className="py-28 bg-ss-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Text column */}
          <Reveal direction="left">
            <div>
              <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
                Our Story
              </p>
              <h2 className="font-display text-5xl xl:text-6xl text-ss-cream leading-tight mb-6">
                The Hidden
                <br />
                <span className="text-ss-gold">Place</span>
              </h2>
              <div className="h-px w-10 bg-ss-gold mb-9 ss-line-draw" />

              <div className="space-y-5 text-ss-muted leading-relaxed text-sm sm:text-base">
                <p>
                  Tucked beneath the cobblestones of Norwood, Sous Sol exists as a
                  whispered secret among those who know where to look. No signage
                  marks our entrance. No promotions announce our presence.
                  You either know, or you don&apos;t.
                </p>
                <p>
                  Inside, candlelight flickers against exposed brick, gypsy jazz
                  drifts through the air, and a curated menu of seasonal dishes
                  speaks for itself. We believe the finest dining requires no
                  advertisement — only discovery.
                </p>
                <p>
                  Every visit is intentional. Every table is set with care.
                  Every dish reflects what the season gives us, and nothing more.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-8">
                <Link
                  href="/reservations"
                  className="inline-flex items-center gap-3 text-ss-gold text-xs tracking-[0.35em] uppercase hover:text-ss-gold-light transition-colors group"
                >
                  Make a Reservation
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-3 text-ss-muted text-xs tracking-[0.35em] uppercase hover:text-ss-cream transition-colors group"
                >
                  View the Menu
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Visual column */}
          <Reveal direction="right" delay={1}>
            <div className="relative">
              <div className="aspect-[3/4] bg-ss-surface relative overflow-hidden ss-img-tilt">
                <Image
                  src="/story.png"
                  alt="Sous Sol interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-ss-gold/5 via-transparent to-ss-black/40" />
              </div>

              {/* Floating quote card */}
              <div className="absolute -bottom-6 -left-6 bg-ss-dark border border-ss-border p-6 max-w-[260px] shadow-2xl shadow-black/60 ss-float">
                <p className="font-accent text-base text-ss-cream italic leading-relaxed mb-3">
                  &ldquo;Atmosphere over everything.&rdquo;
                </p>
                <div className="h-px w-8 bg-ss-gold mb-2" />
                <p className="text-ss-muted text-[10px] tracking-[0.4em] uppercase">
                  The Sous Sol Philosophy
                </p>
              </div>

              <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-ss-gold/20" />
            </div>
          </Reveal>
        </div>

        {/* Bottom stat bar */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-ss-border pt-12">
          {[
            { value: "Seasonal", label: "Menu" },
            { value: "Intimate", label: "Setting" },
            { value: "Curated", label: "Wine List" },
            { value: "Hidden",   label: "Entrance" },
          ].map(({ value, label }, i) => (
            <Reveal key={label} delay={(i % 4) as 0 | 1 | 2 | 3 | 4}>
              <div className="text-center ss-ambient">
                <p className="font-display text-xl text-ss-gold mb-1">{value}</p>
                <p className="text-ss-muted text-[10px] tracking-[0.5em] uppercase">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
