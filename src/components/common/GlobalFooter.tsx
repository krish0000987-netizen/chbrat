import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { getT, languageOptions } from '../../lib/i18n';

export const GlobalFooter: React.FC = () => {
  const { language, setLanguage } = useNews();
  const t = getT(language as any);
  const isEn = language === 'en';
  return (
    <footer className="bg-[#1a0000] text-slate-200 font-sans-ui border-t-4 border-[#8B0000] pt-8 pb-20 md:pb-8 px-3 sm:px-4 no-print">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.jpg" alt="चाणक्य भारत लोगो" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-amber-400 bg-white shadow-md shrink-0" />
              <div>
                <h2 className={`font-black text-2xl sm:text-3xl text-white leading-none ${isEn?'':'font-devanagari'}`}>{isEn?'Chanakya Bharat':'चाणक्य भारत'}</h2>
                <p className="text-xs text-amber-300 font-bold tracking-widest uppercase">खोजी समाचार • {isEn?'Kushinagar • Uttar Pradesh':'कुशीनगर • उत्तर प्रदेश'} • 9919529245</p>
              </div>
            </div>
            <p className={`text-sm text-slate-300 mt-3 leading-relaxed max-w-2xl ${isEn?'':'font-devanagari'}`}>
              {t.footer.tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex flex-wrap gap-1.5 bg-white/10 rounded-full p-1">
                {languageOptions.map(o=> (
                  <button key={o.code} onClick={()=>setLanguage(o.code as any)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${language===o.code?'bg-white text-[#8B0000]':'text-white hover:bg-white/20'}`}>{o.nativeLabel}</button>
                ))}
              </div>
              <Link to="/epaper" className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1">
                <Newspaper className="w-4 h-4" /> {isEn?'Read E-Paper':'ई-पेपर पढ़ें'}
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs">{t.footer.about}</Link>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-xl max-w-sm w-full">
            <h3 className="font-black text-base text-[#8B0000]">खोजी समाचार • चाणक्य भारत</h3>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-[#8B0000]" /> {(t.common as any).kushinagarUP || (t.common as any).bhopalMP} • 9919529245</p>
            <div className="mt-3 space-y-1.5 text-xs">
              <a href="tel:+919919529245" className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 hover:bg-amber-50"><Phone className="w-3.5 h-3.5 text-[#8B0000]" /> 9919529245</a>
              <div className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 text-slate-700"><MapPin className="w-3.5 h-3.5 text-[#8B0000]" /> कुशीनगर (उत्तर प्रदेश)</div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">{isEn?'For news / ads contact':'संपर्क • विज्ञापन • समाचार हेतु संपर्क करें'}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {languageOptions.map(o=> (
                <button key={o.code} onClick={()=>setLanguage(o.code as any)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${language===o.code?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white border-slate-200 text-slate-700'}`}>{o.nativeLabel}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-white/10 text-xs">
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 ${isEn?'':'font-devanagari'}`}>{t.footer.mainNews}</h4>
            <ul className={`space-y-1.5 text-slate-300 ${isEn?'':'font-devanagari'}`}>
              <li><Link to="/desh-videsh" className="hover:text-white">{t.nav.deshVidesh}</Link></li>
              <li><Link to="/pradesh" className="hover:text-white">{t.nav.pradesh}</Link></li>
              <li><Link to="/khel" className="hover:text-white">{t.nav.khel}</Link></li>
              <li><Link to="/dharm" className="hover:text-white">{t.nav.dharm}</Link></li>
              <li><Link to="/manoranjan" className="hover:text-white">{t.nav.manoranjan}</Link></li>
              <li><Link to="/vichar" className="hover:text-white">{t.nav.vichar}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 ${isEn?'':'font-devanagari'}`}>{t.footer.otherSections}</h4>
            <ul className={`space-y-1.5 text-slate-300 ${isEn?'':'font-devanagari'}`}>
              <li><Link to="/lifestyle-health" className="hover:text-white">{t.nav.lifestyle}</Link></li>
              <li><Link to="/tech" className="hover:text-white">{t.nav.tech}</Link></li>
              <li><Link to="/videos" className="hover:text-white">{isEn?'Videos':'वीडियो न्यूज़'}</Link></li>
              <li><Link to="/photos" className="hover:text-white">{isEn?'Photos':'फोटो गैलरी'}</Link></li>
              <li><Link to="/epaper" className="hover:text-white">{t.nav.epaper}</Link></li>
              <li><Link to="/live" className="hover:text-white">{isEn?'Live':'लाइव अपडेट'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 ${isEn?'':'font-devanagari'}`}>{t.nav.bhavishya} ✨</h4>
            <ul className={`space-y-1.5 text-slate-300 ${isEn?'':'font-devanagari'}`}>
              <li><Link to="/bhavishya/bhavishyavani" className="hover:text-white">{t.nav.bhavishyavani}</Link></li>
              <li><Link to="/bhavishya/rashifal" className="hover:text-white">{t.nav.rashifal}</Link></li>
              <li><Link to="/bhavishya/panchang" className="hover:text-white">{t.nav.panchang}</Link></li>
              <li><Link to="/bhavishya/vrat-tyohar" className="hover:text-white">{t.nav.vrat}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1">{t.footer.company}</h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link to="/about" className="hover:text-white">{t.footer.about}</Link></li>
              <li><Link to="/contact" className="hover:text-white">{t.footer.contact}</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/advertise" className="hover:text-white">{t.footer.advertise}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className={`flex items-center gap-1 ${isEn?'':'font-devanagari'}`}>© 2026 {isEn?'Chanakya Bharat':'दैनिक चाणक्य भारत'} • {isEn?'All rights reserved':'सर्वाधिकार सुरक्षित'} • <Heart className="w-3 h-3 text-red-500 inline" /> {isEn?'Published from Kushinagar':'कुशीनगर से प्रकाशित'}</p>
          <p className="text-[10px] text-slate-500 text-center">RNI No. • Kushinagar • Design: Chanakya Bharat Digital Desk</p>
        </div>
      </div>
    </footer>
  );
};
