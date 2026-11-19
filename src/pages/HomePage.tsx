import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Headset,
  MonitorCheck,
  Network,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCatalog } from '../context/CatalogContext';
import { ASSET_IMAGES } from '../data/seedData';
import type { AppRoute, ProjectIndustry } from '../types/cctv';

interface HomePageProps {
  onNavigate: (route: AppRoute, options?: { brand?: string; industry?: ProjectIndustry; service?: string }) => void;
}

function renderServiceIcon(iconName: string) {
  switch (iconName) {
    case 'Network':
      return <Network className="w-7 h-7 text-red-500" />;
    case 'Wrench':
      return <Wrench className="w-7 h-7 text-red-500" />;
    case 'MonitorCheck':
      return <MonitorCheck className="w-7 h-7 text-red-500" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-7 h-7 text-red-500" />;
    case 'Headset':
      return <Headset className="w-7 h-7 text-red-500" />;
    default:
      return <Camera className="w-7 h-7 text-red-500" />;
  }
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { services, brands, projects, products, testimonials, gallery, siteSettings } = useCatalog();

  const featuredIndustries: Array<{ industry: ProjectIndustry; imageUrl: string; subtitle: string }> = [
    { industry: 'Hotel', imageUrl: ASSET_IMAGES.heroControlRoom, subtitle: 'Hospitality & Resorts' },
    { industry: 'Property', imageUrl: ASSET_IMAGES.aboutPole, subtitle: 'Gated Villas & Estates' },
    { industry: 'Distribution', imageUrl: ASSET_IMAGES.commercialSite, subtitle: 'Warehouses & Hubs' },
    { industry: 'Schools', imageUrl: ASSET_IMAGES.ptzBullet, subtitle: 'Campuses & Institutes' },
  ];

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <div className="bg-[#060B16] text-slate-100">
      {/* 1. Hero Section inspired by UCAM Command Center */}
      <section className="relative min-h-[600px] flex flex-col justify-between overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <SafeImage
            src={siteSettings.heroImageUrl || ASSET_IMAGES.heroControlRoom}
            alt="VEERA CCTV 24/7 Surveillance Command Center"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#04070E]/85 via-[#060B16]/75 to-[#060B16]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-14 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-red-500 mb-4">
              {siteSettings.promoBanner}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.1] text-balance mb-5">
              {siteSettings.heroHeadline}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              {siteSettings.heroSubheadline}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
              >
                Get a Free Quote
              </button>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-7 py-3.5 bg-[#0F172A]/90 hover:bg-[#16213B] border border-white/15 text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
              >
                Browse CCTV Catalog
              </button>
            </div>
          </motion.div>

          {/* 6-Icon Service Strip directly inside Hero bottom (matching UCAM layout) */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-t border-white/10 pt-8">
            {services.slice(0, 6).map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => onNavigate('services', { service: srv.title })}
                className="group flex flex-col items-center text-center p-3 hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <div className="mb-2.5 transition-transform duration-150 group-hover:-translate-y-0.5">
                  {renderServiceIcon(srv.icon)}
                </div>
                <span className="text-xs font-semibold tracking-wide text-slate-200 group-hover:text-white">
                  {srv.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. About Us & Experience Split (matching UCAM multi-camera pole section) */}
      <section className="py-20 bg-[#0A1120] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="w-10 h-0.5 bg-red-600 mb-4" />
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 mb-2">
                ABOUT VEERA CCTV
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance mb-5">
                {siteSettings.aboutHeadline}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start mb-8">
                <p className="sm:col-span-7 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {siteSettings.aboutDescription}
                </p>
                <div className="sm:col-span-5 bg-[#060B16] border border-white/10 p-6 text-center chamfer-corner">
                  <div className="text-4xl font-extrabold font-mono text-white tabular-nums">
                    {siteSettings.experienceYears}+
                  </div>
                  <div className="text-xs text-slate-400 mt-1.5 font-medium">
                    Years of Field Experience
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                >
                  Schedule Site Survey
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <span>Read Our Engineering Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] bg-[#060B16] border border-white/10 overflow-hidden chamfer-card-lg">
                <SafeImage
                  src={siteSettings.aboutImageUrl || ASSET_IMAGES.aboutPole}
                  alt="Multi-camera galvanized perimeter surveillance mast"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Industry Served (4-card Crimson Accent Showcase matching UCAM) */}
      <section className="py-20 bg-[#04070E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-10 h-0.5 bg-red-600 mx-auto mb-3" />
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 mb-2">
              COMPLETE SECTOR SOLUTIONS
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              INDUSTRIES WE PROTECT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredIndustries.map((item) => (
              <button
                key={item.industry}
                type="button"
                onClick={() => onNavigate('projects', { industry: item.industry })}
                className="group text-left bg-[#0B1221] border border-white/10 overflow-hidden chamfer-corner transition-transform duration-150 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SafeImage
                    src={item.imageUrl}
                    alt={`${item.industry} CCTV surveillance deployment`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-700/80 via-red-900/20 to-transparent" />
                </div>
                <div className="px-5 py-4 bg-[#0B1221]">
                  <h3 className="text-base font-bold text-white tracking-wide">{item.industry}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CCTV Specialist Statement Band */}
      <section className="py-16 bg-[#0F172A] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-10 h-0.5 bg-red-600 mx-auto mb-4" />
          <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-3">
            CERTIFIED SURVEILLANCE SPECIALISTS
          </p>
          <h2 className="text-xl sm:text-3xl font-bold text-white leading-snug text-balance mb-7">
            AT VEERA CCTV, WE DESIGN AND INSTALL COMMERCIAL-GRADE SURVEILLANCE INFRASTRUCTURE BUILT TO KEEP YOUR PROPERTY SECURE.
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 border border-white/25 hover:border-red-500 hover:bg-red-600 text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            Get a Free Quote
          </button>
        </div>
      </section>

      {/* 5. Brand Choice 6-Card Dark Navy Grid (matching UCAM) */}
      <section className="py-20 bg-[#060B16] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="w-10 h-0.5 bg-red-600 mb-3" />
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 mb-1.5">
                AUTHORIZED HARDWARE PARTNERS
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                BRAND CHOICE
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('brands')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <span>View All Authorized Brands</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.slice(0, 6).map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => onNavigate('products', { brand: brand.name })}
                className="group text-left bg-[#0B1221] border border-white/10 hover:border-red-600/50 p-5 chamfer-card-lg transition-colors cursor-pointer"
              >
                <div className="aspect-[4/3] bg-[#04070E] overflow-hidden mb-5 border border-white/5">
                  <SafeImage
                    src={brand.imageUrl}
                    alt={`${brand.name} CCTV hardware`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{brand.name}</h3>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {brand.warrantyYears}Y Warranty
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{brand.tagline}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured CCTV Products & Live Gallery Preview */}
      <section className="py-20 bg-[#0A1120] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="w-10 h-0.5 bg-red-600 mb-3" />
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 mb-1.5">
                READY-TO-DEPLOY HARDWARE
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                FEATURED CCTV SYSTEMS
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#0F172A] border border-white/10 flex flex-col chamfer-corner overflow-hidden"
              >
                <div className="aspect-[4/3] bg-[#04070E] overflow-hidden">
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="text-red-400 font-semibold">{product.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.resolution}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-5 flex-1">
                    {product.description}
                  </p>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="text-lg font-bold font-mono text-white tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('products')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Specs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Photo Gallery & Projects Strip */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Recent Field Deployments & Gallery</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {projects.length} documented case studies · {gallery.length} verified installation photos
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-5 py-2.5 bg-[#060B16] border border-white/15 hover:border-red-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Open Projects & Photo Gallery
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.slice(0, 4).map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#04070E] cursor-pointer text-left"
                >
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
                    <p className="text-[11px] text-slate-300">{photo.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Our Happy Customers (Claim-to-Proof Adjacent Testimonials) */}
      <section className="py-20 bg-[#04070E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="w-10 h-0.5 bg-red-600 mb-3" />
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 mb-1.5">
                VERIFIED CLIENT OUTCOMES
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                OUR HAPPY CUSTOMERS
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('testimonials')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <span>All Client Reviews</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map((item) => (
              <div key={item.id} className="bg-[#0B1221] border border-white/10 p-7 chamfer-corner">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-red-500 text-red-500" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                  “{item.quote}”
                </p>
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-white">{item.clientName}</div>
                    <div className="text-slate-400">
                      {item.role} · {item.company}
                    </div>
                  </div>
                  <span className="text-slate-400 font-medium">{item.projectType}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#0F172A] border border-white/10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1.5">
                Ready to secure your premises with VEERA CCTV?
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-500" /> Free Blind-Spot Audit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-500" /> Certified Technicians
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-500" /> Up to 5-Year Brand Warranty
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              Request Free Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
