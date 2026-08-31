import React, { useEffect, useState } from 'react';
import { siteSettingsService } from '../../services/siteSettings';
import { auditService } from '../../services/auditLogs';
import { mediaService } from '../../services/media';
import { Settings, Save, Upload, Image as ImageIcon } from 'lucide-react';

type Tab='general'|'branding'|'contact'|'social'|'seo'|'footer';

const TAB_LABELS: Record<Tab,string>={ general:'General', branding:'Branding', contact:'Contact', social:'Social', seo:'SEO', footer:'Footer' };

export const SiteSettingsManager: React.FC = () => {
  const [active, setActive]=useState<Tab>('general');
  const [settings, setSettings]=useState<Record<string,any>>({});
  const [loading, setLoading]=useState(true);
  const [saving, setSaving]=useState(false);
  const [msg, setMsg]=useState('');

  const [form, setForm]=useState<Record<string,string>>({});

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const all=await siteSettingsService.getAll();
      setSettings(all);
      const flat:Record<string,string>={};
      Object.entries(all).forEach(([k,v])=> flat[k]= typeof v==='string'? v : JSON.stringify(v).replace(/^"|"$/g,''));
      setForm(flat);
    }catch(e:any){ setMsg(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[]);

  const saveTab=async()=>{
    setSaving(true);
    try{
      // determine keys for tab
      const tabKeys: Record<Tab,string[]> = {
        general: ['site_name','site_name_hi','tagline','logo_url','favicon_url'],
        branding: ['logo_url','favicon_url','brand_primary','brand_secondary'],
        contact: ['contact_email','contact_phone','address','editor_name','editor_name_hi'],
        social: ['facebook','instagram','twitter','youtube','whatsapp','telegram'],
        seo: ['seo_site_title','seo_site_description','seo_keywords','seo_og_image'],
        footer: ['footer_text','footer_copyright','footer_links'],
      };
      const keys=tabKeys[active];
      for(const k of keys){
        if(form[k]!==undefined) await siteSettingsService.set(k, form[k]);
      }
      await auditService.log('site_settings_updated','site_settings',undefined,{tab:active, keys});
      setMsg(`Settings saved (${active}) ✓`);
      setTimeout(()=>setMsg(''),3000);
      fetchAll();
    }catch(e:any){ setMsg(e.message); }
    setSaving(false);
  };

  const handleLogoUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    try{
      const m=await mediaService.upload(f,'site-assets');
      setForm({...form, logo_url: (m as any).public_url});
      setMsg('Logo uploaded — click Save to persist');
    }catch(err:any){ setMsg(err.message); }
  };

  if(loading) return <div className="h-32 bg-white rounded-2xl border animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-[#8B0000]" />
        <div>
          <h1 className="font-black text-xl">Site Settings</h1>
          <p className="text-xs text-slate-500">General, branding, contact, social, SEO, footer. Stored in site_settings key-value table. Public GlobalHeader/Footer read these.</p>
        </div>
      </div>

      {msg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-3 py-2 text-xs font-bold">{msg}</div>}

      <div className="flex gap-2 overflow-x-auto">
        {(Object.keys(TAB_LABELS) as Tab[]).map(t=>(
          <button key={t} onClick={()=>setActive(t)} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap border ${active===t?'bg-[#8B0000] text-white border-[#8B0000]':'bg-white hover:bg-slate-50'}`}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        {active==='general' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm">General</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold mb-1">Site Name (EN)</label><input value={form.site_name||''} onChange={e=>setForm({...form, site_name:e.target.value})} placeholder="Chitrakoot Jyoti" className="w-full px-3 py-2 rounded-xl border bg-slate-50" /></div>
              <div><label className="block text-xs font-bold mb-1">Site Name (HI)</label><input value={form.site_name_hi||''} onChange={e=>setForm({...form, site_name_hi:e.target.value})} placeholder="चित्रकूट ज्योति" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-devanagari" /></div>
              <div><label className="block text-xs font-bold mb-1">Tagline</label><input value={form.tagline||''} onChange={e=>setForm({...form, tagline:e.target.value})} placeholder="Daily News from Bhopal to Chitrakoot" className="w-full px-3 py-2 rounded-xl border bg-slate-50" /></div>
              <div><label className="block text-xs font-bold mb-1">Logo URL</label><div className="flex gap-2"><input value={form.logo_url||''} onChange={e=>setForm({...form, logo_url:e.target.value})} placeholder="/assets/logo.jpg or https://..." className="flex-1 px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /><label className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"><Upload className="w-3 h-3"/> Upload <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} /></label></div>{form.logo_url && <img src={form.logo_url} alt="logo" className="mt-2 h-10 object-contain border rounded bg-white p-1" />}</div>
            </div>
          </div>
        )}

        {active==='branding' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm">Branding</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold mb-1">Logo URL</label><input value={form.logo_url||''} onChange={e=>setForm({...form, logo_url:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div>
              <div><label className="block text-xs font-bold mb-1">Favicon URL</label><input value={form.favicon_url||''} onChange={e=>setForm({...form, favicon_url:e.target.value})} placeholder="/favicon.png" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div>
              <div><label className="block text-xs font-bold mb-1">Primary Color</label><div className="flex gap-2"><input type="color" value={form.brand_primary||'#8B0000'} onChange={e=>setForm({...form, brand_primary:e.target.value})} className="h-10 w-16 rounded border" /><input value={form.brand_primary||''} onChange={e=>setForm({...form, brand_primary:e.target.value})} placeholder="#8B0000" className="flex-1 px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div></div>
              <div><label className="block text-xs font-bold mb-1">Secondary Color</label><div className="flex gap-2"><input type="color" value={form.brand_secondary||'#1a0000'} onChange={e=>setForm({...form, brand_secondary:e.target.value})} className="h-10 w-16 rounded border" /><input value={form.brand_secondary||''} onChange={e=>setForm({...form, brand_secondary:e.target.value})} placeholder="#1a0000" className="flex-1 px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div></div>
            </div>
          </div>
        )}

        {active==='contact' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm">Contact</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold mb-1">Contact Email</label><input value={form.contact_email||''} onChange={e=>setForm({...form, contact_email:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Contact Phone</label><input value={form.contact_phone||''} onChange={e=>setForm({...form, contact_phone:e.target.value})} placeholder="8827294576, 8982635688" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Address</label><input value={form.address||''} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Bhopal (MP)" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Editor Name</label><input value={form.editor_name||''} onChange={e=>setForm({...form, editor_name:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-slate-50" /></div>
              <div><label className="block text-xs font-bold mb-1">Editor Name (HI)</label><input value={form.editor_name_hi||''} onChange={e=>setForm({...form, editor_name_hi:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-devanagari" /></div>
            </div>
          </div>
        )}

        {active==='social' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm">Social Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ['facebook','Facebook URL'],
                ['instagram','Instagram URL'],
                ['twitter','X / Twitter URL'],
                ['youtube','YouTube URL'],
                ['whatsapp','WhatsApp Number / Link'],
                ['telegram','Telegram Link'],
              ].map(([k,label])=>(
                <div key={k}><label className="block text-xs font-bold mb-1">{label}</label><input value={form[k]||''} onChange={e=>setForm({...form, [k]:e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div>
              ))}
            </div>
          </div>
        )}

        {active==='seo' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm">SEO Defaults</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold mb-1">SEO Site Title</label><input value={form.seo_site_title||form.site_name||''} onChange={e=>setForm({...form, seo_site_title:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">SEO Keywords</label><input value={form.seo_keywords||''} onChange={e=>setForm({...form, seo_keywords:e.target.value})} placeholder="chitrakoot, news" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold mb-1">SEO Description</label><textarea value={form.seo_site_description||''} onChange={e=>setForm({...form, seo_site_description:e.target.value})} rows={2} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">OG Image URL</label><input value={form.seo_og_image||''} onChange={e=>setForm({...form, seo_og_image:e.target.value})} placeholder="https://.../og.jpg" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div>
            </div>
          </div>
        )}

        {active==='footer' && (
          <div className="space-y-4">
            <h3 className="font-black text-sm">Footer</h3>
            <div><label className="block text-xs font-bold mb-1">Footer Text</label><textarea value={form.footer_text||''} onChange={e=>setForm({...form, footer_text:e.target.value})} rows={3} placeholder="Footer description..." className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
            <div><label className="block text-xs font-bold mb-1">Copyright</label><input value={form.footer_copyright||''} onChange={e=>setForm({...form, footer_copyright:e.target.value})} placeholder="© 2026 Chitrakoot Jyoti" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
            <div><label className="block text-xs font-bold mb-1">Footer Links (JSON)</label><textarea value={form.footer_links||''} onChange={e=>setForm({...form, footer_links:e.target.value})} placeholder='[{"label":"About","url":"/about"}]' rows={3} className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div>
          </div>
        )}

        <button onClick={saveTab} disabled={saving} className="mt-6 px-6 py-2.5 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/> {saving?'Saving...':'Save Settings'}</button>
      </div>

      <div className="bg-slate-50 border rounded-xl p-3 text-xs">
        <p className="font-black">Raw site_settings (debug)</p>
        <pre className="mt-2 text-[11px] font-mono bg-white border rounded p-2 max-h-40 overflow-auto">{JSON.stringify(settings,null,2).slice(0,1200)}</pre>
      </div>
    </div>
  );
};
