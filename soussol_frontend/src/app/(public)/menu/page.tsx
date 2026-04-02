"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { menuApi } from "@/lib/api";
import type { MenuCategory, MenuItem, MenuSubcategory } from "@/types";
import {
  MOCK_ENABLED,
  mockCategories,
  getMockItemsByCategoryId,
  getMockSubcategoriesByCategoryId,
} from "@/lib/mockData";

// ── Tab definition ────────────────────────────────────────────────────────────

type TabSlug = "main" | "drinks" | "wine" | "late-nite";

const TAB_SLUGS: TabSlug[] = ["main", "drinks", "wine", "late-nite"];

const TAB_LABELS: Record<TabSlug, string> = {
  main: "Main Menu",
  drinks: "Drinks",
  wine: "Wine",
  "late-nite": "Late Night",
};

const TAB_KEYWORDS: Record<TabSlug, string[]> = {
  main: ["main", "food", "kitchen", "dine", "dining"],
  drinks: ["drink", "cocktail", "beverage", "bar", "spirits"],
  wine: ["wine", "vino"],
  "late-nite": ["late", "nite", "night"],
};

function matchCategory(
  categories: MenuCategory[],
  slug: TabSlug
): MenuCategory | undefined {
  const keywords = TAB_KEYWORDS[slug];
  return categories.find((c) =>
    keywords.some((kw) => c.name.toLowerCase().includes(kw))
  );
}

function subAnchorId(subId: number | "none") {
  return subId === "none" ? "sub-section-none" : `sub-section-${subId}`;
}

// ── Item badge ────────────────────────────────────────────────────────────────

function Badges({ item }: { item: MenuItem }) {
  return (
    <span className="flex gap-1.5 flex-wrap">
      {item.isPopular && (
        <span className="text-[9px] text-ss-gold border border-ss-gold/30 px-1.5 py-0.5 tracking-[0.3em] uppercase">
          ✦
        </span>
      )}
      {item.isSpicy && (
        <span className="text-[9px] text-orange-400 border border-orange-400/30 px-1.5 py-0.5 tracking-[0.2em] uppercase">
          Hot
        </span>
      )}
      {item.isVegan && (
        <span className="text-[9px] text-emerald-400 border border-emerald-400/30 px-1.5 py-0.5 tracking-[0.2em] uppercase">
          V
        </span>
      )}
    </span>
  );
}

// ── Single menu item row ──────────────────────────────────────────────────────

