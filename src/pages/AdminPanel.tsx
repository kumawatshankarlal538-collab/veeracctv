import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  Camera,
  CheckCircle2,
  Database,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Wrench,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { ASSET_IMAGES } from '../data/seedData';
import type {
  BrandItem,
  GalleryCategory,
  GalleryPhotoItem,
  InquiryStatus,
  ProductCategory,
  ProductItem,
  ProjectIndustry,
  ProjectItem,
  ServiceItem,
  SiteSettingsData,
  TestimonialItem,
} from '../types/cctv';

type AdminSection =
  | 'overview'
  | 'products'
  | 'services'
  | 'brands'
  | 'projects'
  | 'gallery'
  | 'testimonials'
  | 'inquiries'
  | 'settings';

export function AdminPanel() {
  const { user, firebaseUser, isAdmin, signInWithGoogle, logout } = useAuth();
  const {
    services,
    products,
    brands,
    projects,
    testimonials,
    gallery,
    siteSettings,
    inquiries,
    cloudSeeded,
    seedCloudCatalog,
    saveProduct,
    deleteProduct,
    saveService,
    deleteService,
    saveBrand,
    deleteBrand,
    saveProject,
    deleteProject,
    saveGalleryPhoto,
    deleteGalleryPhoto,
    saveTestimonial,
    deleteTestimonial,
    saveSiteSettings,
    updateInquiryStatus,
    deleteInquiry,
    uploadImageFile,
  } = useCatalog();

  const [section, setSection] = useState<AdminSection>('overview');
  const [notice, setNotice] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Forms state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoItem | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettingsData>(siteSettings);

  React.useEffect(() => {
    setSettingsDraft(siteSettings);
  }, [siteSettings]);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onSuccess(url);
      showToast('Photo uploaded and previewed.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Protected Admin Gate
  if (!user || !isAdmin || !firebaseUser) {
    return (
      <div className="bg-[#060B16] text-slate-100 py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-[#0B1221] border border-white/10 p-8 chamfer-card-lg text-center">
            <ShieldCheck className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <div className="text-xs font-semibold tracking-[0.16em] text-red-400 mb-2">
              RESTRICTED OWNER ACCESS
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              Admin Panel Login
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Only the authorized owner account (<strong className="text-slate-200">kumawatshankarlal538@gmail.com</strong>) can sign in here to add/delete photos, edit business info, and manage products. Regular customer accounts are strictly blocked.
            </p>
            {user && !isAdmin && (
              <div className="mb-5 p-3 bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                Access Denied: Signed in as <strong>{user.email}</strong> (Customer role). Admin privileges are required.
              </div>
            )}
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors cursor-pointer mb-3"
            >
              Sign In as Admin (Google)
            </button>
            {user && (
              <button
                type="button"
                onClick={() => void logout()}
                className="w-full py-2.5 bg-[#0F172A] border border-white/15 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Sign Out Current Account
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const sidebarItems: Array<{ id: AdminSection; label: string; icon: React.ReactNode; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" />, count: products.length },
    { id: 'gallery', label: 'Photo Gallery', icon: <ImagePlus className="w-4 h-4" />, count: gallery.length },
    { id: 'services', label: 'Services', icon: <Wrench className="w-4 h-4" />, count: services.length },
    { id: 'brands', label: 'Brands', icon: <Award className="w-4 h-4" />, count: brands.length },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" />, count: projects.length },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote className="w-4 h-4" />, count: testimonials.length },
    { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="w-4 h-4" />, count: inquiries.length },
    { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#060B16] text-slate-100 min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0 bg-[#0A1120] border-b lg:border-b-0 lg:border-r border-white/10 p-4">
        <div className="px-3 py-2 mb-4 border-b border-white/10">
          <div className="text-xs font-semibold text-red-400">ADMIN CONSOLE</div>
          <div className="text-sm font-bold text-white truncate mt-0.5">{user.email}</div>
        </div>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                section === item.id
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {typeof item.count === 'number' && (
                <span className="font-mono tabular-nums opacity-80">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 lg:p-8 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-white/10">
          <div>
            <div className="text-xs text-slate-400">
              Admin Panel / <span className="text-white capitalize">{section}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-0.5 capitalize">
              {section === 'overview' ? 'Dashboard Overview' : `${section} Management`}
            </h1>
          </div>

          {!cloudSeeded && (
            <button
              type="button"
              onClick={() =>
                void seedCloudCatalog().then(() =>
                  showToast('Default VEERA CCTV catalog synced to Firestore.')
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Sync Seed Catalog to Cloud</span>
            </button>
          )}
        </div>

        {notice && (
          <div className="mb-6 p-3.5 bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0B1221] border border-white/10 p-5">
                <div className="text-xs text-slate-400">CCTV Products</div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums mt-1">
                  {products.length}
                </div>
              </div>
              <div className="bg-[#0B1221] border border-white/10 p-5">
                <div className="text-xs text-slate-400">Gallery Photos</div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums mt-1">
                  {gallery.length}
                </div>
              </div>
              <div className="bg-[#0B1221] border border-white/10 p-5">
                <div className="text-xs text-slate-400">Projects & Brands</div>
                <div className="text-3xl font-extrabold font-mono text-white tabular-nums mt-1">
                  {projects.length + brands.length}
                </div>
              </div>
              <div className="bg-[#0B1221] border border-white/10 p-5">
                <div className="text-xs text-slate-400">Client Inquiries</div>
                <div className="text-3xl font-extrabold font-mono text-red-400 tabular-nums mt-1">
                  {inquiries.length}
                </div>
              </div>
            </div>

            <div className="bg-[#0B1221] border border-white/10 p-6">
              <h2 className="text-base font-bold text-white mb-2">Live Website Synchronization</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Every product, service, brand, project, photo gallery item, testimonial, or site setting saved here writes directly to Firestore and updates the live VEERA CCTV storefront instantaneously.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSection('products')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Manage Products
                </button>
                <button
                  type="button"
                  onClick={() => setSection('gallery')}
                  className="px-4 py-2 bg-[#0F172A] border border-white/15 hover:border-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Upload Gallery Photos
                </button>
                <button
                  type="button"
                  onClick={() => setSection('inquiries')}
                  className="px-4 py-2 bg-[#0F172A] border border-white/15 hover:border-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  View Quote Inquiries
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGER */}
        {section === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setEditingProduct({
                    id: '',
                    name: '',
                    brand: brands[0]?.name || 'Hikvision',
                    category: 'Dome Camera',
                    resolution: '4K Ultra HD (8MP)',
                    price: 8500,
                    description: '',
                    specs: ['IP67 Weatherproof', 'Night Vision 30m'],
                    imageUrl: ASSET_IMAGES.domeKit,
                    inStock: true,
                    featured: false,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {editingProduct && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveProduct(editingProduct);
                  setEditingProduct(null);
                  showToast('Product saved to live catalog.');
                }}
                className="bg-[#0B1221] border border-red-500/40 p-6 space-y-4"
              >
                <h3 className="text-base font-bold text-white">
                  {editingProduct.id ? 'Edit Product' : 'Create Product'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.brand}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    >
                      {['Dome Camera', 'Bullet Camera', 'PTZ Camera', 'NVR / DVR', 'Complete Kit', 'Access Control'].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Resolution</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.resolution}
                      onChange={(e) => setEditingProduct({ ...editingProduct, resolution: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Price (INR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm font-mono text-white"
                    />
                  </div>
                  <div className="flex items-end gap-4 pb-2">
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      />
                      In Stock
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      />
                      Featured on Home
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <textarea
                    required
                    minLength={10}
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Key Specifications (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.specs.join(', ')}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specs: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>

                {/* Image Upload & Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
                  <div className="sm:col-span-3 aspect-[4/3] bg-[#04070E] border border-white/10 overflow-hidden">
                    <SafeImage
                      src={editingProduct.imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-9 space-y-2">
                    <label className="block text-xs text-slate-400">Image URL or Upload Replacement Photo</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.imageUrl}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                    />
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F172A] border border-white/15 hover:border-red-500 text-xs font-semibold text-white cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          void handleFileUpload(e, (url) =>
                            setEditingProduct({ ...editingProduct, imageUrl: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-[#0F172A] text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-[#0B1221] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060B16] border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Name & Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 w-20">
                        <div className="w-14 h-10 bg-[#04070E] overflow-hidden border border-white/10">
                          <SafeImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-slate-400">{p.brand} · {p.resolution}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.category}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-white">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 text-slate-300 hover:text-white mr-2 cursor-pointer"
                          title="Edit product"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void deleteProduct(p.id).then(() => showToast('Product deleted.'))
                          }
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PHOTO GALLERY MANAGER */}
        {section === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setEditingPhoto({
                    id: '',
                    title: '',
                    category: 'Installations',
                    caption: '',
                    imageUrl: ASSET_IMAGES.commercialSite,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                <ImagePlus className="w-4 h-4" />
                <span>Upload / Add Photo</span>
              </button>
            </div>

            {editingPhoto && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveGalleryPhoto(editingPhoto);
                  setEditingPhoto(null);
                  showToast('Gallery photo saved.');
                }}
                className="bg-[#0B1221] border border-red-500/40 p-6 space-y-4"
              >
                <h3 className="text-base font-bold text-white">
                  {editingPhoto.id ? 'Edit / Replace Photo' : 'Upload New Gallery Photo'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Photo Title</label>
                    <input
                      type="text"
                      required
                      value={editingPhoto.title}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Category</label>
                    <select
                      value={editingPhoto.category}
                      onChange={(e) =>
                        setEditingPhoto({ ...editingPhoto, category: e.target.value as GalleryCategory })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    >
                      {['Installations', 'Hardware', 'Control Rooms', 'Commercial', 'Residential'].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Caption</label>
                  <input
                    type="text"
                    required
                    value={editingPhoto.caption}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 aspect-[4/3] bg-[#04070E] border border-white/10 overflow-hidden">
                    <SafeImage
                      src={editingPhoto.imageUrl}
                      alt="Gallery preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-2">
                    <label className="block text-xs text-slate-400">Image Path / URL</label>
                    <input
                      type="text"
                      required
                      value={editingPhoto.imageUrl}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                    />
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F172A] border border-white/15 hover:border-red-500 text-xs font-semibold text-white cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Select Photo File to Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          void handleFileUpload(e, (url) =>
                            setEditingPhoto({ ...editingPhoto, imageUrl: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPhoto(null)}
                    className="px-4 py-2 bg-[#0F172A] text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((photo) => (
                <div key={photo.id} className="bg-[#0B1221] border border-white/10 overflow-hidden">
                  <div className="aspect-[4/3] bg-[#04070E]">
                    <SafeImage
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-red-400 font-semibold">{photo.category}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{photo.title}</div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{photo.caption}</p>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setEditingPhoto(photo)}
                        className="inline-flex items-center gap-1 text-xs text-slate-200 hover:text-white cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit / Replace
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void deleteGalleryPhoto(photo.id).then(() => showToast('Photo deleted.'))
                        }
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES MANAGER */}
        {section === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setEditingService({
                    id: '',
                    title: '',
                    description: '',
                    icon: 'Camera',
                    category: 'Deployment',
                    features: ['Certified installation', 'Warranty included'],
                    imageUrl: ASSET_IMAGES.aboutPole,
                    order: services.length + 1,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>

            {editingService && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveService(editingService);
                  setEditingService(null);
                  showToast('Service saved.');
                }}
                className="bg-[#0B1221] border border-red-500/40 p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={editingService.category}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Icon</label>
                    <select
                      value={editingService.icon}
                      onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    >
                      {['Camera', 'Network', 'Wrench', 'MonitorCheck', 'ShieldCheck', 'Headset'].map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <textarea
                    required
                    minLength={10}
                    rows={3}
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={editingService.features.join(', ')}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          features: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={editingService.imageUrl}
                        onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                      />
                      <label className="px-3 py-2 bg-[#0F172A] border border-white/15 text-xs text-white cursor-pointer">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            void handleFileUpload(e, (url) =>
                              setEditingService({ ...editingService, imageUrl: url })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-red-600 text-white text-xs font-semibold cursor-pointer">
                    Save Service
                  </button>
                  <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 bg-[#0F172A] text-slate-300 text-xs font-semibold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="bg-[#0B1221] border border-white/10 p-5 flex justify-between gap-4">
                  <div>
                    <div className="text-xs text-red-400 font-semibold">{s.category}</div>
                    <div className="text-base font-bold text-white">{s.title}</div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button type="button" onClick={() => setEditingService(s)} className="p-1.5 text-slate-300 hover:text-white cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteService(s.id).then(() => showToast('Service deleted.'))}
                      className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRANDS MANAGER */}
        {section === 'brands' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setEditingBrand({
                    id: '',
                    name: '',
                    tagline: '',
                    description: '',
                    imageUrl: ASSET_IMAGES.ptzBullet,
                    country: 'Authorized Partner',
                    warrantyYears: 3,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Brand
              </button>
            </div>

            {editingBrand && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveBrand(editingBrand);
                  setEditingBrand(null);
                  showToast('Brand saved.');
                }}
                className="bg-[#0B1221] border border-red-500/40 p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Brand Name</label>
                    <input
                      type="text"
                      required
                      value={editingBrand.name}
                      onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Origin / Tier</label>
                    <input
                      type="text"
                      required
                      value={editingBrand.country}
                      onChange={(e) => setEditingBrand({ ...editingBrand, country: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Warranty (Years)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={editingBrand.warrantyYears}
                      onChange={(e) =>
                        setEditingBrand({ ...editingBrand, warrantyYears: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm font-mono text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={editingBrand.tagline}
                    onChange={(e) => setEditingBrand({ ...editingBrand, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <textarea
                    required
                    minLength={5}
                    rows={2}
                    value={editingBrand.description}
                    onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={editingBrand.imageUrl}
                    onChange={(e) => setEditingBrand({ ...editingBrand, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                  />
                  <label className="px-3 py-2 bg-[#0F172A] border border-white/15 text-xs text-white cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        void handleFileUpload(e, (url) =>
                          setEditingBrand({ ...editingBrand, imageUrl: url })
                        )
                      }
                    />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-red-600 text-white text-xs font-semibold cursor-pointer">
                    Save Brand
                  </button>
                  <button type="button" onClick={() => setEditingBrand(null)} className="px-4 py-2 bg-[#0F172A] text-slate-300 text-xs font-semibold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brands.map((b) => (
                <div key={b.id} className="bg-[#0B1221] border border-white/10 p-4 flex flex-col">
                  <div className="aspect-[4/3] bg-[#04070E] mb-3 overflow-hidden">
                    <SafeImage src={b.imageUrl} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-bold text-white">{b.name}</div>
                  <div className="text-xs text-slate-400 mb-3">{b.tagline}</div>
                  <div className="mt-auto flex items-center gap-3 pt-3 border-t border-white/10">
                    <button type="button" onClick={() => setEditingBrand(b)} className="text-xs text-slate-200 hover:text-white cursor-pointer">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteBrand(b.id).then(() => showToast('Brand deleted.'))}
                      className="text-xs text-red-400 hover:text-red-300 ml-auto cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS MANAGER */}
        {section === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setEditingProject({
                    id: '',
                    title: '',
                    industry: 'Commercial' as unknown as ProjectIndustry,
                    location: '',
                    camerasInstalled: 24,
                    completionYear: '2026',
                    summary: '',
                    outcomeMetric: '',
                    imageUrl: ASSET_IMAGES.commercialSite,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            {editingProject && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveProject({
                    ...editingProject,
                    industry: (['Hotel', 'Property', 'Distribution', 'Schools', 'Industrial', 'Retail'].includes(
                      editingProject.industry
                    )
                      ? editingProject.industry
                      : 'Industrial') as ProjectIndustry,
                  });
                  setEditingProject(null);
                  showToast('Project case study saved.');
                }}
                className="bg-[#0B1221] border border-red-500/40 p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Industry</label>
                    <select
                      value={editingProject.industry}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, industry: e.target.value as ProjectIndustry })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    >
                      {['Hotel', 'Property', 'Distribution', 'Schools', 'Industrial', 'Retail'].map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Cameras Installed</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={editingProject.camerasInstalled}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, camerasInstalled: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm font-mono text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Completion Year</label>
                    <input
                      type="text"
                      required
                      value={editingProject.completionYear}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, completionYear: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Outcome Metric</label>
                    <input
                      type="text"
                      required
                      value={editingProject.outcomeMetric}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, outcomeMetric: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Summary</label>
                  <textarea
                    required
                    minLength={10}
                    rows={3}
                    value={editingProject.summary}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={editingProject.imageUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                  />
                  <label className="px-3 py-2 bg-[#0F172A] border border-white/15 text-xs text-white cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        void handleFileUpload(e, (url) =>
                          setEditingProject({ ...editingProject, imageUrl: url })
                        )
                      }
                    />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-red-600 text-white text-xs font-semibold cursor-pointer">
                    Save Project
                  </button>
                  <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 bg-[#0F172A] text-slate-300 text-xs font-semibold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-[#0B1221] border border-white/10 p-5 flex justify-between gap-4">
                  <div>
                    <div className="text-xs text-red-400 font-semibold">{p.industry} · {p.location}</div>
                    <div className="text-base font-bold text-white">{p.title}</div>
                    <div className="text-xs font-mono text-slate-400 mt-1 tabular-nums">
                      {p.camerasInstalled} Cameras · {p.completionYear}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button type="button" onClick={() => setEditingProject(p)} className="p-1.5 text-slate-300 hover:text-white cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProject(p.id).then(() => showToast('Project deleted.'))}
                      className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS MANAGER */}
        {section === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setEditingTestimonial({
                    id: '',
                    clientName: '',
                    role: '',
                    company: '',
                    quote: '',
                    rating: 5,
                    projectType: 'Commercial CCTV',
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>

            {editingTestimonial && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await saveTestimonial(editingTestimonial);
                  setEditingTestimonial(null);
                  showToast('Testimonial saved.');
                }}
                className="bg-[#0B1221] border border-red-500/40 p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Client Name"
                    value={editingTestimonial.clientName}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })
                    }
                    className="px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Role"
                    value={editingTestimonial.role}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                    }
                    className="px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Company"
                    value={editingTestimonial.company}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, company: e.target.value })
                    }
                    className="px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Project Type"
                    value={editingTestimonial.projectType}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, projectType: e.target.value })
                    }
                    className="px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                  />
                </div>
                <textarea
                  required
                  minLength={10}
                  rows={3}
                  placeholder="Client review quote..."
                  value={editingTestimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                />
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-red-600 text-white text-xs font-semibold cursor-pointer">
                    Save Testimonial
                  </button>
                  <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 bg-[#0F172A] text-slate-300 text-xs font-semibold cursor-pointer">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#0B1221] border border-white/10 p-5 flex justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-white">
                      {t.clientName} · <span className="text-slate-400 font-normal">{t.company}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">“{t.quote}”</p>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <button type="button" onClick={() => setEditingTestimonial(t)} className="p-1.5 text-slate-300 hover:text-white cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteTestimonial(t.id).then(() => showToast('Testimonial deleted.'))}
                      className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INQUIRIES INBOX */}
        {section === 'inquiries' && (
          <div className="bg-[#0B1221] border border-white/10 overflow-x-auto">
            {inquiries.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                No customer inquiries submitted yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060B16] border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Requirement</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {inquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{inq.name}</div>
                        <div className="text-slate-400 font-mono">{inq.phone} · {inq.email}</div>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className="text-red-400 font-semibold">{inq.serviceType} ({inq.propertyType})</div>
                        <div className="text-slate-300 mt-0.5">{inq.message}</div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            void updateInquiryStatus(
                              inq.id,
                              e.target.value as InquiryStatus,
                              inq.source
                            ).then(() => showToast('Inquiry status updated.'))
                          }
                          className="px-2.5 py-1.5 bg-[#060B16] border border-white/15 text-xs text-white"
                        >
                          {['New', 'In Review', 'Quoted', 'Closed'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            void deleteInquiry(inq.id, inq.source).then(() => showToast('Inquiry removed.'))
                          }
                          className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* SITE SETTINGS */}
        {section === 'settings' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await saveSiteSettings(settingsDraft);
              showToast('Site settings updated on live storefront.');
            }}
            className="bg-[#0B1221] border border-white/10 p-6 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={settingsDraft.companyName}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Years of Experience</label>
                <input
                  type="number"
                  required
                  value={settingsDraft.experienceYears}
                  onChange={(e) =>
                    setSettingsDraft({ ...settingsDraft, experienceYears: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={settingsDraft.phone}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">WhatsApp Number (digits)</label>
                <input
                  type="text"
                  required
                  value={settingsDraft.whatsapp}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={settingsDraft.email}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Office Address</label>
                <input
                  type="text"
                  required
                  value={settingsDraft.address}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Hero Promo Kicker</label>
              <input
                type="text"
                required
                value={settingsDraft.promoBanner}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, promoBanner: e.target.value })}
                className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Hero Headline</label>
              <input
                type="text"
                required
                value={settingsDraft.heroHeadline}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Hero Subheadline</label>
              <textarea
                rows={2}
                required
                value={settingsDraft.heroSubheadline}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, heroSubheadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">About Headline</label>
              <input
                type="text"
                required
                value={settingsDraft.aboutHeadline}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">About Description</label>
              <textarea
                rows={3}
                required
                value={settingsDraft.aboutDescription}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutDescription: e.target.value })}
                className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-sm text-white"
              />
            </div>

            {/* Hero & About Page Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Home Hero Banner Photo
                </label>
                <div className="aspect-[16/9] bg-[#04070E] border border-white/10 overflow-hidden">
                  <SafeImage
                    src={settingsDraft.heroImageUrl || ASSET_IMAGES.heroControlRoom}
                    alt="Hero banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={settingsDraft.heroImageUrl || ASSET_IMAGES.heroControlRoom}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, heroImageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                />
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F172A] border border-white/15 hover:border-red-500 text-xs font-semibold text-white cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload New Hero Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      void handleFileUpload(e, (url) =>
                        setSettingsDraft({ ...settingsDraft, heroImageUrl: url })
                      )
                    }
                  />
                </label>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-slate-300">
                  About Us Showcase Photo
                </label>
                <div className="aspect-[16/9] bg-[#04070E] border border-white/10 overflow-hidden">
                  <SafeImage
                    src={settingsDraft.aboutImageUrl || ASSET_IMAGES.aboutPole}
                    alt="About section preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={settingsDraft.aboutImageUrl || ASSET_IMAGES.aboutPole}
                  onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutImageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060B16] border border-white/15 text-xs font-mono text-white"
                />
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0F172A] border border-white/15 hover:border-red-500 text-xs font-semibold text-white cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload New About Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      void handleFileUpload(e, (url) =>
                        setSettingsDraft({ ...settingsDraft, aboutImageUrl: url })
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Publish Site Settings</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
