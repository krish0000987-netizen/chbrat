import React, { useEffect, useState } from 'react';
import { authorsService } from '../../services/authors';
import { mediaService } from '../../services/media';
import { Plus, Trash2, Edit } from 'lucide-react';
export const AuthorsManager: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', slug:'', designation:'', bio:'', avatar_url:'' });
  const [editing, setEditing] = useState<string|null>(null);
  const fetch=async()=>{ setLoading(true); try{ const r=await authorsService.list(); setList(r);}catch{} setLoading(false);};
  useEffect(()=>{fetch();},[]);
  const save=async()=>{
    if(!form.name||!form.slug) return alert('Required');
    if(editing) await authorsService.update(editing, form as any);
    else await authorsService.create(form as any);
    setForm({ name:'', slug:'', designation:'', bio:'', avatar_url:''}); setEditing(null); fetch();
  };
  const onAvatar=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const m=await mediaService.upload(f,'author-images'); setForm({...form, avatar_url:(m as any).public_url});
  };
  const remove=async(id:string)=>{ if(!confirm('Delete author?')) return; await authorsService.remove(id); fetch(); };
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing?'Edit Author':'New Author'}</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="Name" className="px-3 py-2 rounded-xl border bg-slate-50" />
          <input value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} placeholder="slug" className="px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          <input value={form.designation} onChange={e=>setForm({...form, designation:e.target.value})} placeholder="Designation" className="px-3 py-2 rounded-xl border bg-slate-50" />
        </div>
        <textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} placeholder="Bio" rows={2} className="w-full mt-3 px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
        <div className="flex gap-2 mt-3">
          <input value={form.avatar_url} onChange={e=>setForm({...form, avatar_url:e.target.value})} placeholder="Avatar URL" className="flex-1 px-3 py-2 rounded-xl border bg-slate-50 text-xs font-mono" />
          <label className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer">Upload<input type="file" accept="image/*" className="hidden" onChange={onAvatar} /></label>
          <button onClick={save} className="px-6 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black">{editing?'Update':'Create'}</button>
        </div>
      </div>
      {loading ? <div className="h-32 bg-white rounded-xl border animate-pulse" /> :
        <div className="grid md:grid-cols-2 gap-3">
          {list.map(a=>(
            <div key={a.id} className="bg-white rounded-xl border p-3 flex gap-3">
              <img src={a.avatar_url||'https://placehold.co/80x80'} alt="" className="w-14 h-14 rounded-full object-cover border" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{a.name}</p>
                <p className="text-xs text-slate-500">{a.designation} • {a.bio?.slice(0,60)}</p>
                <p className="text-[10px] font-mono text-slate-400">{a.slug}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={()=>{ setForm({ name:a.name, slug:a.slug, designation:a.designation||'', bio:a.bio||'', avatar_url:a.avatar_url||''}); setEditing(a.id); }} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5" /></button>
                <button onClick={()=>remove(a.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
