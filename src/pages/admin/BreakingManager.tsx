import React, { useEffect, useState } from 'react';
import { breakingNewsService } from '../../services/breakingNews';
import { Plus, Trash2, Edit } from 'lucide-react';
export const BreakingManager: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ headline:'', link_url:'', priority:0, is_active:true });
  const [editing, setEditing] = useState<string|null>(null);
  const fetch=async()=>{ const r=await breakingNewsService.listAll(); setList(r); };
  useEffect(()=>{fetch();},[]);
  const save=async()=>{
    if(!form.headline) return alert('Headline required');
    if(editing) await breakingNewsService.update(editing, form as any);
    else await breakingNewsService.create(form as any);
    setForm({ headline:'', link_url:'', priority:0, is_active:true }); setEditing(null); fetch();
  };
  const remove=async(id:string)=>{ if(!confirm('Delete breaking item?')) return; await breakingNewsService.remove(id); fetch(); };
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing?'Edit':'New'} Breaking News</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <input value={form.headline} onChange={e=>setForm({...form, headline:e.target.value})} placeholder="Headline (HI/EN)" className="px-3 py-2 rounded-xl border bg-slate-50 md:col-span-2" />
          <input value={form.link_url} onChange={e=>setForm({...form, link_url:e.target.value})} placeholder="Link / article slug" className="px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          <div className="flex gap-2">
            <input type="number" value={form.priority} onChange={e=>setForm({...form, priority: parseInt(e.target.value)||0})} placeholder="Priority" className="w-20 px-3 py-2 rounded-xl border bg-slate-50" />
            <label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} /> Active</label>
          </div>
        </div>
        <button onClick={save} className="mt-3 px-6 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black">{editing?'Update':'Create'}</button>
        {editing && <button onClick={()=>{setEditing(null); setForm({ headline:'', link_url:'', priority:0, is_active:true });}} className="ml-2 text-xs">Cancel</button>}
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Headline</th><th className="p-3">Priority</th><th className="p-3">Active</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {list.map(b=>(
              <tr key={b.id} className="border-t">
                <td className="p-3 font-bold">{b.headline}</td>
                <td className="p-3 text-center">{b.priority}</td>
                <td className="p-3 text-center">{b.is_active?'✅':'❌'}</td>
                <td className="p-3 flex gap-1 justify-center">
                  <button onClick={()=>{ setForm({ headline:b.headline, link_url:b.link_url||'', priority:b.priority, is_active:b.is_active}); setEditing(b.id); }} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={()=>remove(b.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500">Active items appear in public Breaking Ticker. Expire via expires_at.</p>
    </div>
  );
};
