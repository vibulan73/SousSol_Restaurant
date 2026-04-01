export interface HeroImage {
  id: number;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  isActive: boolean;
}

export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface MenuSubcategory {
  id: number;
  name: string;
  imageUrl?: string;
  displayOrder?: number;
  categoryId: number;
  categoryName?: string;
}

export interface ItemSize {
  id: number;
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  subcategoryId?: number;
  subcategoryName?: string;
  sizes?: ItemSize[];
  isPopular: boolean;
  isSpicy: boolean;
  isVegan: boolean;
  isActive: boolean;
  imageUrl?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  time?: string;
  reservationLink?: string;
  active: boolean;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  category?: string;
  caption?: string;
  displayOrder?: number;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface ReservationDTO {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SiteSettings = Record<string, string>;
