import Reveal from "@/components/ui/Reveal";

const GIFT_CARD_URL = process.env.NEXT_PUBLIC_GIFT_CARD_URL || "#";

export default function GiftCardSection() {
  return (
    <section className="py-24 bg-ss-black border-t border-ss-border">
      <Reveal className="max-w-2xl mx-auto px-6 lg:px-10 text-center">

        <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
          The Gift of Sous Sol
        </p>
        <h2 className="font-display text-5xl text-ss-cream mb-5 leading-tight">
          e-Gift Cards
        </h2>
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="h-px w-10 bg-ss-gold/30" />
          <span className="text-ss-gold text-xs ss-gold-glow">◆</span>
          <div className="h-px w-10 bg-ss-gold/30" />
        </div>
        <p className="text-ss-muted text-sm leading-relaxed mb-4">
          Give someone the experience of a lifetime. Our e-Gift Cards are
          redeemable for dining, drinks, and private events — the perfect
          way to share the secret of Sous Sol.
        </p>
        <p className="text-ss-muted text-sm leading-relaxed mb-10">
          Available in any denomination. Delivered instantly to their inbox.
          Valid for 12 months from the date of purchase.
        </p>
        <a
          href={GIFT_CARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-ss-gold text-ss-black hover:bg-ss-gold-light px-10 py-4 text-xs tracking-[0.35em] uppercase transition-colors font-semibold ss-btn-3d"
        >
          Claim a Gift Card
        </a>

      </Reveal>
    </section>
  );
}
