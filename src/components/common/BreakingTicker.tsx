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
    <div className="bg-red-900 text-white text-xs font-sans-ui flex items-center border-b border-red-950 shadow-inner">
      <div className="bg-red-700 px-3 py-2 font-bold uppercase tracking-wider flex items-center space-x-1.5 shrink-0 z-10 shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <Flame className="w-3.5 h-3.5 text-amber-300" />
        <span className="text-[11px]">BREAKING</span>
      </div>

      <div 
        className="overflow-hidden whitespace-nowrap flex-1 py-2 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`inline-block ${isPaused ? '' : 'animate-ticker'}`}>
          {breakingArticles.concat(breakingArticles).map((art, idx) => (
            <Link
              key={`${art.id}-${idx}`}
              to={`/article/${art.id}`}
              className="inline-flex items-center space-x-2 mx-6 hover:text-amber-200 transition-colors"
            >
              <span className="bg-red-950 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-red-800">
                {art.category}
              </span>
              <span className="font-medium text-slate-100">{art.title}</span>
              <ChevronRight className="w-3 h-3 text-red-400" />
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsPaused(!isPaused)}
        className="bg-red-850 hover:bg-red-800 px-2.5 py-2 text-slate-300 hover:text-white shrink-0 z-10 transition-colors border-l border-red-800 hidden sm:block"
        title={isPaused ? "Resume ticker" : "Pause ticker"}
      >
        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
