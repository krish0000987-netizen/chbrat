import React from 'react';
import { useNews } from '../context/NewsContext';
import { StoryCard } from '../components/news/StoryCard';
import { Bookmark, User, Settings, ShieldCheck, Mail, Bell, Key, ExternalLink, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { savedArticleIds, articles, userProfile } = useNews();

  const savedList = articles.filter(a => savedArticleIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Account Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-red-800"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif-title font-bold text-2xl text-slate-900 dark:text-slate-100">
                {userProfile.name}
              </h1>
              <span className="bg-amber-400 text-black font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                {userProfile.subscriptionPlan} MEMBER
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">ID: BP-READER-98421 • Member since 2026 • Bharat Post All-Access Pass</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="bg-slate-900 text-white dark:bg-slate-800 font-bold text-xs px-3.5 py-2 rounded flex items-center space-x-1.5 uppercase tracking-wider hover:bg-slate-800"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Editorial CMS</span>
          </Link>
          <Link
            to="/subscribe"
            className="bg-amber-400 text-black font-bold text-xs px-3.5 py-2 rounded uppercase tracking-wider hover:bg-amber-300"
          >
            Manage Plan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Bookmarks List (8 cols) */}
        <div className="lg:col-span-8">
          <div className="flex items-center space-x-2 pb-3 mb-6 border-b-2 border-red-900">
            <Bookmark className="w-5 h-5 text-red-800 dark:text-red-400" />
            <h2 className="font-serif-title font-black text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
              SAVED ARTICLES & READING LIST ({savedList.length})
            </h2>
          </div>

          {savedList.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 p-8 text-center rounded-xl border border-slate-200 dark:border-slate-800">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-serif-title font-bold text-lg text-slate-800 dark:text-slate-200">
                No Bookmarked Articles Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Click the bookmark icon on any news story to save it for offline or later reading.
              </p>
              <Link to="/" className="inline-block mt-4 bg-red-900 text-white font-bold px-4 py-2 rounded text-xs uppercase">
                Explore Front Page Stories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {savedList.map(art => (
                <StoryCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          )}
        </div>

        {/* Account Settings & Credentials Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Reader Profile Credentials Info Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-serif-title font-bold text-xs uppercase text-red-800 dark:text-red-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3 flex items-center space-x-1.5">
              <Key className="w-4 h-4" />
              <span>READER ACCOUNT CREDENTIALS</span>
            </h3>
            
            <div className="space-y-2 text-xs font-sans-ui text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Subscriber Email / ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">rajesh.s@example.com</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Passcode</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">reader2026</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Followed Desk Topics</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userProfile.followedTopics.map(topic => (
                    <span key={topic} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-serif-title font-bold text-xs uppercase text-red-800 dark:text-red-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 flex items-center space-x-1.5">
              <Bell className="w-4 h-4" />
              <span>NEWSLETTER PREFERENCES</span>
            </h3>
            <div className="space-y-3 text-xs font-sans-ui">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-red-800 focus:ring-red-800" />
                <span className="text-slate-800 dark:text-slate-200">Daily Morning Executive Briefing (07:00 AM)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-red-800 focus:ring-red-800" />
                <span className="text-slate-800 dark:text-slate-200">Breaking News Flash Alerts</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-red-800 focus:ring-red-800" />
                <span className="text-slate-800 dark:text-slate-200">Market Closing Wrap & Stock Pulse</span>
              </label>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

