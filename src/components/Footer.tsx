import React from 'react';
import { Mail, MapPin, Phone, Shield } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute } from '../types/cctv';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { siteSettings } = useCatalog();

  const companyLinks: Array<{ label: string; route: AppRoute }> = [
    { label: 'Home', route: 'home' },
    { label: 'About Us', route: 'about' },
    { label: 'Services', route: 'services' },
    { label: 'CCTV Products', route: 'products' },
    { label: 'Authorized Brands', route: 'brands' },
  ];

  const resourceLinks: Array<{ label: string; route: AppRoute }> = [
    { label: 'Projects & Gallery', route: 'projects' },
    { label: 'Testimonials', route: 'testimonials' },
    { label: 'Contact & Free Quote', route: 'contact' },
    { label: 'Client Account Portal', route: 'portal' },
    { label: 'Admin Dashboard', route: 'admin' },
  ];

  return (
    <footer className="bg-[#04070E] border-t border-white/10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white mb-4 cursor-pointer"
            >
              <Shield className="w-5 h-5 text-red-600" />
              <span>{siteSettings.companyName || 'VEERA CCTV'}</span>
            </button>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Certified CCTV installation, 4K IP surveillance engineering, biometric access control, and 24/7 AMC support for homes and enterprises.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Solutions & Catalog</h3>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.route)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Portals & Proof</h3>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.route)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Contact Office</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span className="tabular-nums">{siteSettings.phone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>{siteSettings.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>{siteSettings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteSettings.companyName || 'VEERA CCTV'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Request Site Survey
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Administrator Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
