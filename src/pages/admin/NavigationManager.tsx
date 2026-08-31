import React, { useEffect, useState } from 'react';
import { navigationService, DbNav } from '../../services/navigation';
import { auditService } from '../../services/auditLogs';
import { Plus, Trash2, Edit, Save, X, Menu, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export const NavigationManager: React.FC = () => {
  const [items, setItems]=useState<DbNav[]>([]);
  const [loading, setLoading]=useState(true);
  const [filterMenu, setFilterMenu]=useState<string>('');
  const [form, setForm]=useState({ label:'', label_hi:'', url:'', menu_type:'main' as DbNav['menu_type'], parent_id:'', is_enabled:true });
  const [editing, setEditing]=useState<string|null>(null);

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const r=await navigationService.list(filterMenu as any || undefined);
      setItems(r);
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); }, [filterMenu]);

  const onSubmit=async()=>{
    if(!form.label || !form.url) return alert('Label & URL required');
    try{
      if(editing) await navigationService.update(editing, form as any);
      else await navigationService.create({ ...form, parent_id: form.parent_id||null, display_order: items.length } as any);
      await auditService.log(editing?'navigation_updated':'navigation_created','navigation_items',editing||undefined,form);
      setForm({ label:'', label_hi:'', url:'', menu_type:'main', parent_id:'', is_enabled:true });
      setEditing(null);
      fetchAll();
    }catch(e:any){ alert(e.message); }
  };
  const onEdit=(it:DbNav)=>{
    setForm({ label:it.label, label_hi:it.label_hi||'', url:it.url, menu_type:it.menu_type, parent_id:it.parent_id||'', is_enabled:it.is_enabled });
    setEditing(it.id);
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete menu item?')) return;
    await navigationService.remove(id);
    await auditService.log('navigation_deleted','navigation_items',id);
    fetchAll();
  };
  const toggle=async(it:DbNav)=>{
    await navigationService.update(it.id, { is_enabled: !it.is_enabled });
    fetchAll();
  };
  const move=async(idx:number, dir:-1|1)=>{
    const newIdx=idx+dir;
    if(newIdx<0|| newIdx>=items.length) return;
    const ids=[...items];
    const [m]=ids.splice(idx,1);
    ids.splice(newIdx,0,m);
    setItems(ids);
    await navigationService.reorder(ids.map(x=>x.id));
    fetchAll();
  };

  const parents=items.filter(x=> !x.parent_id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Menu className="w-5 h-5 text-[#8B0000]" />
        <div>
          <h1 className="font-black text-xl">Navigation Manager</h1>
          <p className="text-xs text-slate-500">Manage main / mega / mobile / footer menus. Changes affect GlobalHeader, MegaMenu, MobileBottomNav, GlobalFooter.</p>
        </div>
        <select value={filterMenu} onChange={e=>setFilterMenu(e.target.value)} className="ml-auto px-3 py-2 border rounded-xl bg-white text-xs font-bold">
          <option value="">All Menus</option><option value="main">Main</option><option value="mega">Mega</option><option value="mobile">Mobile</option><option value="footer">Footer</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing?'Edit Menu Item':'New Menu Item'}</h3>
        <div className="grid md:grid-cols-5 gap-3">
          <input value={form.label} onChange={e=>setForm({...form, label:e.target.value})} placeholder="Label (EN)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          <input value={form.label_hi} onChange={e=>setForm({...form, label_hi:e.target.value})} placeholder="लेबल (HI)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm font-devanagari" />
          <input value={form.url} onChange={e=>setForm({...form, url:e.target.value})} placeholder="/url or https://..." className="px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          <select value={form.menu_type} onChange={e=>setForm({...form, menu_type:e.target.value as any})} className="px-3 py-2 rounded-xl border bg-white text-xs font-bold">
            <option value="main">Main</option><option value="mega">Mega</option><option value="mobile">Mobile</option><option value="footer">Footer</option>
          </select>
          <select value={form.parent_id} onChange={e=>setForm({...form, parent_id:e.target.value})} className="px-3 py-2 rounded-xl border bg-white text-xs">
            <option value="">No parent (top-level)</option>
            {parents.map(p=> <option key={p.id} value={p.id}>{p.label} ({p.menu_type})</option>)}
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={form.is_enabled} onChange={e=>setForm({...form, is_enabled:e.target.checked})}/> Enabled</label>
          <button onClick={onSubmit} className="ml-auto px-5 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-1">{editing?<Save className="w-4 h-4"/>:<Plus className="w-4 h-4"/>} {editing?'Update':'Create'}</button>
          {editing && <button onClick={()=>{setEditing(null); setForm({label:'',label_hi:'',url:'',menu_type:'main',parent_id:'',is_enabled:true});}} className="px-3 py-2 bg-white border rounded-xl text-xs"><X className="w-4 h-4"/></button>}
        </div>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Label</th><th className="p-3">URL</th><th className="p-3">Menu</th><th className="p-3">Parent</th><th className="p-3">Order</th><th className="p-3">Enabled</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {items.length===0 ? <tr><td colSpan={7} className="p-8 text-center text-slate-500">No menu items. Add main navigation that appears in header.</td></tr>
                : items.map((it, idx)=>(
                  <tr key={it.id} className="border-t hover:bg-slate-50">
                    <td className="p-3"><p className="font-bold">{it.label} <span className="font-devanagari text-slate-500">/ {it.label_hi||'-'}</span></p><p className="text-[10px] font-mono text-slate-400">{it.id.slice(0,8)}</p></td>
                    <td className="p-3 font-mono text-[11px]">{it.url}</td>
                    <td className="p-3 text-center"><span className="px-2 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase">{it.menu_type}</span></td>
                    <td className="p-3 text-center text-[11px]">{items.find(p=>p.id===it.parent_id)?.label || '-'}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={()=>move(idx,-1)} disabled={idx===0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowUp className="w-3 h-3"/></button>
                        <span className="font-mono text-[11px]">{it.display_order}</span>
                        <button onClick={()=>move(idx,1)} disabled={idx===items.length-1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowDown className="w-3 h-3"/></button>
                      </div>
                    </td>
                    <td className="p-3 text-center"><button onClick={()=>toggle(it)} className={`p-1.5 rounded-full ${it.is_enabled?'bg-emerald-100 text-emerald-700':'bg-slate-200'}`}>{it.is_enabled?<Eye className="w-4 h-4"/>:<EyeOff className="w-4 h-4"/>}</button></td>
                    <td className="p-3 flex gap-1 justify-center">
                      <button onClick={()=>onEdit(it)} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5"/></button>
                      <button onClick={()=>onDelete(it.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
};
