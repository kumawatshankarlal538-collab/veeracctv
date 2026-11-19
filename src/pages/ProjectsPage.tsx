import React, { useMemo, useState } from 'react';
import { Camera, MapPin, Maximize2, X } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCatalog } from '../context/CatalogContext';
import type { GalleryCategory, GalleryPhotoItem, ProjectIndustry } from '../types/cctv';

interface ProjectsPageProps {
  initialIndustryFilter?: 'All' | ProjectIndustry;
}

const INDUSTRIES: Array<'All' | ProjectIndustry> = [
  'All',
  'Hotel',
  'Property',
  'Distribution',
  'Schools',
  'Industrial',
  'Retail',
];

const GALLERY_CATEGORIES: Array<'All' | GalleryCategory> = [
  'All',
  'Installations',
  'Hardware',
  'Control Rooms',
  'Commercial',
  'Residential',
];

export function ProjectsPage({ initialIndustryFilter = 'All' }: ProjectsPageProps) {
  const { projects, gallery } = useCatalog();
  const [selectedIndustry, setSelectedIndustry] = useState<'All' | ProjectIndustry>(
    initialIndustryFilter || 'All'
  );
  const [selectedGalleryCat, setSelectedGalleryCat] = useState<'All' | GalleryCategory>('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhotoItem | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedIndustry === 'All') return projects;
    return projects.filter((p) => p.industry === selectedIndustry);
  }, [projects, selectedIndustry]);

  const filteredGallery = useMemo(() => {
    if (selectedGalleryCat === 'All') return gallery;
    return gallery.filter((g) => g.category === selectedGalleryCat);
  }, [gallery, selectedGalleryCat]);

  return (
    <div className="bg-[#060B16] text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Case Studies Section */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="w-10 h-0.5 bg-red-600 mb-3" />
              <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
                PROVEN FIELD DEPLOYMENTS
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Completed CCTV Projects & Case Studies
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedIndustry === ind
                      ? 'bg-red-600 text-white'
                      : 'bg-[#0B1221] text-slate-300 border border-white/10 hover:text-white'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-[#0B1221] border border-white/10 p-10 text-center">
              <p className="text-sm text-slate-300">
                No case studies recorded under {selectedIndustry} yet. Select &ldquo;All&rdquo; to view all completed sites.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-[#0B1221] border border-white/10 overflow-hidden chamfer-corner flex flex-col"
                >
                  <div className="aspect-[16/9] bg-[#04070E] overflow-hidden relative">
                    <SafeImage
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-semibold text-red-400">{project.industry}</span>
                      <span className="font-mono tabular-nums">{project.completionYear}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {project.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                        <Camera className="w-3.5 h-3.5 text-red-500" />
                        {project.camerasInstalled} Cameras Installed
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5 flex-1">
                      {project.summary}
                    </p>
                    <div className="pt-3 border-t border-white/10 text-xs font-semibold text-emerald-400">
                      Outcome: {project.outcomeMetric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Installation & Hardware Photo Gallery */}
        <div className="pt-14 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="w-10 h-0.5 bg-red-600 mb-3" />
              <p className="text-xs font-semibold tracking-[0.18em] text-red-400 mb-2">
                VISUAL ARCHIVE
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Installation & Hardware Photo Gallery
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedGalleryCat(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedGalleryCat === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-[#0B1221] text-slate-300 border border-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxPhoto(photo)}
                className="group text-left bg-[#0B1221] border border-white/10 overflow-hidden chamfer-corner cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-[#04070E] overflow-hidden">
                  <SafeImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 p-2 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-red-400 font-semibold mb-1">{photo.category}</div>
                  <h3 className="text-base font-bold text-white mb-1">{photo.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{photo.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Preview */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-4xl w-full bg-[#0B1221] border border-white/15 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="text-sm font-semibold text-white">
                {lightboxPhoto.title} · <span className="text-red-400">{lightboxPhoto.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close photo preview"
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black max-h-[70vh] overflow-hidden flex items-center justify-center">
              <SafeImage
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="px-5 py-4 text-sm text-slate-300">{lightboxPhoto.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}
