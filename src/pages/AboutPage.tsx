import React from 'react';
import { Award, CheckCircle2, Shield, Users } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCatalog } from '../context/CatalogContext';
import { ASSET_IMAGES } from '../data/seedData';
import type { AppRoute } from '../types/cctv';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { siteSettings, projects, brands } = useCatalog();

  const totalCameras = projects.reduce((acc, p) => acc + (Number(p.camerasInstalled) || 0), 0);

  const workflowSteps = [
    {
      step: '01. Site Blind-Spot Audit',
      detail: 'Our engineers walk the perimeter with laser lux meters and floorplans to eliminate shadow zones and glare.',
    },
    {
      step: '02. Optical & Storage Sizing',
      detail: 'We calculate exact focal lengths (2.8mm–12mm), PoE wattage budgets, and 30-to-90-day RAID retention.',
    },
    {
      step: '03. Armored Conduit Installation',
      detail: 'Clean, weatherproof Cat6/fiber termination with surge arrestors and rack-mounted UPS backup.',
    },
    {
      step: '04. Commissioning & AMC Care',
      detail: 'Mobile/VMS app setup, staff training, and proactive quarterly preventive maintenance audits.',
    },
  ];

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="w-10 h-0.5 bg-red-600 mb-3" />
            <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">ABOUT US</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance mb-5">
              {siteSettings.aboutHeadline}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed mb-6">
              {siteSettings.aboutDescription}
            </p>
            <div className="space-y-3 text-sm text-slate-300 mb-8">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>ISO-aligned installation standards and structured armored cabling</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Direct authorized partner for {brands.length} Tier-1 surveillance brands</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>4-hour SLA emergency hardware support for AMC enterprise clients</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Book Free Consultation
              </button>
              <button
                type="button"
                onClick={() => onNavigate('testimonials')}
                className="px-6 py-3 bg-[#0F172A] border border-white/15 hover:border-red-500 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Read Client Reviews
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[360px] bg-[#0B1221] border border-white/10 overflow-hidden chamfer-card-lg">
              <SafeImage
                src={siteSettings.aboutImageUrl || ASSET_IMAGES.aboutPole}
                alt="VEERA CCTV engineered multi-camera mast"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Quantitative Proof Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0B1221] border border-white/10 p-6 chamfer-corner">
            <Award className="w-6 h-6 text-red-500 mb-3" />
            <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {siteSettings.experienceYears}+ Years
            </div>
            <p className="text-sm text-slate-400 mt-1">Surveillance engineering & commissioning track record</p>
          </div>
          <div className="bg-[#0B1221] border border-white/10 p-6 chamfer-corner">
            <Shield className="w-6 h-6 text-red-500 mb-3" />
            <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {totalCameras.toLocaleString()}+ Cameras
            </div>
            <p className="text-sm text-slate-400 mt-1">Active IP & PTZ endpoints across flagship case studies</p>
          </div>
          <div className="bg-[#0B1221] border border-white/10 p-6 chamfer-corner">
            <Users className="w-6 h-6 text-red-500 mb-3" />
            <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
              24/7 Support
            </div>
            <p className="text-sm text-slate-400 mt-1">Dedicated field engineers & remote health diagnostics</p>
          </div>
        </div>

        {/* Engineering Workflow */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Our 4-Stage Deployment Standard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item) => (
              <div key={item.step} className="bg-[#0F172A] border border-white/10 p-6">
                <h3 className="text-base font-bold text-white mb-2">{item.step}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
