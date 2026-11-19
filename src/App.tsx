/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPanel } from './pages/AdminPanel';
import { BrandsPage } from './pages/BrandsPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { PortalPage } from './pages/PortalPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ServicesPage } from './pages/ServicesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import type { AppRoute, ProjectIndustry } from './types/cctv';

const VALID_ROUTES: AppRoute[] = [
  'home',
  'about',
  'services',
  'products',
  'brands',
  'projects',
  'testimonials',
  'contact',
  'portal',
  'admin',
];

function getInitialRoute(): AppRoute {
  const hash = window.location.hash.replace('#', '') as AppRoute;
  return VALID_ROUTES.includes(hash) ? hash : 'home';
}

function VeeraCctvShell() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(getInitialRoute);
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [industryFilter, setIndustryFilter] = useState<'All' | ProjectIndustry>('All');
  const [prefilledService, setPrefilledService] = useState<string>('');

  useEffect(() => {
    const onHashChange = () => {
      setActiveRoute(getInitialRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (
    route: AppRoute,
    options?: { brand?: string; industry?: ProjectIndustry; service?: string }
  ) => {
    setBrandFilter(options?.brand || 'All');
    setIndustryFilter(options?.industry || 'All');
    setPrefilledService(options?.service || '');
    setActiveRoute(route);
    window.location.hash = route === 'home' ? '' : `#${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060B16] text-slate-100">
      <Navbar activeRoute={activeRoute} onNavigate={(r) => handleNavigate(r)} />

      <main className="flex-1">
        {activeRoute === 'home' && <HomePage onNavigate={handleNavigate} />}
        {activeRoute === 'about' && <AboutPage onNavigate={(r) => handleNavigate(r)} />}
        {activeRoute === 'services' && <ServicesPage onNavigate={handleNavigate} />}
        {activeRoute === 'products' && (
          <ProductsPage
            key={brandFilter}
            initialBrandFilter={brandFilter}
            onNavigate={handleNavigate}
          />
        )}
        {activeRoute === 'brands' && <BrandsPage onNavigate={handleNavigate} />}
        {activeRoute === 'projects' && (
          <ProjectsPage key={industryFilter} initialIndustryFilter={industryFilter} />
        )}
        {activeRoute === 'testimonials' && <TestimonialsPage onNavigate={(r) => handleNavigate(r)} />}
        {activeRoute === 'contact' && <ContactPage prefilledService={prefilledService} />}
        {activeRoute === 'portal' && <PortalPage onNavigate={(r) => handleNavigate(r)} />}
        {activeRoute === 'admin' && <AdminPanel />}
      </main>

      {activeRoute !== 'admin' && <Footer onNavigate={(r) => handleNavigate(r)} />}
      {activeRoute !== 'admin' && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CatalogProvider>
          <VeeraCctvShell />
        </CatalogProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
