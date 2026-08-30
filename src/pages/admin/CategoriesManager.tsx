import React, { useEffect, useState } from 'react';
import { categoriesService, DbCategory } from '../../services/categories';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
export const CategoriesManager: React.FC = () => {
  const [cats, setCats] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', name_hi:'', slug:'', description:'', color:'#8B0000' });
  const [editing, setEditing] = useState<string | null>(null);
  const fetch = async ()=>{ setLoading(true); try{ const r=await categoriesService.list(); setCats(r); }catch{} setLoading(false); };
  useEffect(()=>{ fetch(); },[]);
  const create = async ()=>{
    if(!form.name || !form.slug) return alert('Name & slug required');
    if(editing){
      await categoriesService.update(editing, form as any);
      setEditing(null);
    } else {
      await categoriesService.create(form as any);
    }
    setForm({ name:'', name_hi:'', slug:'', description:'', color:'#8B0000' });
    fetch();
  };
  const edit = (c:DbCategory)=>{ setForm({ name:c.name, name_hi: c.name_hi||'', slug:c.slug, description: c.description||'', color: c.color||'#8B0000' }); setEditing(c.id); };
  const remove = async (id:string)=>{ if(!confirm('Delete category?')) return; await categoriesService.remove(id); fetch(); };
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing ? 'Edit Category' : 'New Category'}</h3>
        <div className="grid md:grid-cols-5 gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="Name (EN)" className="px-3 py-2 rounded-xl border bg-slate-50" />
          <input value={form.name_hi} onChange={e=>setForm({...form, name_hi:e.target.value})} placeholder="नाम (HI)" className="px-3 py-2 rounded-xl border bg-slate-50 font-devanagari" />
          <input value={form.slug} onChange={e=>setForm({...form, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="slug" className="px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          <input type="color" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} className="h-10 rounded-xl border" />
          <button onClick={create} className="px-4 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-1 justify-center">{editing?<Save className="w-4 h-4" />:<Plus className="w-4 h-4" />} {editing?'Update':'Create'}</button>
        </div>
        {editing && <button onClick={()=>{setEditing(null); setForm({ name:'', name_hi:'', slug:'', description:'', color:'#8B0000' });}} className="mt-2 text-xs flex items-center gap-1"><X className="w-3 h-3" /> Cancel</button>}
      </div>

      {loading ? <div className="h-32 bg-white rounded-xl border animate-pulse" />
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Category</th><th className="p-3">Slug</th><th className="p-3">Color</th><th className="p-3">Order</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {cats.map(c=>(
                <tr key={c.id} className="border-t">
                  <td className="p-3"><p className="font-bold">{c.name} <span className="font-devanagari text-slate-500">/ {c.name_hi}</span></p></td>
                  <td className="p-3 font-mono text-[11px]">{c.slug}</td>
                  <td className="p-3"><span className="w-6 h-6 rounded-full inline-block border" style={{background:c.color}} /></td>
                  <td className="p-3">{c.display_order}</td>
                  <td className="p-3 flex gap-1 justify-center">
                    <button onClick={()=>edit(c)} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={()=>remove(c.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};
