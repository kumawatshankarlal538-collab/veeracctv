import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  ASSET_IMAGES,
  DEFAULT_SITE_SETTINGS,
  SEED_BRANDS,
  SEED_GALLERY,
  SEED_PRODUCTS,
  SEED_PROJECTS,
  SEED_SERVICES,
  SEED_TESTIMONIALS,
} from '../data/seedData';
import type {
  BrandItem,
  GalleryPhotoItem,
  InquiryItem,
  InquiryStatus,
  ProductItem,
  ProjectItem,
  ServiceItem,
  SiteSettingsData,
  TestimonialItem,
} from '../types/cctv';
import { useAuth } from './AuthContext';

interface CatalogContextValue {
  services: ServiceItem[];
  products: ProductItem[];
  brands: BrandItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  gallery: GalleryPhotoItem[];
  siteSettings: SiteSettingsData;
  inquiries: InquiryItem[];
  cloudSeeded: boolean;
  loadingCatalog: boolean;
  seedCloudCatalog: () => Promise<void>;
  saveService: (item: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveProduct: (item: ProductItem) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveBrand: (item: BrandItem) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  saveProject: (item: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveTestimonial: (item: TestimonialItem) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  saveGalleryPhoto: (item: GalleryPhotoItem) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
  saveSiteSettings: (settings: SiteSettingsData) => Promise<void>;
  submitInquiry: (payload: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    propertyType: string;
    message: string;
  }) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus, source?: 'firestore' | 'express') => Promise<void>;
  deleteInquiry: (id: string, source?: 'firestore' | 'express') => Promise<void>;
  uploadImageFile: (file: File) => Promise<string>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function makeSafeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, expressToken, isAdmin, authReady } = useAuth();

  const [services, setServices] = useState<ServiceItem[]>(SEED_SERVICES);
  const [products, setProducts] = useState<ProductItem[]>(SEED_PRODUCTS);
  const [brands, setBrands] = useState<BrandItem[]>(SEED_BRANDS);
  const [projects, setProjects] = useState<ProjectItem[]>(SEED_PROJECTS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(SEED_TESTIMONIALS);
  const [gallery, setGallery] = useState<GalleryPhotoItem[]>(SEED_GALLERY);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [firestoreInquiries, setFirestoreInquiries] = useState<InquiryItem[]>([]);
  const [expressInquiries, setExpressInquiries] = useState<InquiryItem[]>([]);
  const [cloudSeeded, setCloudSeeded] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Real-time Firestore listeners for public catalog collections
  useEffect(() => {
    const unsubs: Array<() => void> = [];

    let hasCloudSite = false;

    unsubs.push(
      onSnapshot(
        doc(db, 'siteSettings', 'main'),
        (snap) => {
          if (snap.exists()) {
            hasCloudSite = true;
            setSiteSettings({
              ...DEFAULT_SITE_SETTINGS,
              ...(snap.data() as SiteSettingsData),
            });
            setCloudSeeded(true);
          } else {
            setSiteSettings(DEFAULT_SITE_SETTINGS);
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.GET, 'siteSettings/main');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        query(collection(db, 'services'), orderBy('order', 'asc')),
        (snap) => {
          if (!snap.empty || hasCloudSite) {
            setServices(snap.docs.map((d) => d.data() as ServiceItem));
            if (!snap.empty) setCloudSeeded(true);
          } else {
            setServices(SEED_SERVICES);
          }
          setLoadingCatalog(false);
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'services');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'products'),
        (snap) => {
          if (!snap.empty || hasCloudSite) {
            setProducts(snap.docs.map((d) => d.data() as ProductItem));
          } else {
            setProducts(SEED_PRODUCTS);
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'products');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'brands'),
        (snap) => {
          if (!snap.empty || hasCloudSite) {
            setBrands(snap.docs.map((d) => d.data() as BrandItem));
          } else {
            setBrands(SEED_BRANDS);
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'brands');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'projects'),
        (snap) => {
          if (!snap.empty || hasCloudSite) {
            setProjects(snap.docs.map((d) => d.data() as ProjectItem));
          } else {
            setProjects(SEED_PROJECTS);
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'projects');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'testimonials'),
        (snap) => {
          if (!snap.empty || hasCloudSite) {
            setTestimonials(snap.docs.map((d) => d.data() as TestimonialItem));
          } else {
            setTestimonials(SEED_TESTIMONIALS);
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'testimonials');
        }
      )
    );

    unsubs.push(
      onSnapshot(
        collection(db, 'gallery'),
        (snap) => {
          if (!snap.empty || hasCloudSite) {
            setGallery(snap.docs.map((d) => d.data() as GalleryPhotoItem));
          } else {
            setGallery(SEED_GALLERY);
          }
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'gallery');
        }
      )
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  const refreshExpressInquiries = useCallback(async () => {
    if (!user) {
      setExpressInquiries([]);
      return;
    }
    try {
      const headers: Record<string, string> = {};
      if (expressToken) headers.Authorization = `Bearer ${expressToken}`;
      if (isAdmin && user.email) headers['x-veera-admin-email'] = user.email;
      const res = await fetch('/api/inquiries', { headers });
      if (res.ok) {
        const data = (await res.json()) as { inquiries: InquiryItem[] };
        setExpressInquiries(
          (data.inquiries || []).map((i) => ({ ...i, source: 'express' as const }))
        );
      }
    } catch {
      // Ignore transient express fetch error
    }
  }, [user, expressToken, isAdmin]);

  // Inquiries listener: ONLY attach when authReady and user is authenticated
  useEffect(() => {
    if (!authReady || !firebaseUser) {
      setFirestoreInquiries([]);
      void refreshExpressInquiries();
      return;
    }

    const q = isAdmin
      ? query(collection(db, 'inquiries'))
      : query(collection(db, 'inquiries'), where('ownerId', '==', firebaseUser.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setFirestoreInquiries(
          snap.docs.map((d) => ({ ...(d.data() as InquiryItem), source: 'firestore' as const }))
        );
      },
      (err) => {
        console.warn('Firestore inquiries listener notice:', err);
      }
    );

    void refreshExpressInquiries();
    return () => unsub();
  }, [authReady, firebaseUser, isAdmin, refreshExpressInquiries]);

  // Merge Firestore and Express inquiries without duplicates
  const inquiries = React.useMemo(() => {
    const map = new Map<string, InquiryItem>();
    for (const item of expressInquiries) map.set(item.id, item);
    for (const item of firestoreInquiries) map.set(item.id, item);
    return Array.from(map.values());
  }, [firestoreInquiries, expressInquiries]);

  const seedCloudCatalog = useCallback(async () => {
    if (!firebaseUser || !isAdmin) return;
    const batch = writeBatch(db);

    for (const srv of SEED_SERVICES) {
      batch.set(doc(db, 'services', srv.id), {
        ...srv,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    for (const prod of SEED_PRODUCTS) {
      batch.set(doc(db, 'products', prod.id), {
        ...prod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    for (const brand of SEED_BRANDS) {
      batch.set(doc(db, 'brands', brand.id), {
        ...brand,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    for (const proj of SEED_PROJECTS) {
      batch.set(doc(db, 'projects', proj.id), {
        ...proj,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    for (const test of SEED_TESTIMONIALS) {
      batch.set(doc(db, 'testimonials', test.id), {
        ...test,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    for (const photo of SEED_GALLERY) {
      batch.set(doc(db, 'gallery', photo.id), {
        ...photo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    batch.set(doc(db, 'siteSettings', 'main'), {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: serverTimestamp(),
    });

    try {
      await batch.commit();
      setCloudSeeded(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'batch_seed');
    }
  }, [firebaseUser, isAdmin]);

  // Auto-seed Firestore once when an authenticated Admin opens the app on an empty DB
  useEffect(() => {
    if (authReady && firebaseUser && isAdmin && !loadingCatalog && !cloudSeeded) {
      void (async () => {
        try {
          const settingsSnap = await getDoc(doc(db, 'siteSettings', 'main'));
          if (!settingsSnap.exists()) {
            await seedCloudCatalog();
          } else {
            setCloudSeeded(true);
          }
        } catch {
          // Will allow manual trigger if needed
        }
      })();
    }
  }, [authReady, firebaseUser, isAdmin, loadingCatalog, cloudSeeded, seedCloudCatalog]);

  const saveService = async (item: ServiceItem) => {
    const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeSafeId('srv');
    const path = `services/${id}`;
    const payload = {
      id,
      title: item.title.trim().slice(0, 100),
      description: item.description.trim().slice(0, 600),
      icon: item.icon.trim().slice(0, 40) || 'Camera',
      category: item.category.trim().slice(0, 60) || 'Security',
      features: item.features.slice(0, 8).map((f) => f.trim().slice(0, 120)).filter(Boolean),
      imageUrl: item.imageUrl.trim().slice(0, 1000),
      order: Number(item.order) || 1,
    };
    try {
      const ref = doc(db, 'services', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { id: _ignored, ...updatable } = payload;
        await updateDoc(ref, { ...updatable, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  const saveProduct = async (item: ProductItem) => {
    const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeSafeId('prod');
    const path = `products/${id}`;
    const payload = {
      id,
      name: item.name.trim().slice(0, 120),
      brand: item.brand.trim().slice(0, 60),
      category: item.category,
      resolution: item.resolution.trim().slice(0, 40),
      price: Math.max(0, Number(item.price) || 0),
      description: item.description.trim().slice(0, 1000),
      specs: item.specs.slice(0, 10).map((s) => s.trim().slice(0, 120)).filter(Boolean),
      imageUrl: item.imageUrl.trim().slice(0, 1000),
      inStock: Boolean(item.inStock),
      featured: Boolean(item.featured),
    };
    try {
      const ref = doc(db, 'products', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { id: _ignored, ...updatable } = payload;
        await updateDoc(ref, { ...updatable, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const saveBrand = async (item: BrandItem) => {
    const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeSafeId('brand');
    const path = `brands/${id}`;
    const payload = {
      id,
      name: item.name.trim().slice(0, 60),
      tagline: item.tagline.trim().slice(0, 140),
      description: item.description.trim().slice(0, 500),
      imageUrl: item.imageUrl.trim().slice(0, 1000),
      country: item.country.trim().slice(0, 60),
      warrantyYears: Math.min(25, Math.max(0, Number(item.warrantyYears) || 2)),
    };
    try {
      const ref = doc(db, 'brands', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { id: _ignored, ...updatable } = payload;
        await updateDoc(ref, { ...updatable, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'brands', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `brands/${id}`);
    }
  };

  const saveProject = async (item: ProjectItem) => {
    const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeSafeId('proj');
    const path = `projects/${id}`;
    const payload = {
      id,
      title: item.title.trim().slice(0, 120),
      industry: item.industry,
      location: item.location.trim().slice(0, 100),
      camerasInstalled: Math.max(1, Number(item.camerasInstalled) || 1),
      completionYear: item.completionYear.trim().slice(0, 10) || '2026',
      summary: item.summary.trim().slice(0, 800),
      outcomeMetric: item.outcomeMetric.trim().slice(0, 120),
      imageUrl: item.imageUrl.trim().slice(0, 1000),
    };
    try {
      const ref = doc(db, 'projects', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { id: _ignored, ...updatable } = payload;
        await updateDoc(ref, { ...updatable, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    }
  };

  const saveTestimonial = async (item: TestimonialItem) => {
    const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeSafeId('test');
    const path = `testimonials/${id}`;
    const payload = {
      id,
      clientName: item.clientName.trim().slice(0, 80),
      role: item.role.trim().slice(0, 80),
      company: item.company.trim().slice(0, 100),
      quote: item.quote.trim().slice(0, 600),
      rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
      projectType: item.projectType.trim().slice(0, 80),
    };
    try {
      const ref = doc(db, 'testimonials', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { id: _ignored, ...updatable } = payload;
        await updateDoc(ref, { ...updatable, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `testimonials/${id}`);
    }
  };

  const saveGalleryPhoto = async (item: GalleryPhotoItem) => {
    const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeSafeId('gal');
    const path = `gallery/${id}`;
    const payload = {
      id,
      title: item.title.trim().slice(0, 100),
      category: item.category,
      caption: item.caption.trim().slice(0, 300),
      imageUrl: item.imageUrl.trim().slice(0, 1000),
    };
    try {
      const ref = doc(db, 'gallery', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const { id: _ignored, ...updatable } = payload;
        await updateDoc(ref, { ...updatable, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const saveSiteSettings = async (settings: SiteSettingsData) => {
    const path = 'siteSettings/main';
    const payload = {
      companyName: settings.companyName.trim().slice(0, 60),
      promoBanner: settings.promoBanner.trim().slice(0, 160),
      phone: settings.phone.trim().slice(0, 30),
      whatsapp: settings.whatsapp.trim().slice(0, 30),
      email: settings.email.trim().slice(0, 120),
      address: settings.address.trim().slice(0, 200),
      experienceYears: Math.min(100, Math.max(0, Number(settings.experienceYears) || 15)),
      heroHeadline: settings.heroHeadline.trim().slice(0, 160),
      heroSubheadline: settings.heroSubheadline.trim().slice(0, 400),
      aboutHeadline: settings.aboutHeadline.trim().slice(0, 160),
      aboutDescription: settings.aboutDescription.trim().slice(0, 800),
      heroImageUrl: (settings.heroImageUrl || ASSET_IMAGES.heroControlRoom).trim().slice(0, 1000),
      aboutImageUrl: (settings.aboutImageUrl || ASSET_IMAGES.aboutPole).trim().slice(0, 1000),
    };
    try {
      const ref = doc(db, 'siteSettings', 'main');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
      } else {
        await setDoc(ref, { ...payload, updatedAt: serverTimestamp() });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const submitInquiry = async (payload: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    propertyType: string;
    message: string;
  }) => {
    const id = makeSafeId('inq');
    const clean = {
      name: payload.name.trim().slice(0, 80),
      email: payload.email.trim().slice(0, 120),
      phone: payload.phone.trim().slice(0, 30),
      serviceType: payload.serviceType.trim().slice(0, 80),
      propertyType: payload.propertyType.trim().slice(0, 80),
      message: payload.message.trim().slice(0, 1500),
    };

    // Always submit to Express REST API so both guest and authenticated quotes persist
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...clean, ownerId: user?.uid || null }),
    });
    if (!res.ok) {
      const errData = (await res.json()) as { error?: string };
      throw new Error(errData.error || 'Failed to submit inquiry.');
    }

    // If user is authenticated via Firebase Auth, also persist directly to Firestore
    if (firebaseUser && firebaseUser.emailVerified) {
      try {
        await setDoc(doc(db, 'inquiries', id), {
          id,
          ownerId: firebaseUser.uid,
          ...clean,
          status: 'New',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `inquiries/${id}`);
      }
    }
    await refreshExpressInquiries();
  };

  const updateInquiryStatus = async (
    id: string,
    status: InquiryStatus,
    source?: 'firestore' | 'express'
  ) => {
    if (source === 'firestore' || (firebaseUser && isAdmin)) {
      const ref = doc(db, 'inquiries', id);
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          await updateDoc(ref, { status, updatedAt: serverTimestamp() });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
      }
    }
    if (source === 'express' || !source) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user?.email) headers['x-veera-admin-email'] = user.email;
      if (expressToken) headers.Authorization = `Bearer ${expressToken}`;
      await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
      await refreshExpressInquiries();
    }
  };

  const deleteInquiry = async (id: string, source?: 'firestore' | 'express') => {
    if (source === 'firestore' || (firebaseUser && isAdmin)) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
      }
    }
    if (source === 'express' || !source) {
      const headers: Record<string, string> = {};
      if (user?.email) headers['x-veera-admin-email'] = user.email;
      if (expressToken) headers.Authorization = `Bearer ${expressToken}`;
      await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      });
      await refreshExpressInquiries();
    }
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const headers: Record<string, string> = {};
    if (user?.email) headers['x-veera-admin-email'] = user.email;
    if (expressToken) headers.Authorization = `Bearer ${expressToken}`;

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Image upload failed.');
    }
    return data.url;
  };

  return (
    <CatalogContext.Provider
      value={{
        services,
        products,
        brands,
        projects,
        testimonials,
        gallery,
        siteSettings,
        inquiries,
        cloudSeeded,
        loadingCatalog,
        seedCloudCatalog,
        saveService,
        deleteService,
        saveProduct,
        deleteProduct,
        saveBrand,
        deleteBrand,
        saveProject,
        deleteProject,
        saveTestimonial,
        deleteTestimonial,
        saveGalleryPhoto,
        deleteGalleryPhoto,
        saveSiteSettings,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        uploadImageFile,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
