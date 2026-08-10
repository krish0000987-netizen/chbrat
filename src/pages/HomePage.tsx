import React from 'react';
import { HeroNewsroom } from '../components/news/HeroNewsroom';
import { TopStoriesRail } from '../components/news/TopStoriesRail';
import { RegionalStateSection } from '../components/news/RegionalStateSection';
import { StoryCard } from '../components/news/StoryCard';
import { NewsletterCard } from '../components/common/NewsletterCard';
import { AdvertisementSlot } from '../components/common/AdvertisementSlot';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Video, Camera, Sparkles, HelpCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { mockVideoItems, mockPhotoGalleries, mockWebStories, mockFactChecks } from '../data/mockNewsData';

export const HomePage: React.FC = () => {
  const { articles } = useNews();

  const businessArticles = articles.filter(a => a.category === 'Business' || a.category === 'Markets').slice(0, 4);
  const techArticles = articles.filter(a => a.category === 'Technology' || a.category === 'Startups').slice(0, 4);
  const cricketArticles = articles.filter(a => a.category === 'Cricket' || a.category === 'Sports').slice(0, 4);
  const opinionArticles = articles.filter(a => a.category === 'Opinion' || a.category === 'Explainers').slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* 1. HERO NEWSROOM GRID */}
      <HeroNewsroom />

      {/* 2. ADVERTISEMENT BILLBOARD */}
      <AdvertisementSlot type="billboard" />

      {/* 3. TOP STORIES HORIZONTAL RAIL */}
      <TopStoriesRail />

      {/* 4. BUSINESS & MARKETS SPECIAL FEATURE GRID */}
      <section className="my-8 sm:my-10">
        <div className="flex items-center justify-between pb-2 mb-4 sm:mb-6 border-b-2 border-red-900">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-900 rounded-full"></span>
            <h2 className="font-serif-title font-black text-base sm:text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
              BUSINESS & MARKETS
            </h2>
          </div>
          <Link to="/business" className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline flex items-center">
            <span>Market Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {businessArticles.map(art => (
            <StoryCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 5. REGIONAL STATE & CITY BUREAU SECTION */}
      <RegionalStateSection />

      {/* 6. TECH, AI & STARTUPS SECTION */}
      <section className="my-8 sm:my-10 bg-slate-900 text-white p-4 sm:p-6 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 sm:mb-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <h2 className="font-serif-title font-black text-base sm:text-xl uppercase tracking-tight text-white">
              TECH & AI DESK
            </h2>
          </div>
          <Link to="/technology" className="text-xs font-bold text-amber-400 hover:underline flex items-center">
            <span>Tech Bureau</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {techArticles.map(art => (
            <StoryCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 7. LIVE SPORTS SCOREBOARD & CRICKET */}
      <section className="my-8 sm:my-10">
        <div className="flex items-center justify-between pb-2 mb-4 sm:mb-6 border-b-2 border-red-900">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-red-800 dark:text-red-500" />
            <h2 className="font-serif-title font-black text-base sm:text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
              CRICKET & SPORTS DESK
            </h2>
          </div>
          <Link to="/cricket" className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline flex items-center">
            <span>Sports Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Scoreboard Banner */}
        <div className="bg-[#121212] text-white p-3.5 sm:p-5 rounded-xl border border-slate-800 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="bg-red-800 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded uppercase tracking-wider animate-pulse shrink-0">
              LIVE SCORE
            </span>
            <div>
              <p className="font-bold text-xs sm:text-sm">INDIA vs AUSTRALIA — 5th Test</p>
              <p className="text-[11px] text-slate-400">Day 5 • Session 2 • India won by 84 runs</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto space-x-4 sm:space-x-6 text-left sm:text-right font-mono border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
            <div>
              <p className="text-[10px] text-slate-400">IND 1st & 2nd</p>
              <p className="text-sm sm:text-base font-bold text-amber-400">345 & 268/8 d</p>
            </div>
            <div className="text-slate-600 font-sans text-xs">VS</div>
            <div>
              <p className="text-[10px] text-slate-400">AUS 1st & 2nd</p>
              <p className="text-sm sm:text-base font-bold text-white">345 & 183</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cricketArticles.map(art => (
            <StoryCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 8. VIDEO NEWS STUDIO & MULTIMEDIA */}
      <section className="my-10 bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-300 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-red-800 dark:text-red-500" />
            <h2 className="font-serif-title font-black text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
              VIDEO NEWS DESK & EXPLAINERS
            </h2>
          </div>
          <Link to="/videos" className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline flex items-center">
            <span>Watch All Videos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockVideoItems.map(vid => (
            <div key={vid.id} className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group">
              <div className="relative aspect-video bg-black">
                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-800/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="ml-1 text-lg">▶</span>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                  {vid.duration}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase">{vid.category}</span>
                <h3 className="font-serif-title font-bold text-sm text-slate-900 dark:text-slate-100 mt-1 line-clamp-2 leading-snug">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{vid.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FACT CHECK & OPINIONS DUAL MODULE */}
      <section className="my-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* OPINION & EDITORIAL COLUMNS (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-red-900">
            <h2 className="font-serif-title font-black text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
              OPINION & EDITORIAL COLUMNS
            </h2>
            <Link to="/opinion" className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline">
              View All Perspectives
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {opinionArticles.map(art => (
              <StoryCard key={art.id} article={art} variant="standard" />
            ))}
          </div>
        </div>

        {/* FACT CHECK VERIFICATION DESK (4 cols) */}
        <div className="lg:col-span-4 bg-amber-500/10 border border-amber-500/30 dark:bg-slate-900/90 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-amber-500/40 mb-4">
              <CheckCircle2 className="w-5 h-5 text-red-800 dark:text-red-400" />
              <h3 className="font-sans-ui font-black text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100">
                FACT CHECK BUREAU
              </h3>
            </div>

            {mockFactChecks.map(fc => (
              <div key={fc.id} className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="bg-red-900 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                  VERDICT: {fc.verdict}
                </span>
                <p className="font-serif-title font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                  "{fc.claim}"
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-serif-body">
                  {fc.explanation}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/fact-check"
            className="mt-4 bg-slate-900 dark:bg-slate-800 text-white text-center font-bold text-xs py-2.5 rounded uppercase tracking-wider hover:bg-black transition-colors block"
          >
            Submit Viral Claim For Fact Check
          </Link>
        </div>

      </section>

      {/* 10. NEWSLETTER CARD */}
      <NewsletterCard />
    </div>
  );
};
