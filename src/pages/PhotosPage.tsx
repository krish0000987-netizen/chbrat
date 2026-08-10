import React, { useState } from 'react';
import { mockPhotoGalleries } from '../data/mockNewsData';
import { Camera, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const PhotosPage: React.FC = () => {
  const [activeGallery, setActiveGallery] = useState<typeof mockPhotoGalleries[0] | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const openLightbox = (gallery: typeof mockPhotoGalleries[0]) => {
    setActiveGallery(gallery);
    setCurrentSlide(0);
  };

  const closeLightbox = () => {
    setActiveGallery(null);
  };

  const nextSlide = () => {
    if (!activeGallery) return;
    setCurrentSlide((prev) => (prev + 1) % activeGallery.images.length);
  };

  const prevSlide = () => {
    if (!activeGallery) return;
    setCurrentSlide((prev) => (prev - 1 + activeGallery.images.length) % activeGallery.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-3 mb-6 border-b-2 border-red-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-6 h-6 text-red-800 dark:text-red-500" />
          <h1 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            PHOTO ESSAYS & PHOTOJOURNALISM
          </h1>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
          VISUAL BUREAU
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockPhotoGalleries.map((gal) => (
          <div
            key={gal.id}
            onClick={() => openLightbox(gal)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all"
          >
            <div className="relative aspect-[16/10] bg-black overflow-hidden">
              <img
                src={gal.images[0].url}
                alt={gal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded flex items-center space-x-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{gal.images.length} Photos</span>
              </div>
            </div>

            <div className="p-5">
              <span className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase">{gal.category}</span>
              <h2 className="font-serif-title font-bold text-lg text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                {gal.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 font-serif-body">
                {gal.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between p-4 sm:p-8">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-red-400 font-bold uppercase">{activeGallery.category} PHOTO ESSAY</span>
              <h3 className="font-serif-title font-bold text-base sm:text-xl">{activeGallery.title}</h3>
            </div>
            <button onClick={closeLightbox} className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Image */}
          <div className="relative flex-1 flex items-center justify-center py-4">
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-slate-800/80 hover:bg-red-800 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[70vh] flex flex-col items-center">
              <img
                src={activeGallery.images[currentSlide].url}
                alt={activeGallery.images[currentSlide].caption}
                className="max-h-[60vh] object-contain rounded"
              />
              <p className="text-xs sm:text-sm text-slate-300 text-center mt-4 max-w-2xl font-serif-body">
                {activeGallery.images[currentSlide].caption}
              </p>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-slate-800/80 hover:bg-red-800 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer Slide Counter */}
          <div className="text-center text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
            Photo {currentSlide + 1} of {activeGallery.images.length}
          </div>
        </div>
      )}

    </div>
  );
};
