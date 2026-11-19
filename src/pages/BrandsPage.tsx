import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute } from '../types/cctv';

interface BrandsPageProps {
  onNavigate: (route: AppRoute, options?: { brand?: string }) => void;
}

export function BrandsPage({ onNavigate }: BrandsPageProps) {
  const { brands } = useCatalog();

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="w-10 h-0.5 bg-red-600 mb-3" />
          <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
            AUTHORIZED DISTRIBUTORSHIPS
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Global CCTV Brands We Engineer & Support
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            We source genuine serial-verified cameras, NVRs, and access terminals directly from Tier-1 manufacturers with full OEM warranty coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-[#0B1221] border border-white/10 p-6 flex flex-col chamfer-card-lg"
            >
              <div className="aspect-[4/3] bg-[#04070E] border border-white/10 overflow-hidden mb-5">
                <SafeImage
                  src={brand.imageUrl}
                  alt={`${brand.name} surveillance systems`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-xl font-bold text-white">{brand.name}</h2>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-red-400 tabular-nums">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {brand.warrantyYears}Y OEM Warranty
                </span>
              </div>

              <p className="text-xs font-medium text-slate-400 mb-3">
                {brand.country} · {brand.tagline}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-1">
                {brand.description}
              </p>

              <button
                type="button"
                onClick={() => onNavigate('products', { brand: brand.name })}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#0F172A] hover:bg-red-600 border border-white/15 hover:border-red-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>View {brand.name} Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
