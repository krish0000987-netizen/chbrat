import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';
import { useNews } from '../../context/NewsContext';
import { Bookmark, Share2, Clock, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface StoryCardProps {
  article: Article;
  variant?: 'lead' | 'standard' | 'compact' | 'minimal' | 'horizontal';
  rankIndex?: number;
}

export const StoryCard: React.FC<StoryCardProps> = ({ article, variant = 'standard', rankIndex }) => {
  const { toggleSaveArticle, isArticleSaved, language } = useNews();
  const saved = isArticleSaved(article.id);
  const title = language === 'en' ? article.title : (article.hindiTitle || article.title);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric'
  });

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subheadline,
        url: window.location.origin + `/article/${article.id}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/article/${article.id}`);
      alert('Article link copied to clipboard!');
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveArticle(article.id);
  };

  /* VARIANT 1: LEAD HERO STORY */
  if (variant === 'lead') {
    return (
      <article className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <Link to={`/article/${article.id}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-red-800 text-white font-sans-ui text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow">
                {article.category}
              </span>
              {article.isBreaking && (
                <span className="bg-amber-500 text-slate-950 font-sans-ui text-xs font-black px-2.5 py-1 rounded uppercase tracking-wider flex items-center space-x-1 shadow">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                  <span>BREAKING</span>
                </span>
              )}
              {article.isDemo && (
                <span className="bg-black/60 backdrop-blur text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  DEMO NEWS
                </span>
              )}
            </div>

            {/* Title & Subheadline over image on desktop */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className={`${language==='hi'?'font-devanagari':''} font-bold text-xl sm:text-2xl md:text-3xl leading-tight group-hover:text-amber-300 transition-colors`}>
                {title}
              </h2>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="font-serif-body text-sm sm:text-base text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {article.subheadline}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans-ui">
              <div className="flex items-center space-x-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">{article.author.name}</p>
                  <p className="text-[10px]">{formattedDate} • {article.readTimeMinutes} min read</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full transition-colors ${saved ? 'text-red-700 bg-red-50 dark:bg-red-950' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  title={saved ? "Remove bookmark" : "Save article"}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Share story"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  /* VARIANT 2: COMPACT HORIZONTAL CARD */
  if (variant === 'compact') {
    return (
      <article className="group py-3 border-b border-slate-200 dark:border-slate-800/80 last:border-none">
        <Link to={`/article/${article.id}`} className="flex items-start space-x-3">
          <div className="w-24 h-18 sm:w-28 sm:h-20 rounded overflow-hidden bg-slate-900 shrink-0">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-red-800 dark:text-red-400 mb-0.5">
              <span>{article.category}</span>
              <span>•</span>
              <span className="text-slate-400 font-normal">{article.readTimeMinutes}m read</span>
            </div>
            <h4 className={`${language==='hi'?'font-devanagari':''} font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-red-800 dark:group-hover:text-red-400 leading-snug line-clamp-2`}>
              {title}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
              By {article.author.name}
            </span>
          </div>
        </Link>
      </article>
    );
  }

  /* VARIANT 3: MINIMAL NUMBERED RANK CARD */
  if (variant === 'minimal') {
    return (
      <article className="group flex items-start space-x-3 py-3 border-b border-slate-200 dark:border-slate-800/80 last:border-none">
        {rankIndex !== undefined && (
          <span className="font-serif-title font-black text-2xl sm:text-3xl text-slate-300 dark:text-slate-700 group-hover:text-red-800 transition-colors w-8 text-right shrink-0">
            {rankIndex + 1}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <Link to={`/article/${article.id}`} className="block">
            <span className="text-[10px] font-bold uppercase text-red-800 dark:text-red-400 block mb-0.5">
              {article.category}
            </span>
            <h4 className={`${language==='hi'?'font-devanagari':''} font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-red-800 dark:group-hover:text-red-400 leading-snug line-clamp-2`}>
              {title}
            </h4>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
              {formattedDate} • {article.viewsCount.toLocaleString()} reads
            </span>
          </Link>
        </div>
      </article>
    );
  }

  /* VARIANT 4: STANDARD CARD (Default Grid Item) */
  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link to={`/article/${article.id}`} className="block flex-1 flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 shrink-0">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="bg-red-900/90 text-white font-sans-ui text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur">
              {article.category}
            </span>
            {article.isDemo && (
              <span className="bg-black/70 text-slate-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                DEMO
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`${language==='hi'?'font-devanagari':''} font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-red-800 dark:group-hover:text-red-400 leading-snug line-clamp-2`}>
              {title}
            </h3>
            <p className="font-serif-body text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {article.subheadline}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>By {article.author.name}</span>
            <div className="flex items-center space-x-2">
              <span>{article.readTimeMinutes}m</span>
              <button
                onClick={handleSave}
                className={`p-1 rounded transition-colors ${saved ? 'text-red-700' : 'hover:text-slate-800 dark:hover:text-slate-200'}`}
                title="Save"
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
