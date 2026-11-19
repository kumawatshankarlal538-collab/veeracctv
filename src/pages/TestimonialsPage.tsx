import React from 'react';
import { Star } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute } from '../types/cctv';

interface TestimonialsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function TestimonialsPage({ onNavigate }: TestimonialsPageProps) {
  const { testimonials } = useCatalog();

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '5.0';

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="w-10 h-0.5 bg-red-600 mb-3" />
            <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
              CLIENT ACCREDITATION & REVIEWS
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Happy Customers
            </h1>
          </div>

          <div className="bg-[#0B1221] border border-white/10 px-6 py-4 flex items-center gap-4">
            <div className="text-3xl font-extrabold font-mono text-white tabular-nums">{avgRating}</div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                ))}
              </div>
              <div className="text-xs text-slate-400 mt-1 tabular-nums">
                Across {testimonials.length} verified client deployments
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-[#0B1221] border border-white/10 p-7 chamfer-corner flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-red-500 text-red-500" />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-400">{t.projectType}</span>
              </div>
              <p className="text-base text-slate-200 leading-relaxed mb-6 flex-1">“{t.quote}”</p>
              <div className="pt-4 border-t border-white/10">
                <div className="text-sm font-bold text-white">{t.clientName}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {t.role} · {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0F172A] border border-white/10 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Need a Custom Surveillance Proposal for Your Site?
          </h2>
          <p className="text-sm text-slate-300 mb-6">
            Schedule an on-site camera layout survey with our engineering team.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Request Site Survey
          </button>
        </div>
      </div>
    </div>
  );
}
