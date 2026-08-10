import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { MegaMenu } from './MegaMenu';
import { Search, Sun, Moon, Bookmark, Menu, User, Sparkles, MapPin, Globe, ChevronDown, Bell, Newspaper, Volume2 } from 'lucide-react';
import { LanguageCode } from '../../types';

const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad', 'Kolkata', 'Chennai', 'Jaipur'];

const languages: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' }
];

export const GlobalHeader: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    savedArticleIds, 
    setIsSearchOpen,
    userProfile 
  } = useNews();

  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const mainCategories = [
    { name: 'Home', path: '/' },
    { name: 'India', path: '/india' },
    { name: 'Politics', path: '/politics' },
    { name: 'Business', path: '/business' },
    { name: 'Markets', path: '/markets' },
    { name: 'World', path: '/world' },
    { name: 'Tech & AI', path: '/technology' },
    { name: 'Cricket', path: '/cricket' },
    { name: 'Entertainment', path: '/entertainment' },
    { name: 'Lifestyle', path: '/lifestyle' },
    { name: 'Opinion', path: '/opinion' },
    { name: 'Explainers', path: '/explained' },
    { name: 'State & City', path: '/state/gujarat' },
    { name: 'Videos', path: '/videos' },
    { name: 'Photos', path: '/photos' },
    { name: 'Web Stories', path: '/web-stories' },
    { name: 'Live', path: '/live' },
    { name: 'E-Paper', path: '/epaper' }
  ];

  return (
    <header className="bg-[#FAF9F6] dark:bg-[#0B0F17] text-[#111827] dark:text-slate-100 border-b border-slate-300 dark:border-slate-800 transition-colors">
      {/* 1. TOP UTILITY BAR */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-950/80 text-[10px] sm:text-[11px] py-1.5 px-2 sm:px-4 font-sans-ui">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          
          {/* Left: Date & City Selector */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span className="font-medium text-slate-600 dark:text-slate-400 hidden sm:inline">
              {currentDate}
            </span>

            <div className="flex items-center space-x-0.5 sm:space-x-1 text-slate-700 dark:text-slate-300">
              <MapPin className="w-3 h-3 text-red-800 dark:text-red-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold cursor-pointer py-0 text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs"
              >
                {cities.map(c => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{c}</option>
                ))}
              </select>
              <span className="text-slate-500 font-mono hidden md:inline">• 28°C Sunny</span>
            </div>
          </div>

          {/* Right: E-Paper, Language, Theme, Subscribe, Login */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <Link
              to="/epaper"
              className="hidden sm:flex items-center space-x-1 font-bold text-red-800 dark:text-red-400 hover:underline"
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>E-Paper</span>
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center space-x-0.5 font-medium hover:text-red-800 dark:hover:text-red-400 px-1 py-0.5"
              >
                <Globe className="w-3 h-3 text-slate-500" />
                <span>{languages.find(l => l.code === language)?.label}</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded py-1 z-50">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-red-50 dark:hover:bg-slate-800 text-xs font-medium"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to White Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="hidden xs:inline">WHITE</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="hidden xs:inline">DARK</span>
                </>
              )}
            </button>

            {/* Saved Articles Bookmark Quick Link */}
            <Link
              to="/profile"
              className="flex items-center space-x-1 relative text-slate-700 dark:text-slate-300 hover:text-red-800 p-0.5"
              title="Saved Articles"
            >
              <Bookmark className="w-3.5 h-3.5" />
              {savedArticleIds.length > 0 && (
                <span className="bg-red-800 text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center -top-1 -right-1">
                  {savedArticleIds.length}
                </span>
              )}
            </Link>

            {/* Subscribe CTA */}
            <Link
              to="/subscribe"
              className="bg-red-900 hover:bg-red-950 text-white font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wide uppercase transition-colors"
            >
              SUBSCRIBE
            </Link>

            {/* Dedicated Login Button */}
            <Link
              to="/login"
              className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wide uppercase transition-colors flex items-center space-x-1 border border-slate-700"
            >
              <User className="w-3 h-3 text-amber-400" />
              <span>LOGIN</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BRAND LOGO AREA */}
      <div className="py-3 sm:py-4 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Left spacer/tagline on desktop */}
          <div className="hidden lg:block text-xs font-serif-body text-slate-500 dark:text-slate-400 italic w-1/4">
            “Independent Journal of Record for India, Markets & Global Affairs”
          </div>

          {/* Center Title Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block group">
              <h1 className="font-serif-title font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#111827] dark:text-white group-hover:text-red-900 dark:group-hover:text-red-400 transition-colors uppercase">
                THE INDIAN RECORD
              </h1>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:space-x-2 text-[8px] xs:text-[9px] sm:text-[10px] uppercase font-sans-ui font-semibold text-red-900 dark:text-red-400 tracking-wider sm:tracking-widest mt-0.5">
              <span>EST. 1948</span>
              <span>•</span>
              <span>NEW DELHI</span>
              <span>•</span>
              <span>MUMBAI</span>
              <span>•</span>
              <span>BENGALURU</span>
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center space-x-2 w-full max-w-xs md:w-1/4 justify-center md:justify-end mt-1 md:mt-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-red-800 px-3 py-1.5 rounded-full text-xs text-slate-600 dark:text-slate-300 transition-all w-full"
            >
              <Search className="w-3.5 h-3.5 text-red-800 dark:text-red-400 shrink-0" />
              <span className="font-medium truncate text-left">Search news & topics...</span>
            </button>

            <Link
              to="/profile"
              className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-red-900 hover:text-white transition-colors shrink-0"
              title="User Account"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION BAR */}
      <nav className="bg-[#FAF9F6] dark:bg-[#0B0F17] border-b border-slate-300 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Mega Menu Toggle Button */}
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center space-x-1.5 py-2.5 px-3 bg-red-900 text-white font-sans-ui text-xs font-bold uppercase tracking-wider hover:bg-red-950 transition-colors shrink-0 mr-2 rounded"
            title="Open All News Sections Menu"
          >
            <Menu className="w-4 h-4" />
            <span className="inline font-extrabold">SECTIONS</span>
          </button>

          {/* Scrollable Categories List */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 font-sans-ui text-xs uppercase tracking-wider font-bold">
            {mainCategories.map((cat) => {
              const isActive = location.pathname === cat.path;
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-red-800 text-white'
                      : 'text-slate-800 dark:text-slate-200 hover:text-red-800 dark:hover:text-red-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Live Indicator Shortcut */}
          <Link
            to="/live"
            className="hidden xl:flex items-center space-x-1 text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded border border-red-200 dark:border-red-900 shrink-0 ml-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span>LIVE DESK</span>
          </Link>
        </div>
      </nav>

      {/* Mega Menu Overlay */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </header>
  );
};
