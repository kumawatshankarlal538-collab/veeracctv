import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SafeImage({ src, alt, className = '', fallbackTitle }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1221] via-[#111C33] to-[#060B16] border border-white/10 text-slate-400 p-4 text-center ${className}`}
      >
        <Camera className="w-8 h-8 text-red-500/70 mb-2" />
        <span className="text-xs font-medium text-slate-300 truncate max-w-full">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
