import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { MegaMenu } from './MegaMenu';
import { Search, Sun, Moon, Bookmark, Menu, User, MapPin, ChevronDown, Newspaper, Sparkles, X } from 'lucide-react';

const cities = ['भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर', 'रीवा', 'सतना', 'चित्रकूट'];

export const GlobalHeader: React.FC = () => {
  const { theme, toggleTheme, savedArticleIds, setIsSearchOpen } = useNews();
  const [selectedCity, setSelectedCity] = useState('भोपाल');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBhavishyaOpen, setIsBhavishyaOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentDate = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Hindi main categories with mapping to routes
  const mainCategories = [
    { name: 'मुखपृष्ठ', path: '/', hi: 'Home' },
    { name: 'देश-विदेश', path: '/desh-videsh', hi: 'देश-विदेश' },
    { name: 'प्रदेश', path: '/pradesh', hi: 'प्रदेश' },
    { name: 'खेल', path: '/khel', hi: 'खेल' },
    { name: 'धर्म', path: '/dharm', hi: 'धर्म' },
    { name: 'मनोरंजन', path: '/manoranjan', hi: 'मनोरंजन' },
    { name: 'विचार', path: '/vichar', hi: 'विचार' },
    { name: 'लाइफस्टाइल & हेल्थ', path: '/lifestyle-health', hi: 'Lifestyle Health' },
    { name: 'टेक', path: '/tech', hi: 'टेक' },
    { name: 'ई-पेपर', path: '/epaper', hi: 'E-Paper' },
  ];

  const bhavishyaItems = [
    { name: 'भविष्यवाणी', path: '/bhavishya/bhavishyavani' },
    { name: 'दैनिक राशिफल', path: '/bhavishya/rashifal' },
    { name: 'दैनिक पंचांग', path: '/bhavishya/panchang' },
    { name: 'व्रत-त्यौहार', path: '/bhavishya/vrat-tyohar' },
  ];

  return (
    <header className="bg-white dark:bg-[#0B0F17] text-[#111827] dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-[#8B0000] dark:bg-[#7a0000] text-white text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 font-sans-ui">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-1 min-w-0">
            <span className="hidden sm:inline font-medium text-amber-100 truncate">{currentDate} • भोपाल</span>
            <span className="sm:hidden font-medium text-amber-100">{new Date().toLocaleDateString('hi-IN', { day:'numeric', month:'short'})}</span>
            <div className="hidden md:flex items-center gap-1 text-amber-50">
              <MapPin className="w-3 h-3 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold cursor-pointer py-0 text-white text-[11px]"
              >
                {cities.map(c => (
                  <option key={c} value={c} className="bg-white text-slate-900">{c}</option>
                ))}
              </select>
              <span className="text-amber-200">• 29°C</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/epaper" className="hidden md:flex items-center gap-1 font-bold bg-white text-[#8B0000] px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors">
              <Newspaper className="w-3.5 h-3.5" />
              <span>ई-पेपर पढ़ें</span>
            </Link>
            <a href="tel:+918827294576" className="hidden lg:block font-semibold text-amber-100 hover:text-white">📞 8827294576</a>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title={theme === 'light' ? 'डार्क मोड' : 'लाइट मोड'}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            </button>
            <Link to="/profile" className="relative p-1 hover:text-amber-200">
              <Bookmark className="w-4 h-4" />
              {savedArticleIds.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-400 text-black font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{savedArticleIds.length}</span>}
            </Link>
            <Link to="/login" className="bg-white text-[#8B0000] font-bold px-3 py-1 rounded-full text-[11px] hover:bg-amber-50 hidden sm:inline-flex items-center gap-1">
              <User className="w-3 h-3" /> लॉगिन
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND AREA - Logo + Title + Founder */}
      <div className="py-2 sm:py-3 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 bg-[#FEFCF8] dark:bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="lg:hidden p-2 -ml-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/assets/logo.jpg" alt="चित्रकूट ज्योति लोगो" className="h-10 sm:h-14 md:h-16 w-auto object-contain rounded shadow-sm border border-slate-200" />
            <div className="hidden sm:block text-left">
              <h1 className="font-devanagari font-black text-xl sm:text-2xl md:text-3xl leading-none text-[#8B0000] dark:text-red-400 tracking-tight">
                चित्रकूट ज्योति
              </h1>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400 uppercase">दैनिक • भोपाल • मध्यप्रदेश</p>
              <p className="text-[8px] text-slate-500 hidden md:block">स्थापना • 2026 • RNI स्वीकृत</p>
            </div>
          </Link>

          {/* Center Title for mobile */}
          <div className="sm:hidden text-center flex-1 min-w-0">
            <h1 className="font-devanagari font-black text-[18px] leading-none text-[#8B0000]">चित्रकूट ज्योति</h1>
            <p className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">भोपाल • मप्र</p>
          </div>

          {/* Center Tagline - Desktop */}
          <div className="hidden lg:block text-center flex-1 px-4">
            <p className="font-devanagari text-[11px] text-slate-600 dark:text-slate-400 italic leading-tight">
              “वैचारिक, सकारात्मक, देश-दुनिया, क्राइम, धर्म, ज्योतिष, वास्तु, कैरियर, लाइफस्टाइल सहित विविध खबरें”
            </p>
            <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-bold text-[#8B0000] dark:text-red-400 uppercase tracking-widest">
              <span>EST. 2026</span><span>•</span><span>भोपाल</span><span>•</span><span>चित्रकूट</span><span>•</span><span>मध्यप्रदेश</span>
            </div>
          </div>

          {/* Founder + Search */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5">
              <img src="/assets/founder.jpg" alt="स्नेहलता सोनी - संपादक" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#8B0000] shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-bold font-devanagari text-slate-900 dark:text-slate-100">स्नेहलता सोनी</p>
                <p className="text-[10px] text-[#8B0000] font-bold">संपादक • भोपाल (मप्र)</p>
                <p className="text-[9px] text-slate-500">8827294576</p>
              </div>
            </div>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#8B0000] hover:text-white transition-colors"
              title="खोजें"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile founder strip */}
        <div className="md:hidden mt-2 flex items-center justify-center gap-2 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-lg px-3 py-2">
          <img src="/assets/founder.jpg" alt="स्नेहलता सोनी" className="w-8 h-8 rounded-full object-cover border-2 border-[#8B0000]" />
          <div className="text-left">
            <p className="text-xs font-bold font-devanagari">स्नेहलता सोनी (संपादक)</p>
            <p className="text-[10px] text-slate-600">भोपाल (मप्र) • 8827294576 / 8982635688</p>
          </div>
          <a href="mailto:chitrakootjyotinews@gmail.com" className="ml-auto text-[9px] bg-[#8B0000] text-white px-2 py-1 rounded font-bold">मेल करें</a>
        </div>
      </div>

      {/* 3. PRIMARY NAV - Hindi Categories */}
      <nav className="bg-[#8B0000] dark:bg-[#7a0000] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center">
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="hidden lg:flex items-center gap-1.5 py-2.5 px-3 bg-[#5a0000] hover:bg-black font-bold text-xs uppercase tracking-wider shrink-0 mr-2 rounded"
          >
            <Menu className="w-4 h-4" /> वर्ग
          </button>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 flex-1 font-devanagari font-bold text-[13px] sm:text-sm">
            {mainCategories.map(cat => {
              const isActive = location.pathname === cat.path;
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${isActive ? 'bg-white text-[#8B0000]' : 'hover:bg-white/20 text-white'}`}
                >
                  {cat.name}
                </Link>
              );
            })}

            {/* Bhavishya Dropdown - Desktop */}
            <div className="relative hidden lg:block" onMouseEnter={() => setIsBhavishyaOpen(true)} onMouseLeave={() => setIsBhavishyaOpen(false)}>
              <button className={`px-3 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap ${isBhavishyaOpen ? 'bg-white text-[#8B0000]' : 'hover:bg-white/20'}`}>
                भविष्य जिज्ञासा <ChevronDown className={`w-3 h-3 transition-transform ${isBhavishyaOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBhavishyaOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  <div className="bg-[#8B0000] text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> भविष्य जिज्ञासा
                  </div>
                  {bhavishyaItems.map(item => (
                    <Link key={item.path} to={item.path} className="block px-3 py-2 text-sm hover:bg-amber-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link to="/bhavishya/rashifal" className="hidden xl:flex items-center gap-1 bg-amber-400 text-[#8B0000] font-black text-xs px-3 py-1.5 rounded-full shrink-0 ml-2 hover:bg-amber-300">
            <Sparkles className="w-3 h-3" /> राशिफल
          </Link>
        </div>

        {/* Mobile nav drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-t border-[#5a0000] p-3 space-y-3 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {mainCategories.map(cat => (
                <Link key={cat.name} to={cat.path} onClick={() => setIsMobileNavOpen(false)} className={`p-3 rounded-lg text-center font-bold font-devanagari border ${location.pathname === cat.path ? 'bg-[#8B0000] text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200'}`}>{cat.name}</Link>
              ))}
            </div>
            <div className="bg-amber-50 dark:bg-slate-800 rounded-lg p-3 border border-amber-200">
              <p className="font-black text-xs text-[#8B0000] mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> भविष्य जिज्ञासा</p>
              <div className="grid grid-cols-2 gap-2">
                {bhavishyaItems.map(it => (
                  <Link key={it.path} to={it.path} onClick={() => setIsMobileNavOpen(false)} className="bg-white dark:bg-slate-700 border rounded-lg p-2 text-center text-xs font-bold">{it.name}</Link>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/epaper" onClick={() => setIsMobileNavOpen(false)} className="flex-1 bg-[#8B0000] text-white p-3 rounded-lg text-center font-bold text-sm">📰 ई-पेपर</Link>
              <Link to="/contact" onClick={() => setIsMobileNavOpen(false)} className="flex-1 bg-slate-900 text-white p-3 rounded-lg text-center font-bold text-sm">संपर्क</Link>
            </div>
          </div>
        )}
      </nav>

      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </header>
  );
};
