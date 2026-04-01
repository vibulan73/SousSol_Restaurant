import Reveal from "@/components/ui/Reveal";

export default function LocationSection() {
  return (
    <section className="bg-ss-black border-t border-ss-border py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <Reveal className="text-center mb-12">
          <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">Find Us</p>
          <h2 className="font-display text-5xl text-ss-cream mb-5">Our Location</h2>
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-10 bg-ss-gold/30" />
            <span className="text-ss-gold text-xs ss-gold-glow">◆</span>
            <div className="h-px w-10 bg-ss-gold/30" />
          </div>
          <p className="text-ss-muted text-sm">
            Hidden below the streets of Norwood — look for the sign.
          </p>
        </Reveal>

        {/* Map with decorative frame */}
        <Reveal direction="scale" delay={1}>
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-ss-gold/40 z-10" />
            <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-ss-gold/40 z-10" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-ss-gold/40 z-10" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-ss-gold/40 z-10" />

            <div className="border border-ss-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2571.22830781531!2d-97.14492462365811!3d49.87573897148821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52ea76a9f3ea4b59%3A0x9751f5779d8ac4d6!2sSous%20Sol!5e0!3m2!1sen!2slk!4v1774849209907!5m2!1sen!2slk"
                width="100%"
                height="460"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sous Sol location"
              />
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
