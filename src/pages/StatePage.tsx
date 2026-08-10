import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { StoryCard } from '../components/news/StoryCard';
import { MapPin, Building2, ChevronRight, Globe } from 'lucide-react';

const stateDetailsMap: Record<string, { name: string; capital: string; cities: string[]; description: string }> = {
  gujarat: {
    name: 'Gujarat',
    capital: 'Gandhinagar',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
    description: 'Special coverage on Gujarat industrial development, ports, GIFT City, semiconductor hubs, state elections, and local civic governance.'
  },
  maharashtra: {
    name: 'Maharashtra',
    capital: 'Mumbai',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Chhatrapati Sambhajinagar'],
    description: 'Reporting from Mumbai financial center, Pune technology corridor, Maharashtra legislature, local infrastructure projects and Bollywood.'
  },
  delhi: {
    name: 'Delhi NCR',
    capital: 'New Delhi',
    cities: ['New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'],
    description: 'National capital news desk reporting on central government decisions, Parliament proceedings, NCR air quality, and civic affairs.'
  },
  rajasthan: {
    name: 'Rajasthan',
    capital: 'Jaipur',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    description: 'Journalism on Rajasthan tourism economy, solar power projects, heritage preservation, state welfare policies, and local crime reports.'
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    cities: ['Lucknow', 'Varanasi', 'Kanpur', 'Noida', 'Agra', 'Prayagraj'],
    description: 'Coverage on UP expressway corridors, law and order, industrial investments, religious tourism, and local civic issues.'
  },
  karnataka: {
    name: 'Karnataka',
    capital: 'Bengaluru',
    cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
    description: 'Bengaluru Silicon Valley tech updates, Karnataka state politics, coastal economy, water management, and urban infrastructure.'
  }
};

export const StatePage: React.FC = () => {
  const { stateId } = useParams<{ stateId: string }>();
  const { articles } = useNews();

  const activeId = stateId?.toLowerCase() || 'gujarat';
  const info = stateDetailsMap[activeId] || {
    name: activeId.toUpperCase(),
    capital: 'State Capital',
    cities: ['Major City 1', 'Major City 2'],
    description: `State bureau news and regional investigative reporting.`
  };

  const stateArticles = articles.filter(a =>
    a.state?.toLowerCase() === info.name.toLowerCase() ||
    a.city?.toLowerCase() === info.name.toLowerCase() ||
    a.content.some(c => c.toLowerCase().includes(info.name.toLowerCase()))
  );

  const displayArticles = stateArticles.length > 0 ? stateArticles : articles.slice(0, 6);
  const lead = displayArticles[0];
  const rest = displayArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* State Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xl mb-8 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-red-500 font-bold text-xs uppercase tracking-widest mb-1">
              <MapPin className="w-4 h-4" />
              <span>REGIONAL JOURNALISM BUREAU</span>
            </div>
            <h1 className="font-serif-title font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
              {info.name} STATE EDITION
            </h1>
            <p className="text-xs text-slate-400 mt-1">Capital: {info.capital} • Correspondent Bureau</p>
          </div>

          <Link to="/" className="text-xs font-bold text-amber-400 hover:underline flex items-center">
            <span>All India Front Page</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-sm text-slate-300 font-serif-body mt-4 max-w-3xl">
          {info.description}
        </p>

        {/* Cities Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center space-x-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase shrink-0 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-red-400" />
            <span>City Desks:</span>
          </span>
          {info.cities.map(c => (
            <Link
              key={c}
              to={`/city/${activeId}/${c.toLowerCase()}`}
              className="bg-slate-800 hover:bg-red-800 text-white text-xs px-3 py-1 rounded border border-slate-700 whitespace-nowrap transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-8">
          {lead && (
            <div>
              <StoryCard article={lead} variant="lead" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            {rest.map(art => (
              <StoryCard key={art.id} article={art} variant="standard" />
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-serif-title font-bold text-xs uppercase text-red-800 dark:text-red-400 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
              OTHER REGIONAL BUREAUS
            </h3>
            <ul className="space-y-2 text-xs font-sans-ui font-semibold">
              <li><Link to="/state/gujarat" className="hover:text-red-800 block p-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">Gujarat Newsroom</Link></li>
              <li><Link to="/state/maharashtra" className="hover:text-red-800 block p-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">Maharashtra & Mumbai</Link></li>
              <li><Link to="/state/delhi" className="hover:text-red-800 block p-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">Delhi NCR Edition</Link></li>
              <li><Link to="/state/rajasthan" className="hover:text-red-800 block p-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">Rajasthan Bureau</Link></li>
              <li><Link to="/state/uttar-pradesh" className="hover:text-red-800 block p-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">Uttar Pradesh Desk</Link></li>
              <li><Link to="/state/karnataka" className="hover:text-red-800 block p-1.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">Karnataka & Bengaluru</Link></li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
};