function MenuRow({ item }: { item: MenuItem }) {
  const hasSizes = item.sizes && item.sizes.length > 0;
  return (
    <div className="flex items-start justify-between gap-8 pb-7 border-b border-ss-border/40 last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h4 className="font-display text-xl text-ss-cream group-hover:text-ss-gold transition-colors duration-300">
            {item.name}
          </h4>
          <Badges item={item} />
        </div>
        {item.description && (
          <p className="text-ss-muted text-sm leading-relaxed">{item.description}</p>
        )}
        {hasSizes && (
          <div className="flex gap-5 mt-2.5 flex-wrap">
            {item.sizes!.map((s) => (
              <span key={s.id} className="text-xs text-ss-muted">
                {s.name}{" "}
                <span className="text-ss-gold">${Number(s.price).toFixed(2)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      {!hasSizes && (
        <div className="shrink-0 pt-0.5">
          <span className="font-accent text-2xl text-ss-gold">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main menu content ─────────────────────────────────────────────────────────

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramTab = (searchParams.get("tab") ?? "main") as TabSlug;
  const activeTab: TabSlug = TAB_SLUGS.includes(paramTab) ? paramTab : "main";

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [subcategories, setSubcategories] = useState<MenuSubcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [catResolved, setCatResolved] = useState(false);
  const [activeSub, setActiveSub] = useState<number | "none" | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load categories once
  useEffect(() => {
    if (MOCK_ENABLED) {
      setCategories(mockCategories);
      setCatResolved(true);
      return;
    }
    menuApi.getCategories().then((cats) => {
      setCategories(cats);
      setCatResolved(true);
    }).catch(() => setCatResolved(true));
  }, []);

  const setTab = (slug: TabSlug) => {
    router.push(`/menu?tab=${slug}`, { scroll: false });
  };

  const matchedCategory = useCallback(
    () => matchCategory(categories, activeTab),
    [categories, activeTab]
  );

  // Load items + subcategories when tab/categories change
  useEffect(() => {
    if (!catResolved) return;
    const cat = matchedCategory();
    if (!cat) { setItems([]); setSubcategories([]); return; }

    if (MOCK_ENABLED) {
      const fetchedItems = getMockItemsByCategoryId(cat.id);
      const fetchedSubs  = getMockSubcategoriesByCategoryId(cat.id);
      setItems(fetchedItems);
      setSubcategories(fetchedSubs);
      setActiveSub(fetchedSubs.length > 0 ? fetchedSubs[0].id : "none");
      return;
    }

    setLoading(true);
    Promise.all([
      menuApi.getItemsByCategory(cat.id),
      menuApi.getSubcategoriesByCategory(cat.id),
    ])
      .then(([fetchedItems, fetchedSubs]) => {
        setItems(fetchedItems);
        setSubcategories(fetchedSubs);
        setActiveSub(fetchedSubs.length > 0 ? fetchedSubs[0].id : "none");
      })
      .catch(() => { setItems([]); setSubcategories([]); })
      .finally(() => setLoading(false));
  }, [catResolved, activeTab, matchedCategory]);

  // IntersectionObserver — track which section is in view
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const sections = document.querySelectorAll("[data-sub-section]");
    if (!sections.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const raw = entry.target.getAttribute("data-sub-section");
            setActiveSub(raw === "none" ? "none" : Number(raw));
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [subcategories, items]);

  const scrollToSub = (subId: number | "none") => {
    const el = document.getElementById(subAnchorId(subId));
    if (!el) return;
    const offset = 140; // account for sticky header
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const bySubcat = (subId?: number) =>
    subId === undefined
      ? items.filter((i) => !i.subcategoryId)
      : items.filter((i) => i.subcategoryId === subId);

  const unsortedItems = bySubcat(undefined);

  // Sidebar entries: subcategories + optional "Selections" for uncategorised
  const sidebarEntries: { id: number | "none"; label: string }[] = [
    ...subcategories
      .filter((s) => bySubcat(s.id).length > 0)
      .map((s) => ({ id: s.id as number | "none", label: s.name })),
    ...(unsortedItems.length > 0 && subcategories.length > 0
      ? [{ id: "none" as const, label: "Selections" }]
      : []),
  ];

  return (
    <main className="min-h-screen bg-ss-black pt-16 md:pt-20">
      {/* Page header */}
      <div className="py-20 text-center border-b border-ss-border">
        <p className="text-ss-gold text-[10px] tracking-[0.6em] uppercase mb-5">
          Curated Selection
        </p>
        <h1 className="font-display text-6xl text-ss-cream mb-5">Our Menu</h1>
        <div className="flex items-center justify-center gap-5 mb-6">
          <div className="h-px w-14 bg-ss-gold/30" />
          <span className="text-ss-gold text-xs ss-gold-glow">◆</span>
          <div className="h-px w-14 bg-ss-gold/30" />
        </div>
        <p className="text-ss-muted text-sm max-w-xl mx-auto leading-relaxed px-4">
          Seasonal. Rotating. Always intentional. Our menu changes with the
          produce and the mood — ensuring no two visits are quite the same.
        </p>
      </div>

      {/* Tab bar */}
      <div className="sticky top-16 md:top-20 z-40 bg-ss-black/96 backdrop-blur-md border-b border-ss-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex">
            {TAB_SLUGS.map((slug) => (
              <button
                key={slug}
                onClick={() => setTab(slug)}
                className={`px-6 sm:px-10 py-5 text-xs tracking-[0.35em] uppercase transition-all duration-300 border-b-2 ${
                  activeTab === slug
                    ? "text-ss-gold border-ss-gold"
                    : "text-ss-muted border-transparent hover:text-ss-cream hover:border-ss-border"
                }`}
              >
                {TAB_LABELS[slug]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile subcategory strip */}
        {sidebarEntries.length > 1 && (
          <div className="lg:hidden border-t border-ss-border overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 px-4 py-2 min-w-max">
              {sidebarEntries.map((entry) => (
                <button
                  key={String(entry.id)}
                  onClick={() => scrollToSub(entry.id)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase whitespace-nowrap transition-colors ${
                    activeSub === entry.id
                      ? "text-ss-gold border-b border-ss-gold"
                      : "text-ss-muted hover:text-ss-cream"
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Late Night banner */}
      {activeTab === "late-nite" && (
        <div className="border-b border-ss-gold/30 bg-ss-gold/8">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="text-ss-gold text-xl">◑</span>
              <div>
                <p className="text-ss-gold text-xs tracking-[0.4em] uppercase font-semibold">
                  The Happiest Hour
                </p>
                <p className="text-ss-muted text-xs mt-0.5 tracking-wide">
                  Late night bites & drinks served after 10:30 pm
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-9 sm:pl-0">
              <div className="h-px w-6 bg-ss-gold/30 hidden sm:block" />
              <span className="font-display text-2xl text-ss-gold tracking-widest">10:30 pm</span>
              <span className="text-ss-muted text-xs tracking-[0.3em] uppercase">until close</span>
            </div>
          </div>
        </div>
      )}

      {/* Body: sidebar + content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex gap-14 ss-tab-fade" key={activeTab}>

          {/* ── Left sidebar (desktop only) ── */}
          {sidebarEntries.length > 1 && (
            <aside className="hidden lg:block w-44 shrink-0">
              <div className="sticky top-44 space-y-0.5">
                <p className="text-[9px] tracking-[0.5em] uppercase text-ss-gold mb-5">
                  Sections
                </p>
                {sidebarEntries.map((entry) => (
                  <button
                    key={String(entry.id)}
                    onClick={() => scrollToSub(entry.id)}
                    className={`w-full text-left py-2 text-xs tracking-[0.2em] uppercase transition-all duration-200 border-l-2 pl-3 ${
                      activeSub === entry.id
                        ? "border-ss-gold text-ss-gold"
                        : "border-transparent text-ss-muted hover:text-ss-cream hover:border-ss-border"
                    }`}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* ── Menu items ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 border-ss-gold/20 border-t-ss-gold rounded-full animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-3xl text-ss-muted mb-4">Coming Soon</p>
                <p className="text-ss-muted/60 text-sm tracking-wider">
                  This section of our menu is being prepared.
                </p>
              </div>
            ) : (
              <>
                {subcategories.map((sub) => {
                  const subItems = bySubcat(sub.id);
                  if (!subItems.length) return null;
                  return (
                    <div
                      key={sub.id}
                      id={subAnchorId(sub.id)}
                      data-sub-section={sub.id}
                      className="mb-14 scroll-mt-40"
                    >
                      <h3 className="font-display text-2xl text-ss-gold mb-1">
                        {sub.name}
                      </h3>
                      <div className="h-px bg-ss-border mb-8" />
                      <div className="space-y-7">
                        {subItems.map((item) => (
                          <MenuRow key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {unsortedItems.length > 0 && (
                  <div
                    id={subAnchorId("none")}
                    data-sub-section="none"
                    className="mb-14 scroll-mt-40"
                  >
                    {subcategories.length > 0 && (
                      <>
                        <h3 className="font-display text-2xl text-ss-gold mb-1">
                          Selections
                        </h3>
                        <div className="h-px bg-ss-border mb-8" />
                      </>
                    )}
                    <div className="space-y-7">
                      {unsortedItems.map((item) => (
                        <MenuRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-10 pt-8 border-t border-ss-border flex flex-wrap gap-6 text-ss-muted text-xs">
                  <span className="flex items-center gap-2">
                    <span className="text-ss-gold">✦</span> Signature dish
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 border border-emerald-400/30 px-1.5">V</span>
                    Vegan
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-orange-400 border border-orange-400/30 px-1.5">Hot</span>
                    Contains chilli
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-ss-black pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-ss-gold/20 border-t-ss-gold rounded-full animate-spin" />
        </main>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
