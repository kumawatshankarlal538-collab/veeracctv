export type AppRoute =
  | 'home'
  | 'about'
  | 'services'
  | 'products'
  | 'brands'
  | 'projects'
  | 'testimonials'
  | 'contact'
  | 'portal'
  | 'admin';

export type ProductCategory =
  | 'Dome Camera'
  | 'Bullet Camera'
  | 'PTZ Camera'
  | 'NVR / DVR'
  | 'Complete Kit'
  | 'Access Control';

export type ProjectIndustry =
  | 'Hotel'
  | 'Property'
  | 'Distribution'
  | 'Schools'
  | 'Industrial'
  | 'Retail';

export type GalleryCategory =
  | 'Installations'
  | 'Hardware'
  | 'Control Rooms'
  | 'Commercial'
  | 'Residential';

export type InquiryStatus = 'New' | 'In Review' | 'Quoted' | 'Closed';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
  imageUrl: string;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  resolution: string;
  price: number;
  description: string;
  specs: string[];
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BrandItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  country: string;
  warrantyYears: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProjectItem {
  id: string;
  title: string;
  industry: ProjectIndustry;
  location: string;
  camerasInstalled: number;
  completionYear: string;
  summary: string;
  outcomeMetric: string;
  imageUrl: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  projectType: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  imageUrl: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface InquiryItem {
  id: string;
  ownerId: string | null;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  propertyType: string;
  message: string;
  status: InquiryStatus;
  source?: 'firestore' | 'express';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SiteSettingsData {
  companyName: string;
  promoBanner: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  experienceYears: number;
  heroHeadline: string;
  heroSubheadline: string;
  aboutHeadline: string;
  aboutDescription: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
  updatedAt?: unknown;
}

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  authProvider?: 'google' | 'express';
}
