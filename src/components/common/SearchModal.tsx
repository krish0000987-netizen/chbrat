import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Link } from 'react-router-dom';
import { Search, X, Calendar, User, ArrowRight, Filter } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, articles } = useNews();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isSearchOpen) return null;

  const categories = ['All', 'India', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Opinion'];

  const filtered = articles.filter(art => {
    const matchesQuery = query === '' || 
      art.title.toLowerCase().includes(query.toLowerCase()) ||
      art.subheadline.toLowerCase().includes(query.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
      art.author.name.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-16 px-4 animate-fade-in">
      <div className="bg-[#FAF9F6] dark:bg-[#0F172A] text-[#111827] dark:text-slate-100 w-full max-w-3xl rounded-xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-6 h-6 text-red-800 dark:text-red-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, topics, authors, or cities (e.g., Parliament, RBI, AI, Cricket, Gujarat)..."
            className="w-full text-lg font-sans-ui bg-transparent border-none outline-none placeholder-slate-400 dark:placeholder-slate-500"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-500 ml-2 mr-1 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-800 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-semibold">No news articles found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for keywords like "India", "Policy", "Cricket", or "Business".</p>
            </div>
          ) : (
            filtered.map(art => (
              <Link
                key={art.id}
                to={`/article/${art.id}`}
                onClick={() => setIsSearchOpen(false)}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2 text-[11px] text-red-800 dark:text-red-400 font-bold uppercase mb-1">
                    <span>{art.category}</span>
                    {art.state && <span>• {art.state}</span>}
                    <span className="text-slate-400 font-normal">
                      • {new Date(art.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-serif-title font-semibold text-base group-hover:text-red-800 dark:group-hover:text-red-400 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                    {art.subheadline}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 shrink-0">
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-red-800 dark:text-red-400 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Showing {filtered.length} search results from The Indian Record news repository
        </div>
      </div>
    </div>
  );
};
