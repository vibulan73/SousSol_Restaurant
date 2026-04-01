"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ── Types ──────────────────────────────────────────────────────────────────

interface HeroImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
  active: boolean;
}

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

interface Stats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalMenuItems: number;
}

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
}

interface ItemSize {
  name: string;
  price: string;
}

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price?: number;
  categoryId: number;
  categoryName?: string;
  subcategoryId?: number;
  subcategoryName?: string;
  isPopular: boolean;
  isSpicy: boolean;
  isVegan: boolean;
  isActive: boolean;
  sizes?: { id: number; name: string; price: number }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function statusBadge(s: string) {
  if (s === "CONFIRMED") return "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50";
  if (s === "CANCELLED") return "bg-red-900/30 text-red-400/70 border border-red-900/40";
  return "bg-ss-surface text-ss-gold border border-ss-gold/30";
}

const inputCls =
  "w-full bg-ss-black border border-ss-border text-ss-cream placeholder-ss-muted/50 px-3 py-2.5 text-sm focus:border-ss-gold/50 transition-colors outline-none";

const labelCls = "block text-ss-muted text-[10px] tracking-[0.35em] uppercase mb-1.5";

// ── StatCard ───────────────────────────────────────────────────────────────

function StatCard({ label, value, accent = "gold" }: { label: string; value: number; accent?: "gold" | "green" | "red" | "neutral" }) {
  const accentCls = {
    gold:    "border-l-ss-gold/70 text-ss-gold",
    green:   "border-l-emerald-500/60 text-emerald-400",
    red:     "border-l-red-500/40 text-red-400",
    neutral: "border-l-ss-border text-ss-cream",
  }[accent];
  return (
    <div className={`border border-ss-border bg-ss-surface px-5 py-6 border-l-[3px] ss-stat-3d ${accentCls.split(" ")[0]}`}>
      <p className="text-ss-muted text-[10px] tracking-[0.4em] uppercase mb-3">{label}</p>
      <p className={`font-display text-4xl ${accentCls.split(" ")[1]}`}>{value}</p>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/login`, { username, password });
      const token: string = res.data.token;
      localStorage.setItem("ss-admin-token", token);
      onLogin(token);
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ss-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-ss-gold text-[9px] tracking-[0.6em] uppercase mb-4">Admin Access</p>
          <h1 className="font-display text-4xl text-ss-cream mb-4">Sous Sol</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-ss-gold/30" />
            <span className="text-ss-gold text-xs">◆</span>
            <div className="h-px w-10 bg-ss-gold/30" />
          </div>
        </div>
        {/* Form card */}
        <div className="border border-ss-border bg-ss-surface px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Username</label>
              <input type="text" placeholder="admin" value={username}
                onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                className={inputCls} />
            </div>
            {error && (
              <p className="text-red-400/70 text-xs tracking-wider border border-red-900/30 bg-red-900/10 px-3 py-2">
                {error}
              </p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-ss-gold text-ss-black hover:bg-ss-gold-light py-3.5 text-xs tracking-[0.35em] uppercase transition-colors disabled:opacity-60 font-semibold mt-2 ss-btn-3d">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

// ── Hero Images Section ────────────────────────────────────────────────────

function HeroImagesSection({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const headers = authHeader(token);

  const fetchImages = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/hero-images/all`, { headers });
      setImages(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) onUnauthorized();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, onUnauthorized]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post(`${API}/api/upload`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      const imageUrl: string = uploadRes.data.url;
      const order = images.length;
      await axios.post(`${API}/api/hero-images`, { imageUrl, displayOrder: order, active: true }, { headers });
      setMsg("Image uploaded and added.");
      await fetchImages();
    } catch {
      setMsg("Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const toggleActive = async (img: HeroImage) => {
    try {
      await axios.put(`${API}/api/hero-images/${img.id}`, { active: !img.active }, { headers });
      await fetchImages();
    } catch { /* silent */ }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("Delete this hero image?")) return;
    try {
      await axios.delete(`${API}/api/hero-images/${id}`, { headers });
      await fetchImages();
    } catch { /* silent */ }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl text-ss-cream">Hero Images</h2>
          <p className="text-ss-muted text-xs mt-1">
            {images.filter((i) => i.active).length} active · cycles every 10 seconds when more than 1
          </p>
        </div>
        <label className={`cursor-pointer border border-ss-gold text-ss-gold hover:bg-ss-gold hover:text-ss-black px-6 py-2.5 text-xs tracking-[0.3em] uppercase transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? "Uploading..." : "+ Upload Image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {msg && (
        <p className={`text-xs mb-4 ${msg.startsWith("Upload failed") ? "text-red-400/70" : "text-emerald-400"}`}>
          {msg}
        </p>
      )}

      {images.length === 0 ? (
        <div className="border border-ss-border bg-ss-surface py-16 text-center">
          <p className="text-ss-muted text-sm tracking-wider">No hero images yet. Upload one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className={`border bg-ss-surface overflow-hidden transition-colors ss-card-3d ${img.active ? "border-ss-border hover:border-ss-gold/25" : "border-ss-border/30 opacity-55"}`}>
              {/* Thumbnail */}
              <div className="relative aspect-video bg-ss-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${API}${img.imageUrl}`}
                  alt="Hero slide"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 ${
                    img.active
                      ? "bg-emerald-900/70 text-emerald-400 border border-emerald-800/50"
                      : "bg-ss-black/70 text-ss-muted border border-ss-border/40"
                  }`}>
                    {img.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-ss-border">
                <span className="text-ss-muted text-[10px] tracking-[0.3em] uppercase">
                  Slide {img.displayOrder + 1}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleActive(img)}
                    className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${
                      img.active
                        ? "text-ss-muted hover:text-ss-gold"
                        : "text-emerald-400/70 hover:text-emerald-400"
                    }`}
                  >
                    {img.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="text-red-400/40 hover:text-red-400 text-[10px] tracking-[0.2em] uppercase transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reservations Section ───────────────────────────────────────────────────

function ReservationsSection({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/reservations`, { headers: authHeader(token) });
      setReservations(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) onUnauthorized();
    }
  }, [token, onUnauthorized]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await axios.put(`${API}/api/reservations/${id}/status`, { status }, { headers: authHeader(token) });
      await fetch();
    } catch { /* silent */ }
    finally { setUpdatingId(null); }
  };

  const visible = filter === "ALL" ? reservations : reservations.filter((r) => r.status === filter);
  const pending = reservations.filter((r) => r.status === "PENDING").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl text-ss-cream">Reservations</h2>
          {pending > 0 && (
            <p className="text-ss-gold text-xs mt-1">
              {pending} pending {pending === 1 ? "request" : "requests"} awaiting review
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-colors ${
                filter === f
                  ? "bg-ss-gold text-ss-black font-semibold"
                  : "border border-ss-border text-ss-muted hover:border-ss-gold/50 hover:text-ss-cream"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="border border-ss-border bg-ss-surface py-16 text-center">
          <p className="text-ss-muted text-sm tracking-wider">No reservations found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((r) => (
            <div key={r.id} className={`border bg-ss-surface transition-colors ${
              r.status === "PENDING" ? "border-ss-gold/20" :
              r.status === "CONFIRMED" ? "border-emerald-900/40" :
              "border-ss-border/50"
            }`}>
              <div className="px-6 py-5 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <p className={labelCls}>Guest</p>
                    <p className="text-ss-cream text-sm font-medium leading-snug">{r.name}</p>
                    <p className="text-ss-muted text-xs mt-1">{r.email}</p>
                    {r.phone && <p className="text-ss-muted text-xs">{r.phone}</p>}
                  </div>
                  <div>
                    <p className={labelCls}>Date & Time</p>
                    <p className="text-ss-cream text-sm">{r.date}</p>
                    <p className="text-ss-muted text-xs mt-0.5">{r.time}</p>
                  </div>
                  <div>
                    <p className={labelCls}>Party Size</p>
                    <p className="text-ss-cream text-sm">{r.guests} {r.guests === 1 ? "guest" : "guests"}</p>
                    {r.notes && <p className="text-ss-muted text-xs mt-1 italic leading-relaxed line-clamp-2">{r.notes}</p>}
                  </div>
                  <div>
                    <p className={labelCls}>Status</p>
                    <span className={`inline-flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 ${statusBadge(r.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        r.status === "CONFIRMED" ? "bg-emerald-400" :
                        r.status === "CANCELLED" ? "bg-red-400/70" : "bg-ss-gold"
                      }`} />
                      {r.status}
                    </span>
                  </div>
                </div>
                {r.status === "PENDING" && (
                  <div className="flex sm:flex-col gap-2 self-center shrink-0">
                    <button onClick={() => updateStatus(r.id, "CONFIRMED")} disabled={updatingId === r.id}
                      className="border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/30 text-[10px] tracking-[0.3em] uppercase px-5 py-2 transition-colors disabled:opacity-50 ss-btn-3d">
                      {updatingId === r.id ? "..." : "Confirm"}
                    </button>
                    <button onClick={() => updateStatus(r.id, "CANCELLED")} disabled={updatingId === r.id}
                      className="border border-red-900/40 text-red-400/70 hover:bg-red-900/20 text-[10px] tracking-[0.3em] uppercase px-5 py-2 transition-colors disabled:opacity-50 ss-btn-3d">
                      {updatingId === r.id ? "..." : "Decline"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Menu Section ───────────────────────────────────────────────────────────

function MenuSection({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);

  // Subcategory form
  const [subForm, setSubForm] = useState({ name: "", categoryId: "" });
  const [subSaving, setSubSaving] = useState(false);
  const [subMsg, setSubMsg] = useState("");

  // Item form
  const [itemForm, setItemForm] = useState({
    name: "", description: "", price: "",
    categoryId: "", subcategoryId: "",
    isPopular: false, isSpicy: false, isVegan: false, isActive: true,
  });
  const [sizes, setSizes] = useState<ItemSize[]>([]);
  const [itemSaving, setItemSaving] = useState(false);
  const [itemMsg, setItemMsg] = useState("");

  // Expand/collapse panels
  const [showSubForm, setShowSubForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  const headers = authHeader(token);

  const fetchAll = useCallback(async () => {
    try {
      const [catRes, subRes, itemRes] = await Promise.all([
        axios.get(`${API}/api/menu/categories`, { headers }),
        axios.get(`${API}/api/menu/subcategories`, { headers }),
        axios.get(`${API}/api/menu/all`, { headers }),
      ]);
      setCategories(catRes.data);
      setSubcategories(subRes.data);
      setItems(itemRes.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) onUnauthorized();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, onUnauthorized]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Subcategories filtered by selected category in item form
  const filteredSubs = subcategories.filter(
    (s) => !itemForm.categoryId || s.categoryId === Number(itemForm.categoryId)
  );

  // ── Add Subcategory ──────────────────────────────────────────────────────

  const submitSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubSaving(true);
    setSubMsg("");
    try {
      await axios.post(
        `${API}/api/menu/subcategories`,
        { name: subForm.name, categoryId: Number(subForm.categoryId) },
        { headers }
      );
      setSubForm({ name: "", categoryId: "" });
      setSubMsg("Subcategory added.");
      await fetchAll();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setSubMsg(err.response.data as string);
      } else {
        setSubMsg("Failed to add subcategory.");
      }
    } finally {
      setSubSaving(false);
    }
  };

  const deleteSubcategory = async (id: number) => {
    if (!confirm("Delete this subcategory?")) return;
    try {
      await axios.delete(`${API}/api/menu/subcategories/${id}`, { headers });
      await fetchAll();
    } catch { /* silent */ }
  };

  // ── Add Item ─────────────────────────────────────────────────────────────

  const addSize = () => setSizes((prev) => [...prev, { name: "", price: "" }]);
  const removeSize = (i: number) => setSizes((prev) => prev.filter((_, idx) => idx !== i));
  const updateSize = (i: number, field: "name" | "price", value: string) => {
    setSizes((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const submitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemSaving(true);
    setItemMsg("");
    try {
      const payload: Record<string, unknown> = {
        name: itemForm.name,
        description: itemForm.description || null,
        categoryId: Number(itemForm.categoryId),
        subcategoryId: itemForm.subcategoryId ? Number(itemForm.subcategoryId) : null,
        isPopular: itemForm.isPopular,
        isSpicy: itemForm.isSpicy,
        isVegan: itemForm.isVegan,
        isActive: itemForm.isActive,
      };

      if (sizes.length > 0) {
        payload.sizes = sizes.map((s) => ({ name: s.name, price: parseFloat(s.price) }));
      } else {
        payload.price = parseFloat(itemForm.price);
      }

      await axios.post(`${API}/api/menu`, payload, { headers });
      setItemForm({
        name: "", description: "", price: "",
        categoryId: "", subcategoryId: "",
        isPopular: false, isSpicy: false, isVegan: false, isActive: true,
      });
      setSizes([]);
      setItemMsg("Item added.");
      await fetchAll();
    } catch {
      setItemMsg("Failed to add item.");
    } finally {
      setItemSaving(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await axios.delete(`${API}/api/menu/${id}`, { headers });
      await fetchAll();
    } catch { /* silent */ }
  };

  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);

  // Group items by category for display
  const itemsByCategory = categories.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.categoryId === cat.id),
  })).filter((c) => c.items.length > 0 && (filterCategoryId === null || c.id === filterCategoryId));

  return (
    <div className="space-y-10">

      {/* ── Add Subcategory ── */}
      <div className="border border-ss-border">
        <button
          onClick={() => setShowSubForm((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-ss-surface/50 transition-colors"
        >
          <span className="text-ss-cream text-sm tracking-[0.2em] uppercase font-medium">
            + Add Subcategory
          </span>
          <svg className={`w-4 h-4 text-ss-muted transition-transform ${showSubForm ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showSubForm && (
          <div className="border-t border-ss-border px-6 py-6">
            <form onSubmit={submitSubcategory} className="grid sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className={labelCls}>Category <span className="text-ss-gold">*</span></label>
                <select value={subForm.categoryId}
                  onChange={(e) => setSubForm((p) => ({ ...p, categoryId: e.target.value }))}
                  required className={inputCls}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Subcategory Name <span className="text-ss-gold">*</span></label>
                <input type="text" placeholder="e.g. Starters" value={subForm.name}
                  onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))}
                  required className={inputCls} />
              </div>
              <div className="flex flex-col gap-2">
                <button type="submit" disabled={subSaving}
                  className="bg-ss-gold text-ss-black hover:bg-ss-gold-light py-2.5 text-xs tracking-[0.3em] uppercase transition-colors disabled:opacity-60 font-semibold">
                  {subSaving ? "Saving..." : "Add"}
                </button>
                {subMsg && (
                  <p className={`text-xs ${subMsg.startsWith("Failed") ? "text-red-400/70" : "text-emerald-400"}`}>
                    {subMsg}
                  </p>
                )}
              </div>
            </form>

            {/* Existing subcategories grouped by category */}
            {subcategories.length > 0 && (
              <div className="mt-6">
                <p className={labelCls}>Existing Subcategories</p>
                <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                  {categories.map((cat) => {
                    const subs = subcategories.filter((s) => s.categoryId === cat.id);
                    if (subs.length === 0) return null;
                    return (
                      <div key={cat.id} className="border border-ss-border">
                        <p className="px-4 py-2 text-[10px] tracking-[0.4em] uppercase text-ss-gold border-b border-ss-border">
                          {cat.name}
                        </p>
                        <ul className="divide-y divide-ss-border">
                          {subs.map((s) => (
                            <li key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm text-ss-cream">
                              {s.name}
                              <button onClick={() => deleteSubcategory(s.id)}
                                className="text-red-400/60 hover:text-red-400 transition-colors text-xs ml-2"
                                title="Delete">✕</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Add Item ── */}
      <div className="border border-ss-border">
        <button
          onClick={() => setShowItemForm((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-ss-surface/50 transition-colors"
        >
          <span className="text-ss-cream text-sm tracking-[0.2em] uppercase font-medium">
            + Add Menu Item
          </span>
          <svg className={`w-4 h-4 text-ss-muted transition-transform ${showItemForm ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showItemForm && (
          <div className="border-t border-ss-border px-6 py-6">
            <form onSubmit={submitItem} className="space-y-5">

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <span className="text-ss-muted text-[10px] tracking-[0.4em] uppercase">Status</span>
                <button
                  type="button"
                  onClick={() => setItemForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className={`flex items-center gap-2 px-4 py-1.5 border text-xs tracking-[0.3em] uppercase font-medium transition-colors ${
                    itemForm.isActive
                      ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
                      : "border-ss-border text-ss-muted bg-ss-surface"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${itemForm.isActive ? "bg-emerald-400" : "bg-ss-muted"}`} />
                  {itemForm.isActive ? "Active" : "Inactive"}
                </button>
              </div>

              {/* Category + Subcategory */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category <span className="text-ss-gold">*</span></label>
                  <select value={itemForm.categoryId}
                    onChange={(e) => setItemForm((p) => ({ ...p, categoryId: e.target.value, subcategoryId: "" }))}
                    required className={inputCls}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Subcategory</label>
                  <select value={itemForm.subcategoryId}
                    onChange={(e) => setItemForm((p) => ({ ...p, subcategoryId: e.target.value }))}
                    className={inputCls}>
                    <option value="">None</option>
                    {filteredSubs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Name + Description */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Item Name <span className="text-ss-gold">*</span></label>
                  <input type="text" placeholder="e.g. Tartare de Boeuf" value={itemForm.name}
                    onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))}
                    required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input type="text" placeholder="Short description" value={itemForm.description}
                    onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))}
                    className={inputCls} />
                </div>
              </div>

              {/* Price OR Sizes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls.replace("mb-1.5", "")}>
                    {sizes.length > 0 ? "Size Variants" : "Price ($)"} {sizes.length === 0 && <span className="text-ss-gold">*</span>}
                  </label>
                  <button type="button" onClick={addSize}
                    className="text-[10px] text-ss-gold hover:text-ss-gold-light tracking-[0.2em] uppercase transition-colors">
                    + Add Size Variant
                  </button>
                </div>

                {sizes.length === 0 ? (
                  <input type="number" step="0.01" min="0" placeholder="0.00" value={itemForm.price}
                    onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))}
                    required className={inputCls} />
                ) : (
                  <div className="space-y-2">
                    {sizes.map((s, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <input type="text" placeholder="Size name (e.g. Glass)" value={s.name}
                          onChange={(e) => updateSize(i, "name", e.target.value)}
                          required className={`${inputCls} flex-1`} />
                        <input type="number" step="0.01" min="0" placeholder="Price" value={s.price}
                          onChange={(e) => updateSize(i, "price", e.target.value)}
                          required className={`${inputCls} w-28`} />
                        <button type="button" onClick={() => removeSize(i)}
                          className="text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Flags */}
              <div>
                <label className={labelCls}>Flags</label>
                <div className="flex flex-wrap gap-5">
                  {([
                    { key: "isPopular", label: "✦ Popular" },
                    { key: "isSpicy",   label: "🌶 Spicy" },
                    { key: "isVegan",   label: "V Vegan" },
                  ] as { key: keyof typeof itemForm; label: string }[]).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox"
                        checked={itemForm[key] as boolean}
                        onChange={(e) => setItemForm((p) => ({ ...p, [key]: e.target.checked }))}
                        className="accent-ss-gold w-4 h-4" />
                      <span className="text-ss-cream text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {itemMsg && (
                <p className={`text-xs ${itemMsg.startsWith("Failed") ? "text-red-400/70" : "text-emerald-400"}`}>
                  {itemMsg}
                </p>
              )}

              <button type="submit" disabled={itemSaving}
                className="bg-ss-gold text-ss-black hover:bg-ss-gold-light px-8 py-3 text-xs tracking-[0.3em] uppercase transition-colors disabled:opacity-60 font-semibold">
                {itemSaving ? "Saving..." : "Add Item"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Items List ── */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <h3 className="font-display text-xl text-ss-cream mr-2">
            All Menu Items <span className="text-ss-muted text-base font-sans ml-2">({items.length})</span>
          </h3>
          <button
            onClick={() => setFilterCategoryId(null)}
            className={`text-xs tracking-[0.3em] uppercase px-3 py-1.5 border transition-colors ${
              filterCategoryId === null
                ? "border-ss-gold text-ss-gold"
                : "border-ss-border text-ss-muted hover:border-ss-gold/50 hover:text-ss-cream"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategoryId(cat.id)}
              className={`text-xs tracking-[0.3em] uppercase px-3 py-1.5 border transition-colors ${
                filterCategoryId === cat.id
                  ? "border-ss-gold text-ss-gold"
                  : "border-ss-border text-ss-muted hover:border-ss-gold/50 hover:text-ss-cream"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {itemsByCategory.map((cat) => (
          <div key={cat.id} className="mb-8">
            <p className="text-ss-gold text-[10px] tracking-[0.5em] uppercase mb-3">{cat.name}</p>
            <div className="space-y-1">
              {cat.items.map((item) => (
                <div key={item.id}
                  className={`flex items-center justify-between px-4 py-3 border ${
                    item.isActive ? "border-ss-border" : "border-ss-border/40 opacity-50"
                  } bg-ss-surface`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <span className="text-ss-cream text-sm">{item.name}</span>
                      {item.subcategoryName && (
                        <span className="text-ss-muted text-xs ml-2">· {item.subcategoryName}</span>
                      )}
                      <div className="flex gap-1.5 mt-0.5 flex-wrap">
                        {item.isPopular && <span className="text-[9px] text-ss-gold">✦ Popular</span>}
                        {item.isSpicy   && <span className="text-[9px] text-orange-400">🌶 Spicy</span>}
                        {item.isVegan   && <span className="text-[9px] text-emerald-400">V Vegan</span>}
                        {!item.isActive && <span className="text-[9px] text-ss-muted">Inactive</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-ss-gold text-sm">
                      {item.sizes && item.sizes.length > 0
                        ? item.sizes.map((s) => `${s.name} $${s.price}`).join(" · ")
                        : item.price != null ? `$${item.price}` : "—"}
                    </span>
                    <button onClick={() => deleteItem(item.id)}
                      className="text-red-400/50 hover:text-red-400 text-xs tracking-[0.2em] uppercase transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<"reservations" | "menu" | "hero">("reservations");

  const onUnauthorized = useCallback(() => {
    localStorage.removeItem("ss-admin-token");
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    axios.get(`${API}/api/admin/dashboard`, { headers: authHeader(token) })
      .then((r) => setStats(r.data))
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) onUnauthorized();
      });
  }, [token, onUnauthorized]);

  return (
    <main className="min-h-screen bg-ss-black">
      {/* Header */}
      <div className="border-b border-ss-border bg-ss-surface/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="border-r border-ss-border pr-5">
              <p className="text-ss-gold text-[9px] tracking-[0.5em] uppercase mb-0.5">Admin</p>
              <h1 className="font-display text-2xl text-ss-cream tracking-[0.15em]">Sous Sol</h1>
            </div>
            <p className="text-ss-muted text-xs hidden sm:block">Dashboard</p>
          </div>
          <button onClick={onLogout}
            className="self-start sm:self-auto border border-ss-border text-ss-muted hover:border-red-900/60 hover:text-red-400/80 text-xs tracking-[0.3em] uppercase px-5 py-2 transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-10">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="ss-enter-3d"><StatCard label="Total Reservations" value={stats.totalReservations} accent="neutral" /></div>
            <div className="ss-enter-3d-delay"><StatCard label="Pending" value={stats.pendingReservations} accent="gold" /></div>
            <div className="ss-enter-3d-delay"><StatCard label="Confirmed" value={stats.confirmedReservations} accent="green" /></div>
            <div className="ss-enter-3d-delay-2"><StatCard label="Cancelled" value={stats.cancelledReservations} accent="red" /></div>
            <div className="ss-enter-3d-delay-2"><StatCard label="Menu Items" value={stats.totalMenuItems} accent="neutral" /></div>
          </div>
        )}

        {/* Tab nav */}
        <div className="flex border-b border-ss-border">
          {([
            { key: "reservations", label: "Reservations" },
            { key: "menu",         label: "Menu" },
            { key: "hero",         label: "Hero Images" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-7 py-3.5 text-xs tracking-[0.3em] uppercase transition-colors border-b-2 -mb-px ${
                tab === key
                  ? "border-ss-gold text-ss-gold"
                  : "border-transparent text-ss-muted hover:text-ss-cream hover:border-ss-border"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "reservations" && (
          <ReservationsSection token={token} onUnauthorized={onUnauthorized} />
        )}
        {tab === "menu" && (
          <MenuSection token={token} onUnauthorized={onUnauthorized} />
        )}
        {tab === "hero" && (
          <HeroImagesSection token={token} onUnauthorized={onUnauthorized} />
        )}
      </div>
    </main>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("ss-admin-token"));
    setReady(true);
  }, []);

  const handleLogin = (t: string) => setToken(t);
  const handleLogout = () => { localStorage.removeItem("ss-admin-token"); setToken(null); };

  if (!ready) return null;
  if (!token) return <LoginForm onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
