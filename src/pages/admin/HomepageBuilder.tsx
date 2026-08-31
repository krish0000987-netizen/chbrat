import React, { useEffect, useState } from 'react';
import { homepageService, DbSection } from '../../services/homepageSections';
import { categoriesService } from '../../services/categories';
import { auditService } from '../../services/auditLogs';
import { Plus, Trash2, Edit, Save, X, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from 'lucide-react';

const sectionTypes=[
  'hero','top_stories','latest','trending','regional','category_block','editors_pick','opinion','business','sports','video','photo','epaper','advertisement','newsletter'
];
const layoutTypes=['hero_grid','three_column','horizontal_rail','list','large_feature','compact_list','two_column','video_grid','photo_grid'];

export const HomepageBuilder: React.FC = () => {
  const [sections, setSections]=useState<DbSection[]>([]);
  const [cats, setCats]=useState<any[]>([]);
  const [loading, setLoading]=useState(true);
  const [form, setForm]=useState({ title:'', title_hi:'', slug:'', section_type:'latest', layout_type:'three_column', category_id:'', item_count:4, is_enabled:true });
  const [editing, setEditing]=useState<string|null>(null);

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const [s,c]=await Promise.all([homepageService.list(), categoriesService.list()]);
      setSections(s);
      setCats(c);
    }catch(e:any){ /* ignore */ }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[]);

  const onSubmit=async()=>{
    if(!form.title || !form.slug) return alert('Title & slug required');
    try{
      if(editing) await homepageService.update(editing, form as any);
      else await homepageService.create({ ...form, display_order: sections.length+1 } as any);
      await auditService.log(editing?'homepage_section_updated':'homepage_section_created','homepage_sections',editing||undefined,form);
      setForm({ title:'', title_hi:'', slug:'', section_type:'latest', layout_type:'three_column', category_id:'', item_count:4, is_enabled:true });
      setEditing(null);
      fetchAll();
    }catch(e:any){ alert(e.message); }
  };
  const onEdit=(s:DbSection)=>{
    setForm({ title:s.title, title_hi:s.title_hi||'', slug:s.slug, section_type:s.section_type, layout_type:s.layout_type, category_id:s.category_id||'', item_count:s.item_count, is_enabled:s.is_enabled });
    setEditing(s.id);
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete section? Homepage will update immediately.')) return;
    await homepageService.remove(id);
    await auditService.log('homepage_section_deleted','homepage_sections',id);
    fetchAll();
  };
  const toggle=async(s:DbSection)=>{
    await homepageService.toggle(s.id, !s.is_enabled);
    fetchAll();
  };
  const move=async(idx:number, dir: -1|1)=>{
    const newIdx=idx+dir;
    if(newIdx<0 || newIdx>=sections.length) return;
    const ids=[...sections];
    const [moved]=ids.splice(idx,1);
    ids.splice(newIdx,0,moved);
    // optimistic
    setSections(ids);
    await homepageService.reorder(ids.map(x=>x.id));
    fetchAll();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-black text-xl">Homepage Builder</h1>
        <p className="text-xs text-slate-500">Drag reorder by arrows. Toggle enable. Public homepage renders enabled sections in display_order via homepage_sections table.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing?'Edit Section':'New Section'}</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value, slug: form.slug||e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="Title (EN)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          <input value={form.title_hi} onChange={e=>setForm({...form, title_hi:e.target.value})} placeholder="शीर्षक (HI)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm font-devanagari" />
          <input value={form.slug} onChange={e=>setForm({...form, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="slug" className="px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          <div className="flex gap-2">
            <input type="number" min={1} max={12} value={form.item_count} onChange={e=>setForm({...form, item_count: parseInt(e.target.value)||4})} className="w-20 px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
            <label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={form.is_enabled} onChange={e=>setForm({...form, is_enabled:e.target.checked})}/> Enabled</label>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3 mt-3">
          <select value={form.section_type} onChange={e=>setForm({...form, section_type:e.target.value})} className="px-3 py-2 rounded-xl border bg-white text-xs font-bold">
            {sectionTypes.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.layout_type} onChange={e=>setForm({...form, layout_type:e.target.value})} className="px-3 py-2 rounded-xl border bg-white text-xs">
            {layoutTypes.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.category_id} onChange={e=>setForm({...form, category_id:e.target.value})} className="px-3 py-2 rounded-xl border bg-white text-xs">
            <option value="">No category (generic)</option>
            {cats.map(c=> <option key={c.id} value={c.id}>{c.name_hi||c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={onSubmit} className="flex-1 px-4 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-1 justify-center">{editing?<Save className="w-4 h-4"/>:<Plus className="w-4 h-4"/>} {editing?'Update':'Create'}</button>
            {editing && <button onClick={()=>{setEditing(null); setForm({title:'',title_hi:'',slug:'',section_type:'latest',layout_type:'three_column',category_id:'',item_count:4,is_enabled:true});}} className="px-3 py-2 bg-white border rounded-xl text-xs"><X className="w-4 h-4"/></button>}
          </div>
        </div>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : sections.length===0 ? <div className="bg-white rounded-2xl border p-8 text-center text-sm text-slate-500">No sections. Create Hero, Latest, Regional etc. Enable to show on /</div>
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-2 w-8">#</th><th className="p-3 text-left">Section</th><th className="p-3">Type / Layout</th><th className="p-3">Category</th><th className="p-3">Items</th><th className="p-3">Enabled</th><th className="p-3">Order</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {sections.map((s, idx)=>(
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="p-2 text-center text-[11px] font-mono">{s.display_order}</td>
                  <td className="p-3"><p className="font-bold">{s.title} <span className="font-devanagari text-slate-500">/ {s.title_hi||'-'}</span></p><p className="font-mono text-[10px] text-slate-500">{s.slug}</p></td>
                  <td className="p-3 text-center"><span className="text-[11px] font-mono bg-slate-100 rounded px-1.5 py-0.5">{s.section_type}</span><br/><span className="text-[10px] text-slate-500">{s.layout_type}</span></td>
                  <td className="p-3 text-center text-[11px]">{cats.find(c=>c.id===s.category_id)?.name_hi || cats.find(c=>c.id===s.category_id)?.name || '-'}</td>
                  <td className="p-3 text-center">{s.item_count}</td>
                  <td className="p-3 text-center"><button onClick={()=>toggle(s)} className={`p-1.5 rounded-full ${s.is_enabled?'bg-emerald-100 text-emerald-700':'bg-slate-200 text-slate-500'}`}>{s.is_enabled?<Eye className="w-4 h-4"/>:<EyeOff className="w-4 h-4"/>}</button></td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <button onClick={()=>move(idx,-1)} disabled={idx===0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowUp className="w-3 h-3"/></button>
                      <GripVertical className="w-3 h-3 text-slate-300" />
                      <button onClick={()=>move(idx,1)} disabled={idx===sections.length-1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowDown className="w-3 h-3"/></button>
                    </div>
                  </td>
                  <td className="p-3 flex gap-1 justify-center">
                    <button onClick={()=>onEdit(s)} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5"/></button>
                    <button onClick={()=>onDelete(s.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
        <p className="font-black text-amber-900">Preview:</p>
        <p className="text-slate-700 mt-1">Public <span className="font-mono">HomePage.tsx</span> should fetch enabled sections ordered by display_order and render each block. Reordering here changes homepage instantly (NewsContext/homepageService). Disabled sections are hidden from public.</p>
      </div>
    </div>
  );
};
