import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Link } from 'react-router-dom';
import { Flame, Play, Pause, ChevronRight } from 'lucide-react';

export const BreakingTicker: React.FC = () => {
  const { articles } = useNews();
  const [isPaused, setIsPaused] = useState(false);
  const breakingArticles = articles.filter(a => a.isBreaking || a.isLeadHero);
  if (breakingArticles.length === 0) return null;
  return (
    <div className="bg-[#8B0000] text-white text-xs flex items-center border-y border-[#7a0000] shadow-inner">
      <div className="bg-[#5a0000] px-3 py-2 font-black flex items-center gap-1.5 shrink-0 z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <Flame className="w-3.5 h-3.5 text-amber-300" />
        <span className="text-[11px] font-devanagari">ब्रेकिंग न्यूज़</span>
      </div>
      <div className="overflow-hidden whitespace-nowrap flex-1 py-2 relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div className={`inline-block ${isPaused ? '' : 'animate-ticker'}`}>
          {breakingArticles.concat(breakingArticles).map((art, idx) => (
            <Link key={`${art.id}-${idx}`} to={`/article/${art.id}`} className="inline-flex items-center gap-2 mx-6 hover:text-amber-200">
              <span className="bg-black/30 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20">{art.category}</span>
              <span className="font-devanagari font-medium">{art.hindiTitle || art.title}</span>
              <ChevronRight className="w-3 h-3 text-amber-300" />
            </Link>
          ))}
        </div>
      </div>
      <button onClick={() => setIsPaused(!isPaused)} className="hidden sm:block bg-[#5a0000] px-2.5 py-2 border-l border-[#7a0000]">
        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
