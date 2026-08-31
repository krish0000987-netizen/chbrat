import React, { useEffect, useState } from 'react';
import { adsService, DbAd } from '../../services/advertisements';
import { auditService } from '../../services/auditLogs';
import { Plus, Trash2, Edit, Save, X, Megaphone, ExternalLink } from 'lucide-react';

const positions=['header','top_banner','hero_side','article_top','article_middle','article_bottom','sidebar','footer','mobile_banner'];

export const AdvertisementsManager: React.FC = () => {
  const [list, setList]=useState<DbAd[]>([]);
  const [loading, setLoading]=useState(true);
  const [form, setForm]=useState({ name:'', position:'sidebar', image_url:'', link_url:'', html_content:'', start_date:'', end_date:'', is_active:true, priority:0 });
  const [editing, setEditing]=useState<string|null>(null);
  const [uploading, setUploading]=useState(false);

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const r=await adsService.list();
      setList(r);
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[]);

  const handleUpload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    setUploading(true);
    try{
      const url=await adsService.uploadImage(f);
      setForm({...form, image_url:url});
    }catch(err:any){ alert(err.message); }
    setUploading(false);
  };

  const onSubmit=async()=>{
    if(!form.name || !form.position) return alert('Name & position required');
    try{
      if(editing) await adsService.update(editing, form as any);
      else await adsService.create(form as any);
      await auditService.log(editing?'ad_updated':'ad_created','advertisements',editing||undefined,form);
      setForm({ name:'', position:'sidebar', image_url:'', link_url:'', html_content:'', start_date:'', end_date:'', is_active:true, priority:0 });
      setEditing(null);
      fetchAll();
    }catch(e:any){ alert(e.message); }
  };
  const onEdit=(ad:DbAd)=>{
    setForm({ name:ad.name, position:ad.position, image_url:ad.image_url||'', link_url:ad.link_url||'', html_content:ad.html_content||'', start_date:ad.start_date||'', end_date:ad.end_date||'', is_active:ad.is_active, priority:ad.priority });
    setEditing(ad.id);
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete advertisement?')) return;
    await adsService.remove(id);
    await auditService.log('ad_deleted','advertisements',id);
    fetchAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-[#8B0000]" />
        <div>
          <h1 className="font-black text-xl">Advertisements</h1>
          <p className="text-xs text-slate-500">Manage ad slots (header, hero_side, article, sidebar, footer). Active ads with valid dates appear via AdvertisementSlot component.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing?'Edit Ad':'New Advertisement'}</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Ad Name (e.g., Header Banner)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          <select value={form.position} onChange={e=>setForm({...form, position:e.target.value})} className="px-3 py-2 rounded-xl border bg-white text-xs font-bold">
            {positions.map(p=> <option key={p} value={p}>{p}</option>)}
          </select>
          <input type="number" value={form.priority} onChange={e=>setForm({...form, priority: parseInt(e.target.value)||0})} placeholder="Priority (0=highest)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-bold mb-1">Image URL</label>
            <input value={form.image_url} onChange={e=>setForm({...form, image_url:e.target.value})} placeholder="https://... or upload" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
            <label className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer">
              {uploading?'Uploading...':'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 w-full h-20 object-cover rounded border" />}
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Link URL & HTML</label>
            <input value={form.link_url} onChange={e=>setForm({...form, link_url:e.target.value})} placeholder="https:// advertiser link" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
            <textarea value={form.html_content} onChange={e=>setForm({...form, html_content:e.target.value})} placeholder="Optional HTML content (if no image)" rows={3} className="w-full mt-2 px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3 mt-3">
          <input type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} className="px-3 py-2 rounded-xl border bg-slate-50 text-xs" />
          <input type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} className="px-3 py-2 rounded-xl border bg-slate-50 text-xs" />
          <label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})}/> Active</label>
          <div className="flex gap-2">
            <button onClick={onSubmit} className="flex-1 px-4 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-1 justify-center">{editing?<Save className="w-4 h-4"/>:<Plus className="w-4 h-4"/>} {editing?'Update':'Create'}</button>
            {editing && <button onClick={()=>{setEditing(null); setForm({name:'',position:'sidebar',image_url:'',link_url:'',html_content:'',start_date:'',end_date:'',is_active:true,priority:0});}} className="px-3 py-2 bg-white border rounded-xl text-xs"><X className="w-4 h-4"/></button>}
          </div>
        </div>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : list.length===0 ? <div className="bg-white rounded-2xl border p-8 text-center text-sm text-slate-500">No advertisements. Create first ad — it will appear in AdvertisementSlot where active.</div>
      : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map(ad=>(
            <div key={ad.id} className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
              {ad.image_url ? <img src={ad.image_url} alt={ad.name} className="w-full h-32 object-cover" /> : <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image — HTML ad</div>}
              <div className="p-3">
                <p className="font-bold text-sm line-clamp-1">{ad.name}</p>
                <p className="text-[11px] font-mono text-slate-500">{ad.position} • priority {ad.priority} • {ad.is_active?'Active':'Inactive'}</p>
                <p className="text-[11px] text-slate-500 mt-1">{ad.start_date||'—'} → {ad.end_date||'no end'}</p>
                <p className="text-[11px] text-slate-500">Views: {ad.views_count} • Clicks: {ad.clicks_count}</p>
                <div className="flex gap-1 mt-2">
                  {ad.link_url && <a href={ad.link_url} target="_blank" className="p-1.5 bg-slate-100 rounded hover:bg-slate-200"><ExternalLink className="w-3.5 h-3.5"/></a>}
                  <button onClick={()=>onEdit(ad)} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>onDelete(ad.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
