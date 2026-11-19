import React, { useMemo, useState } from 'react';
import { CheckCircle2, Search, X } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute, ProductCategory, ProductItem } from '../types/cctv';

interface ProductsPageProps {
  initialBrandFilter?: string;
  onNavigate: (route: AppRoute, options?: { service?: string }) => void;
}

const CATEGORIES: Array<'All' | ProductCategory> = [
  'All',
  'Dome Camera',
  'Bullet Camera',
  'PTZ Camera',
  'NVR / DVR',
  'Complete Kit',
  'Access Control',
];

export function ProductsPage({ initialBrandFilter = 'All', onNavigate }: ProductsPageProps) {
  const { products, brands } = useCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrandFilter || 'All');
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);

  const brandNames = useMemo(() => {
    const names = new Set<string>(['All']);
    brands.forEach((b) => names.add(b.name));
    products.forEach((p) => names.add(p.brand));
    return Array.from(names);
  }, [brands, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.resolution.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesBrand && matchesQuery;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="w-10 h-0.5 bg-red-600 mb-3" />
            <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
              HARDWARE CATALOG
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CCTV Cameras, NVRs & Security Kits
            </h1>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cameras, brands, 4K..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Category & Brand Filters */}
        <div className="bg-[#0B1221] border border-white/10 p-4 mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-[#060B16] text-slate-300 border border-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
            <span className="text-xs text-slate-400 mr-1">Brand:</span>
            {brandNames.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-white text-[#060B16] font-semibold'
                    : 'bg-[#060B16] text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#0B1221] border border-white/10 p-12 text-center">
            <p className="text-base font-semibold text-white mb-2">No matching CCTV hardware found</p>
            <p className="text-sm text-slate-400 mb-5">
              Try clearing your active category or brand filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#0B1221] border border-white/10 flex flex-col chamfer-corner overflow-hidden"
              >
                <div className="aspect-[4/3] bg-[#04070E] overflow-hidden">
                  <SafeImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                    <span>
                      <strong className="text-red-400">{product.brand}</strong> · {product.category}
                    </span>
                    <span className={product.inStock ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {product.inStock ? 'In Stock' : 'Made to Order'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">{product.name}</h2>
                  <p className="text-xs font-mono text-slate-400 mb-3">{product.resolution}</p>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="text-lg font-bold font-mono text-white tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveProduct(product)}
                        className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#182442] border border-white/15 text-xs font-semibold text-white cursor-pointer"
                      >
                        Specs
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate('contact', { service: `Product Quote: ${product.name}` })
                        }
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold text-white cursor-pointer"
                      >
                        Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Specification Modal */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-2xl w-full bg-[#0B1221] border border-white/15 overflow-hidden chamfer-card-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="text-xs text-slate-400">
                {activeProduct.brand} · {activeProduct.category} · {activeProduct.resolution}
              </div>
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                aria-label="Close specifications"
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[4/3] bg-[#04070E] border border-white/10 overflow-hidden">
                <SafeImage
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{activeProduct.name}</h3>
                <div className="text-2xl font-bold font-mono text-red-400 tabular-nums mb-3">
                  ₹{activeProduct.price.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {activeProduct.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {activeProduct.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    const name = activeProduct.name;
                    setActiveProduct(null);
                    onNavigate('contact', { service: `Product Quote: ${name}` });
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wide cursor-pointer"
                >
                  Request Installation Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
