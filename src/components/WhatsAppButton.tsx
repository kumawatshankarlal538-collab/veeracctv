import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';

export function WhatsAppButton() {
  const { siteSettings } = useCatalog();
  const cleanNumber = (siteSettings.whatsapp || '919829044510').replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    'Hello VEERA CCTV, I would like a consultation and quote for CCTV camera installation.'
  );
  const href = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with VEERA CCTV"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold shadow-lg border border-white/15 transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap"
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      <span>WhatsApp</span>
    </a>
  );
}
