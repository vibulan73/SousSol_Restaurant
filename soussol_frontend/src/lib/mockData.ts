import type { MenuCategory, MenuSubcategory, MenuItem } from "@/types";

// ── Toggle ─────────────────────────────────────────────────────────────────
export const MOCK_ENABLED = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// ── Categories ─────────────────────────────────────────────────────────────
export const mockCategories: MenuCategory[] = [
  { id: 1, name: "Main Menu",  displayOrder: 1 },
  { id: 2, name: "Drinks",     displayOrder: 2 },
  { id: 3, name: "Wine",       displayOrder: 3 },
  { id: 4, name: "Late Nite",  displayOrder: 4 },
];

// ── Subcategories ──────────────────────────────────────────────────────────
export const mockSubcategories: MenuSubcategory[] = [
  // Main Menu
  { id: 1,  name: "Première",           categoryId: 1, categoryName: "Main Menu" },
  { id: 2,  name: "À la Carte",         categoryId: 1, categoryName: "Main Menu" },
  { id: 3,  name: "Sides",              categoryId: 1, categoryName: "Main Menu" },
  // Drinks
  { id: 4,  name: "Signature Cocktails",categoryId: 2, categoryName: "Drinks" },
  { id: 5,  name: "Non-Alcoholic",      categoryId: 2, categoryName: "Drinks" },
  { id: 6,  name: "Bière & Cidre",      categoryId: 2, categoryName: "Drinks" },
  // Wine
  { id: 7,  name: "Sparkling",          categoryId: 3, categoryName: "Wine" },
  { id: 8,  name: "Blanc",              categoryId: 3, categoryName: "Wine" },
  { id: 9,  name: "Rouge",              categoryId: 3, categoryName: "Wine" },
  // Late Nite
  { id: 10, name: "Late Night Snacks",  categoryId: 4, categoryName: "Late Nite" },
  { id: 11, name: "Sous Sol Classics",  categoryId: 4, categoryName: "Late Nite" },
];

