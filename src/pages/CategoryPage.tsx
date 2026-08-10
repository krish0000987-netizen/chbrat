import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { StoryCard } from '../components/news/StoryCard';
import { AdvertisementSlot } from '../components/common/AdvertisementSlot';
import { Filter, Flame, Clock, TrendingUp, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  defaultCategory?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ defaultCategory }) => {
  const { categorySlug: paramSlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const { articles } = useNews();
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // Determine active category name
  const rawSlug = paramSlug || defaultCategory || location.pathname.replace(/^\//, '');
  const formattedCategory = rawSlug ? rawSlug.replace(/[-_]+/g, ' ') : 'India';

  const catKey = formattedCategory.toLowerCase();

  // Match articles intelligently by category name, tags, subcategory or title keywords
  const matchedArticles = articles.filter(a => {
    if (!rawSlug || catKey === 'latest' || catKey === 'search') return true;
    
    const catLower = a.category.toLowerCase();
    const subLower = (a.subcategory || '').toLowerCase();
    
    if (catLower === catKey || catLower.includes(catKey) || catKey.includes(catLower)) return true;
    if (subLower === catKey || subLower.includes(catKey)) return true;
    if (a.tags.some(t => t.toLowerCase() === catKey || t.toLowerCase().includes(catKey) || catKey.includes(t.toLowerCase()))) return true;
    if (a.title.toLowerCase().includes(catKey)) return true;

    // Special synonyms
    if ((catKey === 'tech' || catKey === 'technology' || catKey === 'ai') && (catLower.includes('tech') || a.tags.some(t => t.toLowerCase().includes('ai')))) return true;
    if ((catKey === 'cricket' || catKey === 'sports') && (catLower.includes('cricket') || catLower.includes('sport'))) return true;
    if ((catKey === 'markets' || catKey === 'business' || catKey === 'economy') && (catLower.includes('business') || catLower.includes('market') || catLower.includes('economy'))) return true;
    if ((catKey === 'elections' || catKey === 'politics') && (catLower.includes('politic') || catLower.includes('election'))) return true;
    if ((catKey === 'explained' || catKey === 'explainers') && catLower.includes('explain')) return true;
    if ((catKey === 'bollywood' || catKey === 'entertainment') && (catLower.includes('entertain') || catLower.includes('bollywood'))) return true;

    return false;
  });

  // If fewer than 2 matches, pad with general top articles so the page is rich with content
  const categoryArticles = matchedArticles.length >= 2 
    ? matchedArticles 
    : [...matchedArticles, ...articles.filter(a => !matchedArticles.includes(a))].slice(0, 6);

  const sortedArticles = [...categoryArticles].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.viewsCount - a.viewsCount;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const leadArticle = sortedArticles[0];
  const listArticles = sortedArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      
      {/* Category Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b-2 border-red-900 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-red-800 dark:text-red-400 uppercase tracking-widest block mb-1">
            BHARAT POST SPECIAL DESK
          </span>
          <h1 className="font-serif-title font-black text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 uppercase tracking-tight">
            {formattedCategory} BUREAU
          </h1>
        </div>

        {/* Sorting & Filter Controls */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-bold uppercase flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </span>
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1 rounded font-bold uppercase transition-colors ${
              sortBy === 'latest' ? 'bg-red-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 rounded font-bold uppercase transition-colors ${
              sortBy === 'popular' ? 'bg-red-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Most Read
          </button>
        </div>
      </div>

      {sortedArticles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 my-8">
          <h2 className="font-serif-title font-bold text-xl text-slate-800 dark:text-slate-200">
            No Stories Found in {formattedCategory}
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Our news editors are actively reporting on this desk. Check back shortly for updates.
          </p>
          <Link to="/" className="inline-block mt-4 bg-red-900 text-white font-bold px-4 py-2 rounded text-xs uppercase">
            Return to Front Page
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Lead Story */}
            {leadArticle && (
              <div>
                <StoryCard article={leadArticle} variant="lead" />
              </div>
            )}

            {/* List Feed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              {listArticles.map(art => (
                <StoryCard key={art.id} article={art} variant="standard" />
              ))}
            </div>

          </div>

          {/* Right Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <AdvertisementSlot type="sidebar" />

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-serif-title font-bold text-xs uppercase text-red-800 dark:text-red-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                TRENDING IN OTHER DESKS
              </h3>
              <div className="space-y-2">
                {articles.slice(0, 5).map(art => (
                  <StoryCard key={art.id} article={art} variant="compact" />
                ))}
              </div>
            </div>
          </aside>

        </div>
      )}
    </div>
  );
};
