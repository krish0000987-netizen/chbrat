import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { StoryCard } from '../components/news/StoryCard';
import { Building2, ChevronRight, MapPin } from 'lucide-react';

export const CityPage: React.FC = () => {
  const { stateId, cityName } = useParams<{ stateId: string; cityName: string }>();
  const { articles } = useNews();

  const formattedCity = cityName ? cityName.replace('-', ' ') : 'City';

  const cityArticles = articles.filter(a =>
    a.city?.toLowerCase() === formattedCity.toLowerCase() ||
    a.content.some(c => c.toLowerCase().includes(formattedCity.toLowerCase()))
  );

  const displayArticles = cityArticles.length > 0 ? cityArticles : articles.slice(1, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      <div className="pb-4 mb-6 border-b-2 border-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>LOCAL CIVIC & METRO BUREAU</span>
          </div>
          <h1 className="font-serif-title font-black text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 uppercase tracking-tight">
            {formattedCity} CITY NEWS
          </h1>
        </div>

        <Link to={`/state/${stateId || 'gujarat'}`} className="text-xs font-bold text-red-800 dark:text-red-400 hover:underline flex items-center">
          <span>State Bureau Overview</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map(art => (
          <StoryCard key={art.id} article={art} variant="standard" />
        ))}
      </div>
    </div>
  );
};
