import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { siteSettingsService } from '../../services/siteSettings';
import { auditService } from '../../services/auditLogs';
import { Save, Search, Globe, FileText, AlertCircle } from 'lucide-react';

const KEYS=[
  { key:'seo_site_title', label:'Site Title', placeholder:'Chanakya Bharat — Hindi News' },
  { key:'seo_site_description', label:'Site Description', placeholder:'Daily Hindi news from Uttar Pradesh...' },
  { key:'seo_keywords', label:'Keywords', placeholder:'kushinagar, news, hindi' },
  { key:'seo_canonical_base', label:'Canonical Base URL', placeholder:'https://chanakyabharat.com' },
  { key:'seo_og_image', label:'Default OG Image URL', placeholder:'https://.../og-image.jpg' },
  { key:'seo_twitter_image', label:'Twitter Image URL', placeholder:'https://...' },
  { key:'seo_robots', label:'Robots (index,follow)', placeholder:'index, follow' },
];

const STATIC_PAGES=[
  { slug:'about', title:'About' },
  { slug:'editorial-policy', title:'Editorial Policy' },
  { slug:'contact', title:'Contact' },
  { slug:'privacy', title:'Privacy Policy' },
  { slug:'terms', title:'Terms' },
  { slug:'advertise', title:'Advertise' },
];

export const SeoManager: React.FC = () => {
  const [settings, setSettings]=useState<Record<string,any>>({});
  const [loading, setLoading]=useState(true);
  const [saving, setSaving]=useState(false);
  const [message, setMessage]=useState('');

  const [pageSlug, setPageSlug]=useState('about');
  const [pageContent, setPageContent]=useState({ title:'', seo_title:'', seo_description:'', content:'' });

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        const all=await siteSettingsService.getAll();
        setSettings(all);
        // load static page if exists
        const { data }=await supabase.from('site_settings').select('value').eq('key',`page_${pageSlug}`).maybeSingle();
        if(data){
          try{ 
            const val= typeof (data as any).value==='string' ? JSON.parse((data as any).value) : (data as any).value;
            const parsed = typeof val==='string' ? JSON.parse(val) : val;
            setPageContent(parsed as any);
          }catch{}
        }
      }catch(e:any){ setMessage(e.message); }
      setLoading(false);
    })();
  },[pageSlug]);

  const saveGlobal=async()=>{
    setSaving(true);
    try{
      for(const k of KEYS){
        const v=(document.getElementById(k.key) as HTMLInputElement)?.value;
        if(v!==undefined) await siteSettingsService.set(k.key, v);
      }
      await auditService.log('seo_updated','site_settings',undefined,{ keys: KEYS.map(k=>k.key) });
      setMessage('SEO settings saved ✓');
      setTimeout(()=>setMessage(''),3000);
    }catch(e:any){ setMessage(e.message); }
    setSaving(false);
  };

  const savePage=async()=>{
    setSaving(true);
    try{
      await siteSettingsService.set(`page_${pageSlug}`, pageContent);
      await supabase.from('site_settings').upsert({ key:`page_${pageSlug}`, value: JSON.stringify(pageContent) } as any);
      // also try to insert into articles as static page if Articles table allows? Keep in site_settings for StaticPage component fallback
      await auditService.log('static_page_updated','site_settings',pageSlug,pageContent);
      setMessage(`Page /${pageSlug} saved ✓`);
      setTimeout(()=>setMessage(''),3000);
    }catch(e:any){ setMessage(e.message); }
    setSaving(false);
  };

  if(loading) return <div className="h-32 bg-white rounded-2xl border animate-pulse" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-black text-xl flex items-center gap-2"><Globe className="w-5 h-5 text-[#8B0000]" /> SEO & Pages</h1>
        <p className="text-xs text-slate-500">Global SEO meta, OpenGraph, canonical, robots + static pages (About, Contact etc). Public pages use these for meta tags.</p>
      </div>

      {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-3 py-2 text-xs font-bold">{message}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-1 flex items-center gap-2"><Search className="w-4 h-4 text-[#8B0000]" /> Global SEO</h3>
        <p className="text-[11px] text-slate-500 mb-4">Used as fallback for homepage, category, article when article-specific SEO is empty.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {KEYS.map(k=>(
            <div key={k.key}>
              <label className="block text-xs font-bold mb-1">{k.label}</label>
              <input id={k.key} defaultValue={typeof settings[k.key]==='string'? settings[k.key] : (settings[k.key] ? JSON.stringify(settings[k.key]).replace(/"/g,'') : '')} placeholder={k.placeholder} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm font-mono" />
            </div>
          ))}
        </div>
        <button onClick={saveGlobal} disabled={saving} className="mt-4 px-6 py-2.5 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/> {saving?'Saving...':'Save Global SEO'}</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Static Pages</h3>
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {STATIC_PAGES.map(p=>(
            <button key={p.slug} onClick={()=>setPageSlug(p.slug)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border ${pageSlug===p.slug?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white hover:bg-slate-50'}`}>{p.title} <span className="font-mono text-[10px]">/{p.slug}</span></button>
          ))}
        </div>
        <div className="space-y-3">
          <input value={pageContent.title} onChange={e=>setPageContent({...pageContent, title:e.target.value})} placeholder="Page Title (H1)" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-bold" />
          <input value={pageContent.seo_title} onChange={e=>setPageContent({...pageContent, seo_title:e.target.value})} placeholder="SEO Title (meta title)" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          <textarea value={pageContent.seo_description} onChange={e=>setPageContent({...pageContent, seo_description:e.target.value})} placeholder="Meta description" rows={2} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          <div>
            <label className="block text-xs font-bold mb-1">Page Content (HTML)</label>
            <textarea value={pageContent.content} onChange={e=>setPageContent({...pageContent, content:e.target.value})} placeholder="<p>Static page HTML content</p>" rows={8} className="w-full px-3 py-3 rounded-xl border bg-slate-50 font-mono text-xs" />
          </div>
          <button onClick={savePage} disabled={saving} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black disabled:opacity-50">Save /{pageSlug}</button>
          <p className="text-[11px] text-slate-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> StaticPage.tsx reads site_settings key <span className="font-mono">page_{pageSlug}</span> as fallback when no dedicated CMS table exists. For full Article-based pages, create an article with that slug.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
        <p className="font-black text-amber-900">Per-article SEO</p>
        <p className="text-slate-700 mt-1">Already in ArticleEditor (seo_title, seo_description, seo_keywords, og_image, canonical_url). This global SEO complements it. Sitemap should be generated from published articles + enabled navigation_items.</p>
      </div>
    </div>
  );
};
