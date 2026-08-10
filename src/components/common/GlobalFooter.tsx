import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, ShieldCheck, Award, Globe, ArrowUpRight } from 'lucide-react';

export const GlobalFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B0F17] text-slate-300 font-sans-ui border-t-4 border-red-900 pt-12 pb-20 md:pb-12 px-4 no-print">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Branding Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-slate-800 gap-6">
          <div>
            <h2 className="font-serif-title font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
              THE INDIAN RECORD
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-lg font-serif-body italic">
              India’s premier independent digital publication covering national affairs, market intelligence, geopolitics, and cultural perspectives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/subscribe"
              className="bg-red-800 hover:bg-red-900 text-white font-bold px-4 py-2 rounded text-xs uppercase tracking-wider transition-colors"
            >
              Get Digital Pass
            </Link>
            <Link
              to="/epaper"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>Read E-Paper</span>
            </Link>
          </div>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 border-b border-slate-800 text-xs">
          
          {/* Col 1: News Categories */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-500 mb-3 border-b border-slate-800 pb-1">
              News Desks
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/india" className="hover:text-white transition-colors">National News</Link></li>
              <li><Link to="/politics" className="hover:text-white transition-colors">Politics & Parliament</Link></li>
              <li><Link to="/business" className="hover:text-white transition-colors">Business & Economy</Link></li>
              <li><Link to="/markets" className="hover:text-white transition-colors">Markets & Sensex</Link></li>
              <li><Link to="/world" className="hover:text-white transition-colors">World & Geopolitics</Link></li>
              <li><Link to="/technology" className="hover:text-white transition-colors">Tech & Generative AI</Link></li>
              <li><Link to="/startups" className="hover:text-white transition-colors">Indian Startups</Link></li>
            </ul>
          </div>

          {/* Col 2: Sports & Culture */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-500 mb-3 border-b border-slate-800 pb-1">
              Sports & Life
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/cricket" className="hover:text-white transition-colors">Cricket Test & IPL</Link></li>
              <li><Link to="/sports" className="hover:text-white transition-colors">Olympic Sports</Link></li>
              <li><Link to="/bollywood" className="hover:text-white transition-colors">Bollywood & Cinema</Link></li>
              <li><Link to="/lifestyle" className="hover:text-white transition-colors">Lifestyle & Wellness</Link></li>
              <li><Link to="/travel" className="hover:text-white transition-colors">Travel & Heritage</Link></li>
              <li><Link to="/automobile" className="hover:text-white transition-colors">Automobile & EVs</Link></li>
            </ul>
          </div>

          {/* Col 3: Opinion & Formats */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-500 mb-3 border-b border-slate-800 pb-1">
              Multimedia & Formats
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/opinion" className="hover:text-white transition-colors">Editorial Columns</Link></li>
              <li><Link to="/explained" className="hover:text-white transition-colors">Explainers & FAQs</Link></li>
              <li><Link to="/fact-check" className="hover:text-white transition-colors">Fact Check Verification</Link></li>
              <li><Link to="/videos" className="hover:text-white transition-colors">Video News Studio</Link></li>
              <li><Link to="/photos" className="hover:text-white transition-colors">Photo Journalism</Link></li>
              <li><Link to="/web-stories" className="hover:text-white transition-colors">Web Stories</Link></li>
              <li><Link to="/podcasts" className="hover:text-white transition-colors">Audio Podcasts</Link></li>
            </ul>
          </div>

          {/* Col 4: States & Regional */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-500 mb-3 border-b border-slate-800 pb-1">
              Regional Bureaus
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/state/gujarat" className="hover:text-white transition-colors">Gujarat (Ahmedabad)</Link></li>
              <li><Link to="/state/maharashtra" className="hover:text-white transition-colors">Maharashtra (Mumbai)</Link></li>
              <li><Link to="/state/delhi" className="hover:text-white transition-colors">Delhi NCR</Link></li>
              <li><Link to="/state/karnataka" className="hover:text-white transition-colors">Karnataka (Bengaluru)</Link></li>
              <li><Link to="/state/rajasthan" className="hover:text-white transition-colors">Rajasthan (Jaipur)</Link></li>
              <li><Link to="/state/uttar-pradesh" className="hover:text-white transition-colors">Uttar Pradesh (Lucknow)</Link></li>
              <li><Link to="/state/west-bengal" className="hover:text-white transition-colors">West Bengal (Kolkata)</Link></li>
            </ul>
          </div>

          {/* Col 5: Company & Ethics */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-red-500 mb-3 border-b border-slate-800 pb-1">
              Company & Standards
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/editorial-policy" className="hover:text-white transition-colors">Editorial Guidelines</Link></li>
              <li><Link to="/ethics" className="hover:text-white transition-colors">Code of Ethics</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Newsroom Careers</Link></li>
              <li><Link to="/advertise" className="hover:text-white transition-colors">Advertise With Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Bureau</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Cookie Terms</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Certified Member of International Press Telecommunications & Digital Media Trust</span>
          </div>

          <div className="text-center md:text-right">
            <p>© 2026 The Indian Record Media Group. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Demonstration news platform created for showcase. All fictional content is explicitly labeled as DEMO NEWS.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
