import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { X, TrendingUp, MapPin, ChevronRight, Bookmark } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory?: string;
}

const indianStates = [
  { name: 'Delhi', cities: ['New Delhi', 'NCR'] },
  { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
  { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane'] },
  { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur'] },
  { name: 'Uttar Pradesh', cities: ['Lucknow', 'Varanasi', 'Kanpur', 'Noida'] },
  { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubballi'] },
  { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
  { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Siliguri'] },
  { name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'] }
];

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const { articles } = useNews();
  if (!isOpen) return null;

  const topStories = articles.slice(0, 4);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center animate-fade-in overflow-y-auto p-2 sm:p-4 md:pt-20">
      <div className="bg-[#FAF9F6] dark:bg-[#0F172A] text-[#111827] dark:text-slate-100 w-full max-w-7xl h-fit max-h-[90vh] overflow-y-auto border-t-4 border-b-4 border-red-800 shadow-2xl p-5 sm:p-6 lg:p-8 rounded-xl my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6 sticky top-0 bg-[#FAF9F6] dark:bg-[#0F172A] z-10 pt-1">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="font-serif-title font-black text-lg sm:text-xl tracking-tight text-red-900 dark:text-red-500">
              ALL SECTIONS & DESKS
            </span>
            <span className="text-[10px] sm:text-xs bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold px-2 py-0.5 rounded uppercase">
              BHARAT POST INDEX
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-red-900 hover:text-white transition-colors"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Column 1: Core Desks */}
          <div>
            <h4 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-red-900 dark:text-red-400 mb-3 border-b border-red-800/30 pb-1">
              National & Politics
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/india" onClick={onClose} className="hover:text-red-700 font-medium">India News</Link></li>
              <li><Link to="/politics" onClick={onClose} className="hover:text-red-700 font-medium">Politics & Parliament</Link></li>
              <li><Link to="/category/Elections" onClick={onClose} className="hover:text-red-700">Election Watch</Link></li>
              <li><Link to="/opinion" onClick={onClose} className="hover:text-red-700">Opinion & Columns</Link></li>
              <li><Link to="/explained" onClick={onClose} className="hover:text-red-700">Explainers & Analysis</Link></li>
              <li><Link to="/fact-check" onClick={onClose} className="hover:text-red-700">Fact Check Desk</Link></li>
            </ul>
          </div>

          {/* Column 2: Financial & Tech */}
          <div>
            <h4 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-red-900 dark:text-red-400 mb-3 border-b border-red-800/30 pb-1">
              Business & Economy
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/business" onClick={onClose} className="hover:text-red-700 font-medium">Business Headlines</Link></li>
              <li><Link to="/markets" onClick={onClose} className="hover:text-red-700 font-medium">Stock Markets & RBI</Link></li>
              <li><Link to="/technology" onClick={onClose} className="hover:text-red-700">Tech & AI Innovation</Link></li>
              <li><Link to="/startups" onClick={onClose} className="hover:text-red-700">Startups & Unicorns</Link></li>
              <li><Link to="/automobile" onClick={onClose} className="hover:text-red-700">Automobile & EVs</Link></li>
            </ul>
          </div>

          {/* Column 3: Sports & Culture */}
          <div>
            <h4 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-red-900 dark:text-red-400 mb-3 border-b border-red-800/30 pb-1">
              Sports & Entertainment
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cricket" onClick={onClose} className="hover:text-red-700 font-medium">Cricket Central</Link></li>
              <li><Link to="/sports" onClick={onClose} className="hover:text-red-700">Olympic & World Sports</Link></li>
              <li><Link to="/bollywood" onClick={onClose} className="hover:text-red-700 font-medium">Bollywood & Cinema</Link></li>
              <li><Link to="/lifestyle" onClick={onClose} className="hover:text-red-700">Lifestyle & Culture</Link></li>
              <li><Link to="/travel" onClick={onClose} className="hover:text-red-700">Travel & Heritage</Link></li>
            </ul>
          </div>

          {/* Column 4: States & Cities */}
          <div>
            <h4 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-red-900 dark:text-red-400 mb-3 border-b border-red-800/30 pb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-700" />
              <span>State & City Bureau</span>
            </h4>
            <div className="space-y-1 text-xs">
              {indianStates.map(st => (
                <div key={st.name} className="py-1 border-b border-slate-200 dark:border-slate-800/60">
                  <Link to={`/state/${st.name.toLowerCase()}`} onClick={onClose} className="font-semibold hover:text-red-700 block">
                    {st.name}
                  </Link>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {st.cities.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 5: Featured Top Stories */}
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-red-900 dark:text-red-400 mb-3 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-red-700" />
              <span>Top Headlines</span>
            </h4>
            <div className="space-y-3">
              {topStories.map(art => (
                <Link
                  key={art.id}
                  to={`/article/${art.id}`}
                  onClick={onClose}
                  className="group block"
                >
                  <p className="text-xs font-serif-title font-semibold group-hover:text-red-800 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
                    {art.title}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    {art.category} • {art.readTimeMinutes}m read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
