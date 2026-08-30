import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const GlobalFooter: React.FC = () => {
  return (
    <footer className="bg-[#1a0000] text-slate-200 font-sans-ui border-t-4 border-[#8B0000] pt-8 pb-20 md:pb-8 px-3 sm:px-4 no-print">
      <div className="max-w-7xl mx-auto">
        {/* Top Branding + Contact */}
        <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.jpg" alt="लोगो" className="h-10 sm:h-12 w-auto rounded border border-white/20 bg-white" />
              <div>
                <h2 className="font-devanagari font-black text-2xl sm:text-3xl text-white leading-none">चित्रकूट ज्योति</h2>
                <p className="text-xs text-amber-300 font-bold tracking-widest uppercase">दैनिक • भोपाल • मध्यप्रदेश</p>
              </div>
            </div>
            <p className="font-devanagari text-sm text-slate-300 mt-3 leading-relaxed max-w-2xl">
              दैनिक <span className="text-white font-bold">चित्रकूट ज्योति</span> न्यूज पेपर एवं वेबपोर्टल में वैचारिक, सकारात्मक, देश-दुनिया, क्राइम, सायबर अपराध, धर्म, ज्योतिष, वास्तु, कैरियर, लाइफस्टाइल सहित विविध विधाओं की ताजा खबरें मिलेंगी।
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/epaper" className="bg-[#8B0000] hover:bg-red-800 text-white font-bold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1">
                <Newspaper className="w-4 h-4" /> ई-पेपर पढ़ें
              </Link>
              <Link to="/about" className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-full text-xs">हमारे बारे में</Link>
            </div>
          </div>

          {/* Contact Card - Snehlata Soni */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-xl max-w-sm w-full">
            <div className="flex gap-3">
              <img src="/assets/founder.jpg" alt="स्नेहलता सोनी" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-[#8B0000] shadow" />
              <div className="flex-1 min-w-0">
                <h3 className="font-devanagari font-black text-base leading-none">स्नेहलता सोनी</h3>
                <p className="text-xs font-bold text-[#8B0000] bg-amber-100 inline-block px-2 py-0.5 rounded-full mt-1">संपादक</p>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> भोपाल (मप्र)</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <a href="tel:+918827294576" className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 hover:bg-amber-50"><Phone className="w-3.5 h-3.5 text-[#8B0000]" /> 8827294576, 8982635688</a>
              <a href="mailto:chitrakootjyotinews@gmail.com" className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 hover:bg-amber-50 break-all"><Mail className="w-3.5 h-3.5 text-[#8B0000]" /> chitrakootjyotinews@gmail.com</a>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center font-devanagari">संपर्क • विज्ञापन • समाचार हेतु संपर्क करें</p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-white/10 text-xs">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 font-devanagari">मुख्य समाचार</h4>
            <ul className="space-y-1.5 text-slate-300 font-devanagari">
              <li><Link to="/desh-videsh" className="hover:text-white">देश-विदेश</Link></li>
              <li><Link to="/pradesh" className="hover:text-white">प्रदेश</Link></li>
              <li><Link to="/khel" className="hover:text-white">खेल</Link></li>
              <li><Link to="/dharm" className="hover:text-white">धर्म</Link></li>
              <li><Link to="/manoranjan" className="hover:text-white">मनोरंजन</Link></li>
              <li><Link to="/vichar" className="hover:text-white">विचार</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 font-devanagari">अन्य वर्ग</h4>
            <ul className="space-y-1.5 text-slate-300 font-devanagari">
              <li><Link to="/lifestyle-health" className="hover:text-white">लाइफस्टाइल & हेल्थ</Link></li>
              <li><Link to="/tech" className="hover:text-white">टेक</Link></li>
              <li><Link to="/videos" className="hover:text-white">वीडियो न्यूज़</Link></li>
              <li><Link to="/photos" className="hover:text-white">फोटो गैलरी</Link></li>
              <li><Link to="/epaper" className="hover:text-white">ई-पेपर</Link></li>
              <li><Link to="/live" className="hover:text-white">लाइव अपडेट</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1 font-devanagari">भविष्य जिज्ञासा ✨</h4>
            <ul className="space-y-1.5 text-slate-300 font-devanagari">
              <li><Link to="/bhavishya/bhavishyavani" className="hover:text-white">भविष्यवाणी</Link></li>
              <li><Link to="/bhavishya/rashifal" className="hover:text-white">दैनिक राशिफल</Link></li>
              <li><Link to="/bhavishya/panchang" className="hover:text-white">दैनिक पंचांग</Link></li>
              <li><Link to="/bhavishya/vrat-tyohar" className="hover:text-white">व्रत-त्यौहार</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-3 border-b border-white/10 pb-1">कंपनी</h4>
            <ul className="space-y-1.5 text-slate-300">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">संपर्क करें</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/advertise" className="hover:text-white">विज्ञापन</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="font-devanagari flex items-center gap-1">© 2026 दैनिक चित्रकूट ज्योति • सर्वाधिकार सुरक्षित • <Heart className="w-3 h-3 text-red-500 inline" /> भोपाल से प्रकाशित</p>
          <p className="text-[10px] text-slate-500 text-center">RNI No. • 12 संसद मार्ग, भोपाल • डिज़ाइन : चित्रकूट ज्योति डिजिटल डेस्क</p>
        </div>
      </div>
    </footer>
  );
};
