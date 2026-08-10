import React from 'react';
import { mockAuthors } from '../data/mockNewsData';
import { User, Twitter, Mail, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthorsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      <div className="pb-3 mb-6 border-b-2 border-red-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-red-800 dark:text-red-500" />
          <h1 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            EDITORIAL EDITORS & COLUMNISTS
          </h1>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
          OUR CORRESPONDENTS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAuthors.map((author) => (
          <div key={author.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-900"
                />
                <div>
                  <h2 className="font-serif-title font-bold text-lg text-slate-900 dark:text-slate-100">
                    {author.name}
                  </h2>
                  <p className="text-xs text-red-800 dark:text-red-400 font-sans-ui font-semibold">
                    {author.role}
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans-ui">
                    Bureau: {author.location || 'New Delhi'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-serif-body line-clamp-3">
                {author.bio}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline flex items-center space-x-1 font-sans-ui"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>{author.twitter}</span>
                </a>
              )}

              <Link
                to={`/author/${author.id}`}
                className="text-red-800 dark:text-red-400 hover:underline font-bold font-sans-ui flex items-center space-x-1 ml-auto"
              >
                <span>Read Articles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
