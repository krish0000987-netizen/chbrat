import React from 'react';
import { useNews } from '../../context/NewsContext';
import { StoryCard } from './StoryCard';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

export const TopStoriesRail: React.FC = () => {
  const { articles } = useNews();
  const topStories = articles.filter(a => a.isTrending || a.viewsCount > 30000).slice(0, 8);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-10 bg-slate-100/70 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-300 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-red-800 dark:text-red-500" />
          <h2 className="font-serif-title font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            TRENDING STORIES ACROSS INDIA
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-red-800 hover:text-white transition-colors border border-slate-300 dark:border-slate-700 shadow-xs"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-red-800 hover:text-white transition-colors border border-slate-300 dark:border-slate-700 shadow-xs"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
      >
        {topStories.map(art => (
          <div key={art.id} className="w-72 sm:w-80 shrink-0 snap-start">
            <StoryCard article={art} variant="standard" />
          </div>
        ))}
      </div>
    </section>
  );
};
