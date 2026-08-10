import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAuthors } from '../data/mockNewsData';
import { useNews } from '../context/NewsContext';
import { StoryCard } from '../components/news/StoryCard';
import { Twitter, Mail, MapPin, Award } from 'lucide-react';

export const AuthorDetailPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { articles } = useNews();

  const author = mockAuthors.find(a => a.id === authorId) || mockAuthors[0];

  const authorArticles = articles.filter(a =>
    a.author.id === author.id || a.author.name.toLowerCase() === author.name.toLowerCase()
  );

  const displayArticles = authorArticles.length > 0 ? authorArticles : articles.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Author Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-red-900 shadow-md shrink-0"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-serif-title font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100">
                {author.name}
              </h1>
              <p className="text-xs font-bold text-red-800 dark:text-red-400 font-sans-ui uppercase tracking-wider mt-0.5">
                {author.role} • {author.location || 'New Delhi Bureau'}
              </p>
            </div>

            {author.twitter && (
              <a
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full text-xs font-bold self-center sm:self-auto"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Follow {author.twitter}</span>
              </a>
            )}
          </div>

          <p className="font-serif-body text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed max-w-3xl">
            {author.bio}
          </p>
        </div>
      </div>

      {/* Author's Published Work */}
      <div className="pb-3 mb-6 border-b-2 border-red-900">
        <h2 className="font-serif-title font-black text-xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
          REPORTING & COLUMNS BY {author.name.toUpperCase()} ({displayArticles.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map(art => (
          <StoryCard key={art.id} article={art} variant="standard" />
        ))}
      </div>

    </div>
  );
};
