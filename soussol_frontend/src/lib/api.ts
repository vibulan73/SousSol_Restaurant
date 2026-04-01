import axios from "axios";
import type {
  HeroImage,
  MenuCategory,
  MenuSubcategory,
  MenuItem,
  Event,
  GalleryItem,
  TeamMember,
  ReservationDTO,
  ContactMessage,
  SiteSettings,
} from "@/types";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

export const heroApi = {
  getActive: (): Promise<HeroImage[]> =>
    client.get("/api/hero-images").then((r) => r.data),
};

export const menuApi = {
  getCategories: (): Promise<MenuCategory[]> =>
    client.get("/api/menu/categories").then((r) => r.data),

  getSubcategories: (): Promise<MenuSubcategory[]> =>
    client.get("/api/menu/subcategories").then((r) => r.data),

  getSubcategoriesByCategory: (id: number): Promise<MenuSubcategory[]> =>
    client.get(`/api/menu/subcategories/category/${id}`).then((r) => r.data),

  getAllItems: (): Promise<MenuItem[]> =>
    client.get("/api/menu").then((r) => r.data),

  getPopularItems: (): Promise<MenuItem[]> =>
    client.get("/api/menu/popular").then((r) => r.data),

  getItemsByCategory: (id: number): Promise<MenuItem[]> =>
    client.get(`/api/menu/category/${id}`).then((r) => r.data),
};

export const reservationApi = {
  create: (data: ReservationDTO): Promise<ReservationDTO> =>
    client.post("/api/reservations", data).then((r) => r.data),
};

export const eventApi = {
  getUpcoming: (): Promise<Event[]> =>
    client.get("/api/events").then((r) => r.data),
};

export const galleryApi = {
  getAll: (category?: string): Promise<GalleryItem[]> => {
    const params = category ? `?category=${encodeURIComponent(category)}` : "";
    return client.get(`/api/gallery${params}`).then((r) => r.data);
  },
};

export const contactApi = {
  send: (data: ContactMessage): Promise<void> =>
    client.post("/api/contact", data).then((r) => r.data),
};

export const teamApi = {
  getAll: (): Promise<TeamMember[]> =>
    client.get("/api/team").then((r) => r.data),
};

export const settingsApi = {
  getAll: (): Promise<SiteSettings> =>
    client.get("/api/settings").then((r) => r.data),
};

export const newsletterApi = {
  subscribe: (email: string, name?: string): Promise<void> =>
    client.post("/api/newsletter/subscribe", { email, name }).then((r) => r.data),
};