// ── Items ──────────────────────────────────────────────────────────────────
export const mockItems: MenuItem[] = [

  // ── Main Menu — Première ──────────────────────────────────────────────
  {
    id: 101, name: "Tartare de Boeuf",
    description: "Hand-cut prime beef, capers, shallots, dijon, egg yolk. Served with toasted brioche.",
    price: 18, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 1, subcategoryName: "Première",
    isPopular: true, isSpicy: false, isVegan: false, isActive: true,
  },
  {
    id: 102, name: "Soupe à l'Oignon",
    description: "Classic French onion soup, slow-caramelised, gruyère croûte.",
    price: 14, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 1, subcategoryName: "Première",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
  },
  {
    id: 103, name: "Burrata & Heirloom Tomato",
    description: "Whipped burrata, roasted heirlooms, basil oil, fleur de sel.",
    price: 16, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 1, subcategoryName: "Première",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },

  // ── Main Menu — À la Carte ────────────────────────────────────────────
  {
    id: 104, name: "Confit de Canard",
    description: "Slow-cooked duck leg, lentilles du Puy, red wine jus, roasted garlic.",
    price: 38, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 2, subcategoryName: "À la Carte",
    isPopular: true, isSpicy: false, isVegan: false, isActive: true,
  },
  {
    id: 105, name: "Filet de Saumon",
    description: "Pan-seared Atlantic salmon, beurre blanc, seasonal greens, caperberries.",
    price: 34, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 2, subcategoryName: "À la Carte",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
  },
  {
    id: 106, name: "Risotto aux Champignons",
    description: "Wild mushroom risotto, truffle oil, aged parmesan, fresh thyme.",
    price: 28, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 2, subcategoryName: "À la Carte",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },

  // ── Main Menu — Sides ─────────────────────────────────────────────────
  {
    id: 107, name: "Frites Maison",
    description: "Double-fried house fries, herbed sea salt, aioli.",
    price: 8, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 3, subcategoryName: "Sides",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },
  {
    id: 108, name: "Salade Verte",
    description: "Mixed greens, shaved radish, champagne vinaigrette.",
    price: 9, categoryId: 1, categoryName: "Main Menu",
    subcategoryId: 3, subcategoryName: "Sides",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },

  // ── Drinks — Signature Cocktails ──────────────────────────────────────
  {
    id: 201, name: "Sous Sol Negroni",
    description: "Campari, sweet vermouth, gin, orange peel. Our house take on the classic.",
    price: 16, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 4, subcategoryName: "Signature Cocktails",
    isPopular: true, isSpicy: false, isVegan: true, isActive: true,
  },
  {
    id: 202, name: "The Hidden Garden",
    description: "Hendrick's gin, elderflower, cucumber, lime, soda.",
    price: 15, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 4, subcategoryName: "Signature Cocktails",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },
  {
    id: 203, name: "Smoky Old Fashioned",
    description: "Mezcal, bourbon, smoked maple syrup, mole bitters.",
    price: 17, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 4, subcategoryName: "Signature Cocktails",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },

  // ── Drinks — Non-Alcoholic ────────────────────────────────────────────
  {
    id: 204, name: "Sparkling Yuzu Lemonade",
    description: "Fresh yuzu, lemon, honey, sparkling water, shiso.",
    price: 8, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 5, subcategoryName: "Non-Alcoholic",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },
  {
    id: 205, name: "House Shrub Spritz",
    description: "Apple cider vinegar shrub, ginger, mint, soda.",
    price: 7, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 5, subcategoryName: "Non-Alcoholic",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },

  // ── Drinks — Bière & Cidre ────────────────────────────────────────────
  {
    id: 206, name: "Local Lager",
    description: "Rotating tap selection from Manitoba craft breweries.",
    price: 9, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 6, subcategoryName: "Bière & Cidre",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },
  {
    id: 207, name: "Québec Dry Cider",
    description: "Crisp, bone-dry apple cider from the Eastern Townships.",
    price: 10, categoryId: 2, categoryName: "Drinks",
    subcategoryId: 6, subcategoryName: "Bière & Cidre",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },

  // ── Wine — Sparkling ──────────────────────────────────────────────────
  {
    id: 301, name: "Champagne Brut NV",
    description: "Bright, toasty, fine bubbles. Blanc de blancs style.",
    price: 0, categoryId: 3, categoryName: "Wine",
    subcategoryId: 7, subcategoryName: "Sparkling",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
    sizes: [{ id: 1, name: "Glass", price: 18 }, { id: 2, name: "Bottle", price: 85 }],
  },
  {
    id: 302, name: "Prosecco Extra Dry",
    description: "Floral, pear notes, lightly sweet finish.",
    price: 0, categoryId: 3, categoryName: "Wine",
    subcategoryId: 7, subcategoryName: "Sparkling",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
    sizes: [{ id: 3, name: "Glass", price: 13 }, { id: 4, name: "Bottle", price: 58 }],
  },

  // ── Wine — Blanc ──────────────────────────────────────────────────────
  {
    id: 303, name: "Pouilly-Fumé",
    description: "Loire Valley Sauvignon Blanc. Mineral, citrus, fresh herbs.",
    price: 0, categoryId: 3, categoryName: "Wine",
    subcategoryId: 8, subcategoryName: "Blanc",
    isPopular: true, isSpicy: false, isVegan: false, isActive: true,
    sizes: [{ id: 5, name: "Glass", price: 16 }, { id: 6, name: "Bottle", price: 72 }],
  },
  {
    id: 304, name: "Chablis Premier Cru",
    description: "Burgundy Chardonnay. Unoaked, steely, oyster shell finish.",
    price: 0, categoryId: 3, categoryName: "Wine",
    subcategoryId: 8, subcategoryName: "Blanc",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
    sizes: [{ id: 7, name: "Glass", price: 19 }, { id: 8, name: "Bottle", price: 88 }],
  },

  // ── Wine — Rouge ──────────────────────────────────────────────────────
  {
    id: 305, name: "Côtes du Rhône",
    description: "Grenache blend. Dark fruit, lavender, warm spice.",
    price: 0, categoryId: 3, categoryName: "Wine",
    subcategoryId: 9, subcategoryName: "Rouge",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
    sizes: [{ id: 9, name: "Glass", price: 15 }, { id: 10, name: "Bottle", price: 65 }],
  },
  {
    id: 306, name: "Malbec Reserva",
    description: "Mendoza. Plum, dark chocolate, toasted oak.",
    price: 0, categoryId: 3, categoryName: "Wine",
    subcategoryId: 9, subcategoryName: "Rouge",
    isPopular: true, isSpicy: false, isVegan: false, isActive: true,
    sizes: [{ id: 11, name: "Glass", price: 16 }, { id: 12, name: "Bottle", price: 70 }],
  },

  // ── Late Nite — Late Night Snacks ─────────────────────────────────────
  {
    id: 401, name: "Truffle Frites",
    description: "Shoestring fries, truffle oil, parmesan, chives.",
    price: 12, categoryId: 4, categoryName: "Late Nite",
    subcategoryId: 10, subcategoryName: "Late Night Snacks",
    isPopular: true, isSpicy: false, isVegan: false, isActive: true,
  },
  {
    id: 402, name: "Charcuterie Board",
    description: "Cured meats, aged cheeses, cornichons, grainy mustard, crostini.",
    price: 22, categoryId: 4, categoryName: "Late Nite",
    subcategoryId: 10, subcategoryName: "Late Night Snacks",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
  },
  {
    id: 403, name: "Spicy Chicken Bites",
    description: "Crispy fried chicken, gochujang glaze, sesame, scallion.",
    price: 16, categoryId: 4, categoryName: "Late Nite",
    subcategoryId: 10, subcategoryName: "Late Night Snacks",
    isPopular: false, isSpicy: true, isVegan: false, isActive: true,
  },

  // ── Late Nite — Sous Sol Classics ─────────────────────────────────────
  {
    id: 404, name: "Midnight Mule",
    description: "Vodka, ginger beer, lime, cucumber ribbon.",
    price: 14, categoryId: 4, categoryName: "Late Nite",
    subcategoryId: 11, subcategoryName: "Sous Sol Classics",
    isPopular: false, isSpicy: false, isVegan: true, isActive: true,
  },
  {
    id: 405, name: "Last Call Negroni",
    description: "Campari, sweet vermouth, whisky — a bold close.",
    price: 15, categoryId: 4, categoryName: "Late Nite",
    subcategoryId: 11, subcategoryName: "Sous Sol Classics",
    isPopular: true, isSpicy: false, isVegan: true, isActive: true,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
export function getMockSubcategoriesByCategoryId(categoryId: number): MenuSubcategory[] {
  return mockSubcategories.filter((s) => s.categoryId === categoryId);
}

export function getMockItemsByCategoryId(categoryId: number): MenuItem[] {
  return mockItems.filter((i) => i.categoryId === categoryId);
}

export function getMockPopularItems(): MenuItem[] {
  return mockItems.filter((i) => i.isPopular).slice(0, 4);
}
