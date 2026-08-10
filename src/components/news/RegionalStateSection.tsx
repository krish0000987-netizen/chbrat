import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { StoryCard } from './StoryCard';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Building2 } from 'lucide-react';

const statesData = [
  { id: 'gujarat', name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
  { id: 'maharashtra', name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'] },
  { id: 'delhi', name: 'Delhi NCR', cities: ['New Delhi', 'Noida', 'Gurugram', 'Faridabad'] },
  { id: 'rajasthan', name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', cities: ['Lucknow', 'Varanasi', 'Kanpur', 'Noida'] },
  { id: 'karnataka', name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'] },
  { id: 'tamil-nadu', name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'] },
  { id: 'west-bengal', name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'] },
  { id: 'kerala', name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'] }
];

export const RegionalStateSection: React.FC = () => {
  const { articles } = useNews();
  const [activeStateId, setActiveStateId] = useState('gujarat');

  const selectedState = statesData.find(s => s.id === activeStateId) || statesData[0];

  // Filter articles matching this state or fallback to subset
  const stateArticles = articles.filter(a => 
    a.state?.toLowerCase() === selectedState.name.toLowerCase() ||
    a.city?.toLowerCase() === selectedState.name.toLowerCase()
  );

  const displayArticles = stateArticles.length > 0 ? stateArticles : articles.slice(2, 6);
  const mainStateArticle = displayArticles[0];
  const secondaryStateArticles = displayArticles.slice(1, 4);

  return (
    <section className="my-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b-2 border-red-900 gap-3 mb-5">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-red-800 dark:text-red-500" />
          <h2 className="font-serif-title font-black text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            STATE & CITY JOURNAL
          </h2>
        </div>

        <Link
          to={`/state/${selectedState.id}`}
          className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline flex items-center space-x-1"
        >
          <span>Open Full {selectedState.name} Bureau</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* State Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-3 border-b border-slate-200 dark:border-slate-800 mb-6">
        {statesData.map(st => (
          <button
            key={st.id}
            onClick={() => setActiveStateId(st.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeStateId === st.id
                ? 'bg-red-900 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {st.name}
          </button>
        ))}
      </div>

      {/* City Shortcuts Pill Bar */}
      <div className="flex items-center space-x-2 mb-6 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-bold text-slate-500 uppercase text-[10px] shrink-0 flex items-center space-x-1">
          <Building2 className="w-3.5 h-3.5 text-red-700" />
          <span>Major Cities:</span>
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {selectedState.cities.map(city => (
            <Link
              key={city}
              to={`/city/${selectedState.id}/${city.toLowerCase()}`}
              className="bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 hover:border-red-700 text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap transition-colors"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid: 1 Big Story on Left + 3 Secondary Stories on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {mainStateArticle && (
          <div className="lg:col-span-7">
            <StoryCard article={mainStateArticle} variant="lead" />
          </div>
        )}

        <div className="lg:col-span-5 space-y-2">
          <h3 className="font-sans-ui font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
            More From {selectedState.name}
          </h3>
          {secondaryStateArticles.map(art => (
            <StoryCard key={art.id} article={art} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};
