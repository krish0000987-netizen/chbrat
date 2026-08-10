import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { Article } from '../types';
import { PlusCircle, FileText, CheckCircle2, Trash2, Edit, AlertCircle, Sparkles, Lock, Key, LogIn, UserCheck } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { articles, addArticle, deleteArticle } = useNews();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [emailInput, setEmailInput] = useState('editor@bharatpost.in');
  const [passwordInput, setPasswordInput] = useState('editor2026');
  const [loginError, setLoginError] = useState('');

  const [title, setTitle] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [category, setCategory] = useState<Article['category']>('India');
  const [stateName, setStateName] = useState('Gujarat');
  const [cityName, setCityName] = useState('Ahmedabad');
  const [content, setContent] = useState('');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
  const [isLeadHero, setIsLeadHero] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() && passwordInput.trim()) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Please enter valid CMS credentials.');
    }
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      subheadline,
      content: content.split('\n\n').filter(p => p.trim().length > 0),
      category,
      state: stateName,
      city: cityName,
      publishedAt: new Date().toISOString(),
      readTimeMinutes: Math.ceil(content.split(' ').length / 150),
      heroImage,
      imageCaption: `Editorial photo for ${title}`,
      author: {
        id: 'auth-central',
        name: 'Central Bureau Correspondent',
        role: 'Senior Bureau Reporter',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Reporting on national policy and regional developments.'
      },
      tags: [category, stateName, 'Breaking'],
      viewsCount: 120,
      commentsCount: 0,
      sharesCount: 0,
      isLeadHero,
      isBreaking,
      isTrending,
      isDemo: true
    };

    addArticle(newArticle);
    setSuccessMsg('Article published successfully to the live newsroom feed!');
    setTitle('');
    setSubheadline('');
    setContent('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif-title font-black text-xl text-slate-900 dark:text-slate-100 uppercase tracking-tight">
              EDITORIAL CMS LOGIN
            </h1>
            <p className="text-xs text-slate-500 mt-1">Bharat Post Newsroom Publishing Console</p>
          </div>

          {/* Demo ID/Password Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-lg mb-6 text-xs text-amber-900 dark:text-amber-200 font-sans-ui">
            <p className="font-bold flex items-center space-x-1 mb-1">
              <Key className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>CMS DEMO CREDENTIALS:</span>
            </p>
            <div className="font-mono text-[11px] space-y-0.5">
              <p>Email: <span className="font-bold">editor@bharatpost.in</span></p>
              <p>Password: <span className="font-bold">editor2026</span></p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bureau Editor ID / Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-xs font-bold">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded-lg uppercase tracking-wider transition-colors shadow flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to CMS Console</span>
            </button>
          </form>

          <button
            onClick={() => setIsLoggedIn(true)}
            className="w-full mt-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
          >
            One-Click Quick Login as Chief Editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-red-500 font-bold text-xs uppercase tracking-widest block mb-1">
            EDITORIAL CMS DESK
          </span>
          <h1 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
            NEWSROOM PUBLISHING CONSOLE
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            Total Articles: <span className="text-amber-400 font-bold">{articles.length}</span>
          </div>
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700 flex items-center space-x-1">
            <UserCheck className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 font-bold">Chief Editor (editor@bharatpost.in)</span>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-900/80 hover:bg-red-800 text-white px-2.5 py-1.5 rounded font-sans font-bold uppercase text-[10px]"
          >
            Logout
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-900/20 border-2 border-green-600 rounded-xl text-green-700 dark:text-green-300 font-sans-ui text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Article Creation Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="font-serif-title font-bold text-lg text-slate-900 dark:text-slate-100 uppercase border-b-2 border-red-900 pb-2 mb-4 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-red-800" />
            <span>Publish New Article</span>
          </h2>

          <form onSubmit={handleCreateArticle} className="space-y-4 text-xs font-sans-ui">
            
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Headline Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter headline title..."
                className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-red-800"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subheadline / Excerpt</label>
              <textarea
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Brief summary sentence..."
                className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-red-800 h-16"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category Desk</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 font-bold"
                >
                  <option value="India">India</option>
                  <option value="Politics">Politics</option>
                  <option value="Business">Business</option>
                  <option value="Markets">Markets</option>
                  <option value="Technology">Technology</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Opinion">Opinion</option>
                  <option value="Explainers">Explainers</option>
                  <option value="Fact-Check">Fact-Check</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">State Bureau</label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 font-bold"
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City Desk</label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Article Content Paragraphs (Separate with double linebreaks) *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full article body text..."
                className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-red-800 h-40 font-serif-body"
                required
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
              <label className="flex items-center space-x-1.5 cursor-pointer font-bold">
                <input type="checkbox" checked={isLeadHero} onChange={(e) => setIsLeadHero(e.target.checked)} />
                <span>Lead Main Hero</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-red-800 dark:text-red-400">
                <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} />
                <span>Breaking News Banner</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer font-bold">
                <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />
                <span>Trending Rail</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded uppercase tracking-wider transition-colors shadow"
            >
              Publish to Live News Feed
            </button>
          </form>
        </div>

        {/* Existing Articles Table (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="font-serif-title font-bold text-lg text-slate-900 dark:text-slate-100 uppercase border-b-2 border-red-900 pb-2 mb-4">
            Published Feed ({articles.length})
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar">
            {articles.map((art) => (
              <div key={art.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="pr-2">
                  <span className="font-bold text-[10px] text-red-800 dark:text-red-400 uppercase">{art.category} • {art.state || 'National'}</span>
                  <p className="font-serif-title font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{art.title}</p>
                </div>

                <button
                  onClick={() => deleteArticle(art.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
