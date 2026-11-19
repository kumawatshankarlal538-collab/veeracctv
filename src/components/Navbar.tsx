import React, { useState } from 'react';
import { Menu, Shield, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import type { AppRoute } from '../types/cctv';

interface NavbarProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export function Navbar({ activeRoute, onNavigate }: NavbarProps) {
  const { siteSettings } = useCatalog();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ label: string; route: AppRoute }> = [
    { label: 'Services', route: 'services' },
    { label: 'Products', route: 'products' },
    { label: 'Projects', route: 'projects' },
    { label: user ? 'Account' : 'Login', route: 'portal' },
    { label: 'Admin', route: 'admin' },
  ];

  const mobileLinks: Array<{ label: string; route: AppRoute }> = [
    { label: 'Home', route: 'home' },
    { label: 'About Us', route: 'about' },
    { label: 'Services', route: 'services' },
    { label: 'CCTV Products', route: 'products' },
    { label: 'Brands', route: 'brands' },
    { label: 'Projects & Gallery', route: 'projects' },
    { label: 'Testimonials', route: 'testimonials' },
    { label: 'Contact', route: 'contact' },
    { label: user ? 'My Account' : 'Client Login / Register', route: 'portal' },
    { label: 'Admin Panel', route: 'admin' },
  ];

  const handleNav = (route: AppRoute) => {
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060B16]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Shield className="w-5 h-5 text-red-600 shrink-0" />
          <span>{siteSettings.companyName || 'VEERA CCTV'}</span>
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route + item.label}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                  isActive
                    ? 'text-white border-red-600'
                    : 'text-slate-300 border-transparent hover:text-white hover:border-red-600/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary CTA + Mobile Drawer toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Get Free Quote
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-white/15 bg-[#0F172A] text-slate-200 hover:text-white cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A1120] border-t border-white/10 px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {mobileLinks.map((link) => (
              <button
                key={link.route}
                type="button"
                onClick={() => handleNav(link.route)}
                className={`text-left px-3 py-2.5 text-sm font-medium border transition-colors cursor-pointer ${
                  activeRoute === link.route
                    ? 'bg-red-600/15 border-red-600 text-white'
                    : 'bg-[#0F172A] border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
