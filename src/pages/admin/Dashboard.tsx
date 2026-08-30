import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Clock, Zap, Newspaper, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ total:0, published:0, draft:0, scheduled:0, breaking:0, epapers:0, views:0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(()=>{
    (async()=>{
      const [{count: total}, {count: published}, {count: draft}, {count: scheduled}, {count: breaking}, {count: epapers}] = await Promise.all([
        supabase.from('articles').select('*', { count:'exact', head:true }),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('status','published'),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('status','draft'),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('status','scheduled'),
        supabase.from('articles').select('*', { count:'exact', head:true }).eq('is_breaking', true),
        supabase.from('epapers').select('*', { count:'exact', head:true }),
      ]);
      const { data: rec } = await supabase.from('articles').select('id,title,slug,status,published_at,views_count').order('updated_at',{ascending:false}).limit(5);
      const { data: agg } = await supabase.from('articles').select('views_count');
      const views = (agg as any[] | null)?.reduce((s,r)=>s+(r.views_count||0),0) || 0;
      setStats({ total: total||0, published: published||0, draft: draft||0, scheduled: scheduled||0, breaking: breaking||0, epapers: epapers||0, views });
      setRecent(rec || []);
    })();
  },[]);

  const cards = [
    { label:'Total Articles', value: stats.total, icon: FileText, color:'bg-[#8B0000]' },
    { label:'Published', value: stats.published, icon: Eye, color:'bg-emerald-700' },
    { label:'Drafts', value: stats.draft, icon: Clock, color:'bg-amber-600' },
    { label:'Scheduled', value: stats.scheduled, icon: Clock, color:'bg-blue-700' },
    { label:'Breaking', value: stats.breaking, icon: Zap, color:'bg-red-700' },
    { label:'E-Papers', value: stats.epapers, icon: Newspaper, color:'bg-slate-800' },
    { label:'Total Views', value: stats.views.toLocaleString('en-IN'), icon: TrendingUp, color:'bg-violet-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map(c=>{
          const Icon=c.icon;
          return <div key={c.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <div className={`w-8 h-8 rounded-xl ${c.color} text-white flex items-center justify-center mb-2`}><Icon className="w-4 h-4" /></div>
            <p className="text-2xl font-black">{c.value}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{c.label}</p>
          </div>;
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h3 className="font-black text-sm mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#8B0000]" /> Recent Articles</h3>
          <div className="space-y-2">
            {recent.length ? recent.map(r=>(
              <Link key={r.id} to={`/admin/articles/${r.id}/edit`} className="flex items-center justify-between p-3 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800">
                <div>
                  <p className="font-bold text-sm line-clamp-1">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.status} • {r.published_at ? new Date(r.published_at).toLocaleDateString('en-IN') : 'draft'} • {r.views_count} views</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${r.status==='published'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{r.status}</span>
              </Link>
            )) : <p className="text-sm text-slate-500 py-8 text-center">No articles yet — <Link to="/admin/articles/new" className="text-[#8B0000] font-bold">Create first article</Link></p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
          <h3 className="font-black text-sm mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/admin/articles/new" className="bg-[#8B0000] text-white p-3 rounded-xl text-center font-bold text-xs hover:bg-[#7a0000]">+ New Article</Link>
            <Link to="/admin/epaper" className="bg-slate-900 text-white p-3 rounded-xl text-center font-bold text-xs">Upload E-Paper</Link>
            <Link to="/admin/breaking-news" className="bg-amber-500 text-black p-3 rounded-xl text-center font-bold text-xs">Breaking News</Link>
            <Link to="/admin/media" className="bg-white border p-3 rounded-xl text-center font-bold text-xs">Media Library</Link>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
            <p className="font-black text-[#8B0000]">Today’s Checklist</p>
            <ul className="mt-1 space-y-1 text-slate-700 list-disc pl-4">
              <li>Upload today’s e-paper PDF</li>
              <li>Publish morning news</li>
              <li>Update breaking ticker</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
