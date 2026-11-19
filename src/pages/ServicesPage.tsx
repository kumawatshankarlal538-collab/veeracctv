import React from 'react';
import {
  Camera,
  Check,
  Headset,
  MonitorCheck,
  Network,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute } from '../types/cctv';

interface ServicesPageProps {
  onNavigate: (route: AppRoute, options?: { service?: string }) => void;
}

function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case 'Network':
      return <Network className="w-6 h-6 text-red-500" />;
    case 'Wrench':
      return <Wrench className="w-6 h-6 text-red-500" />;
    case 'MonitorCheck':
      return <MonitorCheck className="w-6 h-6 text-red-500" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-6 h-6 text-red-500" />;
    case 'Headset':
      return <Headset className="w-6 h-6 text-red-500" />;
    default:
      return <Camera className="w-6 h-6 text-red-500" />;
  }
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { services } = useCatalog();

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="w-10 h-0.5 bg-red-600 mb-3" />
          <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
            END-TO-END SECURITY SERVICES
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            CCTV Installation, Design & Maintenance
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Every VEERA CCTV deployment is planned by certified network engineers—covering optical angle design, PoE switch topology, NVR storage redundancy, and long-term AMC support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="bg-[#0B1221] border border-white/10 flex flex-col chamfer-corner overflow-hidden"
            >
              <div className="aspect-[16/9] bg-[#04070E] overflow-hidden">
                <SafeImage
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="inline-flex items-center gap-2.5">
                    <ServiceIcon name={service.icon} />
                    <span className="text-xs font-mono text-slate-400">
                      {String(idx + 1).padStart(2, '0')} · {service.category}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{service.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">{service.description}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onNavigate('contact', { service: service.title })}
                  className="w-full py-2.5 bg-[#0F172A] hover:bg-red-600 border border-white/15 hover:border-red-600 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Request {service.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
