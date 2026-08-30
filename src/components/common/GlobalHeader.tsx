import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { MegaMenu } from './MegaMenu';
import { Search, Sun, Moon, Bookmark, Menu, User, MapPin, ChevronDown, Newspaper, Sparkles, X, Globe } from 'lucide-react';
import { getT } from '../../lib/i18n';

const citiesHi = ['भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर', 'रीवा', 'सतना', 'चित्रकूट'];
const citiesEn = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Rewa', 'Satna', 'Chitrakoot'];

export const GlobalHeader: React.FC = () => {
  const { theme, toggleTheme, savedArticleIds, setIsSearchOpen, language, setLanguage } = useNews();
  const t = getT(language === 'en' ? 'en' : 'hi');
  const cities = language === 'en' ? citiesEn : citiesHi;
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isBhavishyaOpen, setIsBhavishyaOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const location = useLocation();

  const currentDate = new Date().toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const mainCategories = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.deshVidesh, path: '/desh-videsh' },
    { name: t.nav.pradesh, path: '/pradesh' },
    { name: t.nav.khel, path: '/khel' },
    { name: t.nav.dharm, path: '/dharm' },
    { name: t.nav.manoranjan, path: '/manoranjan' },
    { name: t.nav.vichar, path: '/vichar' },
    { name: t.nav.lifestyle, path: '/lifestyle-health' },
    { name: t.nav.tech, path: '/tech' },
    { name: t.nav.epaper, path: '/epaper' },
  ];

  const bhavishyaItems = [
    { name: t.nav.bhavishyavani, path: '/bhavishya/bhavishyavani' },
    { name: t.nav.rashifal, path: '/bhavishya/rashifal' },
    { name: t.nav.panchang, path: '/bhavishya/panchang' },
    { name: t.nav.vrat, path: '/bhavishya/vrat-tyohar' },
  ];

  return (
    <header className="bg-white dark:bg-[#0B0F17] text-[#111827] dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* TOP BAR */}
      <div className="bg-[#8B0000] dark:bg-[#7a0000] text-white text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-4 font-sans-ui">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-1 min-w-0">
            <span className="hidden sm:inline font-medium text-amber-100 truncate">{currentDate} • {language==='en'?'Bhopal':'भोपाल'}</span>
            <span className="sm:hidden font-medium text-amber-100">{new Date().toLocaleDateString(language==='en'?'en-IN':'hi-IN', { day:'numeric', month:'short'})}</span>
            <div className="hidden md:flex items-center gap-1 text-amber-50">
              <MapPin className="w-3 h-3 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold cursor-pointer py-0 text-white text-[11px]"
              >
                {cities.map(c => (<option key={c} value={c} className="bg-white text-slate-900">{c}</option>))}
              </select>
              <span className="text-amber-200">• 29°C</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle */}
            <div className="flex items-center bg-white/20 rounded-full p-0.5">
              <button onClick={() => setLanguage('hi')} className={`px-2 sm:px-3 py-1 rounded-full text-[11px] font-black transition-colors ${language==='hi' ? 'bg-white text-[#8B0000]' : 'text-white hover:bg-white/10'}`}>हिंदी</button>
              <button onClick={() => setLanguage('en')} className={`px-2 sm:px-3 py-1 rounded-full text-[11px] font-black transition-colors ${language==='en' ? 'bg-white text-[#8B0000]' : 'text-white hover:bg-white/10'}`}>EN</button>
            </div>

            <Link to="/epaper" className="hidden md:flex items-center gap-1 font-bold bg-white text-[#8B0000] px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors">
              <Newspaper className="w-3.5 h-3.5" />
              <span>{t.header.epaper}</span>
            </Link>
            <a href="tel:+918827294576" className="hidden lg:block font-semibold text-amber-100 hover:text-white">📞 8827294576</a>
            <button onClick={toggleTheme} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors" title={theme === 'light' ? 'Dark' : 'Light'}>
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            </button>
            <Link to="/profile" className="relative p-1 hover:text-amber-200">
              <Bookmark className="w-4 h-4" />
              {savedArticleIds.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-400 text-black font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{savedArticleIds.length}</span>}
            </Link>
            <Link to="/login" className="bg-white text-[#8B0000] font-bold px-3 py-1 rounded-full text-[11px] hover:bg-amber-50 hidden sm:inline-flex items-center gap-1">
              <User className="w-3 h-3" /> {t.header.login}
            </Link>
          </div>
        </div>
      </div>

      {/* BRAND AREA */}
      <div className="py-2 sm:py-3 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 bg-[#FEFCF8] dark:bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="lg:hidden p-2 -ml-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/assets/logo.jpg" alt="logo" className="h-10 sm:h-14 md:h-16 w-auto object-contain rounded shadow-sm border border-slate-200" />
            <div className="hidden sm:block text-left">
              <h1 className="font-devanagari font-black text-xl sm:text-2xl md:text-3xl leading-none text-[#8B0000] dark:text-red-400 tracking-tight">
                {language==='en' ? 'Chitrakoot Jyoti' : 'चित्रकूट ज्योति'}
              </h1>
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-600 dark:text-slate-400 uppercase">{language==='en' ? 'Daily • Bhopal • Madhya Pradesh' : 'दैनिक • भोपाल • मध्यप्रदेश'}</p>
              <p className="text-[8px] text-slate-500 hidden md:block">{language==='en' ? 'EST. 2026 • RNI Approved' : 'स्थापना • 2026 • RNI स्वीकृत'}</p>
            </div>
          </Link>

          <div className="sm:hidden text-center flex-1 min-w-0">
            <h1 className="font-devanagari font-black text-[18px] leading-none text-[#8B0000]">{language==='en' ? 'Chitrakoot Jyoti' : 'चित्रकूट ज्योति'}</h1>
            <p className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">{language==='en' ? 'Bhopal • MP' : 'भोपाल • मप्र'}</p>
          </div>

          <div className="hidden lg:block text-center flex-1 px-4">
            <p className="font-devanagari text-[11px] text-slate-600 dark:text-slate-400 italic leading-tight">
              {language==='en' ? '"Ideological, positive, national, crime, spiritual, astrology & lifestyle news"' : '“वैचारिक, सकारात्मक, देश-दुनिया, क्राइम, धर्म, ज्योतिष, वास्तु, कैरियर, लाइफस्टाइल सहित विविध खबरें”'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-bold text-[#8B0000] dark:text-red-400 uppercase tracking-widest">
              <span>EST. 2026</span><span>•</span><span>{language==='en'?'Bhopal':'भोपाल'}</span><span>•</span><span>Chitrakoot</span><span>•</span><span>MP</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5">
              <img src="/assets/founder.jpg" alt="editor" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#8B0000] shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-bold font-devanagari text-slate-900 dark:text-slate-100">{language==='en'?'Rajkumar Soni':'राजकुमार सोनी'}</p>
                <p className="text-[10px] text-[#8B0000] font-bold">{language==='en'?'Editor':'संपादक'} • {t.common.bhopalMP}</p>
                <p className="text-[9px] text-slate-500">8827294576</p>
              </div>
            </div>
            <button onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#8B0000] hover:text-white transition-colors" title={t.header.search}>
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="md:hidden mt-2 flex items-center justify-center gap-2 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-lg px-3 py-2">
          <img src="/assets/founder.jpg" alt="editor" className="w-8 h-8 rounded-full object-cover border-2 border-[#8B0000]" />
          <div className="text-left">
            <p className="text-xs font-bold font-devanagari">{language==='en'?'Rajkumar Soni (Editor)':'राजकुमार सोनी (संपादक)'}</p>
            <p className="text-[10px] text-slate-600">{t.common.bhopalMP} • 8827294576 / 8982635688</p>
          </div>
          <a href="mailto:chitrakootjyotinews@gmail.com" className="ml-auto text-[9px] bg-[#8B0000] text-white px-2 py-1 rounded font-bold">{language==='en'?'Email':'मेल करें'}</a>
        </div>
      </div>

      {/* PRIMARY NAV */}
      <nav className="bg-[#8B0000] dark:bg-[#7a0000] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center">
          <button onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} className="hidden lg:flex items-center gap-1.5 py-2.5 px-3 bg-[#5a0000] hover:bg-black font-bold text-xs uppercase tracking-wider shrink-0 mr-2 rounded">
            <Menu className="w-4 h-4" /> {t.header.वर्ग}
          </button>

          <div className={`flex items-center gap-1 overflow-x-auto no-scrollbar py-1 flex-1 font-bold text-[13px] sm:text-sm ${language==='hi'?'font-devanagari':''}`}>
            {mainCategories.map(cat => {
              const isActive = location.pathname === cat.path;
              return (
                <Link key={cat.name} to={cat.path} className={`px-2.5 sm:px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${isActive ? 'bg-white text-[#8B0000]' : 'hover:bg-white/20 text-white'}`}>
                  {cat.name}
                </Link>
              );
            })}

            <div className="relative hidden lg:block" onMouseEnter={() => setIsBhavishyaOpen(true)} onMouseLeave={() => setIsBhavishyaOpen(false)}>
              <button className={`px-3 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap ${isBhavishyaOpen ? 'bg-white text-[#8B0000]' : 'hover:bg-white/20'}`}>
                {t.nav.bhavishya} <ChevronDown className={`w-3 h-3 transition-transform ${isBhavishyaOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBhavishyaOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  <div className="bg-[#8B0000] text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> {t.nav.bhavishya}
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
            <Sparkles className="w-3 h-3" /> {t.nav.rashifal}
          </Link>
        </div>

        {isMobileNavOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-t border-[#5a0000] p-3 space-y-3 max-h-[70vh] overflow-y-auto">
            {/* Mobile language switch */}
            <div className="flex gap-2">
              <button onClick={()=>setLanguage('hi')} className={`flex-1 py-2 rounded-full font-bold border ${language==='hi'?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white border-slate-200'}`}>हिंदी</button>
              <button onClick={()=>setLanguage('en')} className={`flex-1 py-2 rounded-full font-bold border ${language==='en'?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white border-slate-200'}`}>English</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mainCategories.map(cat => (
                <Link key={cat.name} to={cat.path} onClick={() => setIsMobileNavOpen(false)} className={`p-3 rounded-lg text-center font-bold border ${location.pathname === cat.path ? 'bg-[#8B0000] text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200'} ${language==='hi'?'font-devanagari':''}`}>{cat.name}</Link>
              ))}
            </div>
            <div className="bg-amber-50 dark:bg-slate-800 rounded-lg p-3 border border-amber-200">
              <p className="font-black text-xs text-[#8B0000] mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> {t.nav.bhavishya}</p>
              <div className="grid grid-cols-2 gap-2">
                {bhavishyaItems.map(it => (
                  <Link key={it.path} to={it.path} onClick={() => setIsMobileNavOpen(false)} className="bg-white dark:bg-slate-700 border rounded-lg p-2 text-center text-xs font-bold">{it.name}</Link>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/epaper" onClick={() => setIsMobileNavOpen(false)} className="flex-1 bg-[#8B0000] text-white p-3 rounded-lg text-center font-bold text-sm">📰 {t.nav.epaper}</Link>
              <Link to="/contact" onClick={() => setIsMobileNavOpen(false)} className="flex-1 bg-slate-900 text-white p-3 rounded-lg text-center font-bold text-sm">{t.header.contact}</Link>
            </div>
          </div>
        )}
      </nav>

      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
    </header>
  );
};
