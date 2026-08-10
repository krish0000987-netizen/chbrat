import React, { useState } from 'react';
import { mockWebStories } from '../data/mockNewsData';
import { Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const WebStoriesPage: React.FC = () => {
  const [activeStory, setActiveStory] = useState<typeof mockWebStories[0] | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const openStory = (story: typeof mockWebStories[0]) => {
    setActiveStory(story);
    setCurrentSlideIndex(0);
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      <div className="pb-3 mb-6 border-b-2 border-red-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-red-800 dark:text-red-500" />
          <h1 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            VISUAL WEB STORIES
          </h1>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
          TAP & SWIPE BITESIZE NEWS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mockWebStories.map((st) => (
          <div
            key={st.id}
            onClick={() => openStory(st)}
            className="group cursor-pointer relative aspect-[9/16] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:border-red-800 shadow-md transition-all"
          >
            <img
              src={st.coverImage}
              alt={st.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-between">
              <span className="bg-red-800 text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase self-start">
                {st.slides.length} SLIDES
              </span>
              <h3 className="font-serif-title font-bold text-xs text-white leading-snug line-clamp-3">
                {st.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Mobile-style Web Story Viewer */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
            
            {/* Slide Progress Indicator Bar */}
            <div className="absolute top-2 left-2 right-2 z-20 flex space-x-1">
              {activeStory.slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx === currentSlideIndex ? 'bg-amber-400' : idx < currentSlideIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={closeStory}
              className="absolute top-5 right-3 z-30 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slide Image Background */}
            <img
              src={activeStory.slides[currentSlideIndex].image}
              alt="Story slide"
              className="w-full h-full object-cover"
            />

            {/* Slide Text Content Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 text-white z-10">
              <h3 className="font-serif-title font-bold text-lg leading-snug text-amber-300 mb-2">
                {activeStory.slides[currentSlideIndex].headline}
              </h3>
              <p className="font-serif-body text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeStory.slides[currentSlideIndex].caption}
              </p>
            </div>

            {/* Tap Navigation Overlays */}
            <div
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              className="absolute left-0 top-12 bottom-24 w-1/2 z-20 cursor-pointer"
            />
            <div
              onClick={() => setCurrentSlideIndex(prev => Math.min(activeStory.slides.length - 1, prev + 1))}
              className="absolute right-0 top-12 bottom-24 w-1/2 z-20 cursor-pointer"
            />

          </div>
        </div>
      )}

    </div>
  );
};
