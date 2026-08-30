import React from 'react';
import { HeroNewsroom } from '../components/news/HeroNewsroom';
import { TopStoriesRail } from '../components/news/TopStoriesRail';
import { RegionalStateSection } from '../components/news/RegionalStateSection';
import { StoryCard } from '../components/news/StoryCard';
import { NewsletterCard } from '../components/common/NewsletterCard';
import { AdvertisementSlot } from '../components/common/AdvertisementSlot';
import { useNews } from '../context/NewsContext';
import { Link } from 'react-router-dom';
import { Video, Camera, CheckCircle2, ChevronRight, Activity, Sparkles } from 'lucide-react';
import { mockVideoItems, mockFactChecks } from '../data/mockNewsData';

export const HomePage: React.FC = () => {
  const { articles } = useNews();
  const pradeshArticles = articles.filter(a => a.category === 'State News' || a.category === 'City News').slice(0, 4);
  const khelArticles = articles.filter(a => a.category === 'Cricket' || a.category === 'Sports').slice(0, 4);
  const manoranjanArticles = articles.filter(a => a.category === 'Entertainment').slice(0, 4);
  const vicharArticles = articles.filter(a => a.category === 'Opinion' || a.category === 'Explainers').slice(0, 4);
  const techArticles = articles.filter(a => a.category === 'Technology').slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      {/* Hero */}
      <HeroNewsroom />

      <AdvertisementSlot type="billboard" />

      <TopStoriesRail />

      {/* प्रदेश - MP focus */}
      <section className="my-6 sm:my-8">
        <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-[#8B0000]">
          <h2 className="font-devanagari font-black text-lg sm:text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#8B0000] rounded-full"></span> प्रदेश • मध्यप्रदेश / चित्रकूट
          </h2>
          <Link to="/pradesh" className="text-xs font-bold text-[#8B0000] flex items-center gap-1">और देखें <ChevronRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pradeshArticles.length ? pradeshArticles.map(art => <StoryCard key={art.id} article={art} variant="standard" />) : articles.slice(0,4).map(a => <StoryCard key={a.id} article={a} variant="standard" />)}
        </div>
      </section>

      <RegionalStateSection />

      {/* भविष्य जिज्ञासा strip */}
      <section className="my-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="font-devanagari font-black text-base sm:text-lg text-[#8B0000] flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-600" /> भविष्य जिज्ञासा</h2>
          <div className="flex gap-1.5 text-xs font-bold font-devanagari">
            <Link to="/bhavishya/rashifal" className="bg-white border px-3 py-1 rounded-full hover:bg-amber-100">राशिफल</Link>
            <Link to="/bhavishya/panchang" className="bg-white border px-3 py-1 rounded-full hover:bg-amber-100">पंचांग</Link>
            <Link to="/bhavishya/vrat-tyohar" className="bg-[#8B0000] text-white px-3 py-1 rounded-full">व्रत-त्यौहार</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-devanagari">
          <Link to="/bhavishya/rashifal" className="bg-white dark:bg-slate-800 p-3 rounded-lg border text-center hover:shadow">
            <p className="text-lg">♈</p><p className="font-bold">दैनिक राशिफल</p><p className="text-[11px] text-slate-500">12 राशियों का फल</p>
          </Link>
          <Link to="/bhavishya/panchang" className="bg-white dark:bg-slate-800 p-3 rounded-lg border text-center hover:shadow">
            <p className="text-lg">📅</p><p className="font-bold">आज का पंचांग</p><p className="text-[11px] text-slate-500">तिथि • मुहूर्त</p>
          </Link>
          <Link to="/bhavishya/bhavishyavani" className="bg-white dark:bg-slate-800 p-3 rounded-lg border text-center hover:shadow">
            <p className="text-lg">🔮</p><p className="font-bold">भविष्यवाणी</p><p className="text-[11px] text-slate-500">साप्ताहिक</p>
          </Link>
          <Link to="/bhavishya/vrat-tyohar" className="bg-white dark:bg-slate-800 p-3 rounded-lg border text-center hover:shadow">
            <p className="text-lg">🪔</p><p className="font-bold">व्रत-त्यौहार</p><p className="text-[11px] text-slate-500">आगामी पर्व</p>
          </Link>
        </div>
      </section>

      {/* टेक */}
      <section className="my-6 bg-slate-900 text-white p-4 rounded-xl">
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10">
          <h2 className="font-devanagari font-black text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" /> टेक डेस्क</h2>
          <Link to="/tech" className="text-xs font-bold text-amber-300">और देखें <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techArticles.concat(articles.filter(a=>a.category==='Technology').slice(0,2)).slice(0,4).map(art => <StoryCard key={art.id} article={art} variant="standard" />)}
        </div>
      </section>

      {/* खेल */}
      <section className="my-6">
        <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-[#8B0000]">
          <h2 className="font-devanagari font-black text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-[#8B0000]" /> खेल</h2>
          <Link to="/khel" className="text-xs font-bold text-[#8B0000]">स्कोर देखें <ChevronRight className="w-3.5 h-3.5 inline" /></Link>
        </div>
        <div className="bg-[#111] text-white p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 text-sm">
          <div><span className="bg-[#8B0000] px-2 py-0.5 rounded text-xs font-bold animate-pulse">LIVE</span> <span className="font-bold ml-2">भारत vs ऑस्ट्रेलिया — 5वां टेस्ट</span><p className="text-xs text-slate-400">Day 5 • भारत 84 रन से जीता</p></div>
          <div className="font-mono text-xs bg-white/10 px-3 py-1 rounded">IND 345 & 268/8 • AUS 345 & 183</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {khelArticles.map(art => <StoryCard key={art.id} article={art} variant="standard" />)}
        </div>
      </section>

      {/* मनोरंजन + धर्म */}
      <section className="my-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#8B0000]">
            <h2 className="font-devanagari font-black">मनोरंजन</h2><Link to="/manoranjan" className="text-xs font-bold text-[#8B0000]">और →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {manoranjanArticles.slice(0,2).map(a => <StoryCard key={a.id} article={a} variant="standard" />)}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#8B0000]">
            <h2 className="font-devanagari font-black">धर्म • ज्योतिष</h2><Link to="/dharm" className="text-xs font-bold text-[#8B0000]">और →</Link>
          </div>
          <div className="bg-amber-50 dark:bg-slate-900 border border-amber-200 rounded-xl p-4">
            <p className="font-devanagari font-bold text-[#8B0000]">आज का विचार</p>
            <p className="font-devanagari text-sm mt-1 leading-relaxed">“धर्म की ज्योति से ही जीवन में प्रकाश आता है — चित्रकूट धाम में प्रतिदिन भक्तों का जनसैलाब।”</p>
            <Link to="/dharm" className="text-xs font-bold text-[#8B0000] mt-2 inline-block">धर्म खबरें पढ़ें →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {articles.filter(a=>a.category==='Health').slice(0,2).map(a => <StoryCard key={a.id} article={a} variant="standard" />)}
          </div>
        </div>
      </section>

      {/* वीडियो */}
      <section className="my-6 bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border">
        <div className="flex items-center justify-between pb-2 mb-4 border-b">
          <h2 className="font-devanagari font-black flex items-center gap-2"><Video className="w-5 h-5 text-[#8B0000]" /> वीडियो न्यूज़</h2>
          <Link to="/videos" className="text-xs font-bold text-[#8B0000]">सभी वीडियो</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockVideoItems.map(vid => (
            <div key={vid.id} className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden border group">
              <div className="relative aspect-video bg-black"><img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/30 flex items-center justify-center"><div className="w-10 h-10 rounded-full bg-[#8B0000]/90 text-white flex items-center justify-center">▶</div></div><span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{vid.duration}</span></div>
              <div className="p-3"><p className="font-devanagari font-bold text-sm line-clamp-2">{vid.title.replace('[DEMO VIDEO]','')}</p><p className="text-xs text-slate-500 line-clamp-1">{vid.description}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* विचार + फैक्ट चेक */}
      <section className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-4 rounded-xl border">
          <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#8B0000]">
            <h2 className="font-devanagari font-black">विचार • संपादकीय</h2><Link to="/vichar" className="text-xs font-bold text-[#8B0000]">सभी लेख</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{vicharArticles.map(a => <StoryCard key={a.id} article={a} variant="standard" />)}</div>
        </div>
        <div className="lg:col-span-4 bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <h3 className="font-devanagari font-black text-sm flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#8B0000]" /> फैक्ट चेक</h3>
          {mockFactChecks.map(fc => (
            <div key={fc.id} className="bg-white p-3 rounded-lg border mt-3">
              <span className="bg-[#8B0000] text-white text-[10px] font-bold px-2 py-0.5 rounded">निर्णय: {fc.verdict}</span>
              <p className="font-devanagari font-bold text-sm mt-1">"{fc.claim}"</p><p className="text-xs text-slate-600 mt-1">{fc.explanation}</p>
            </div>
          ))}
          <Link to="/fact-check" className="mt-3 block bg-slate-900 text-white text-center text-xs font-bold py-2 rounded">दावा भेजें</Link>
        </div>
      </section>

      <NewsletterCard />
    </div>
  );
};
