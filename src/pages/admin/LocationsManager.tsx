import React, { useEffect, useState } from 'react';
import { locationsService, DbLocation } from '../../services/locations';
import { auditService } from '../../services/auditLogs';
import { Plus, Trash2, Edit, Save, X, MapPin, Search } from 'lucide-react';

export const LocationsManager: React.FC = () => {
  const [list, setList] = useState<DbLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [form, setForm] = useState({ name:'', name_hi:'', slug:'', type:'city' as DbLocation['type'], parent_id:'', is_active:true });
  const [editing, setEditing] = useState<string|null>(null);

  const fetchAll = async ()=>{
    setLoading(true);
    try{
      const r=await locationsService.list();
      setList(r);
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[]);

  const onSubmit = async ()=>{
    if(!form.name || !form.slug) return alert('Name & slug required');
    try{
      if(editing) await locationsService.update(editing, form as any);
      else await locationsService.create(form as any);
      await auditService.log(editing?'location_updated':'location_created','locations',editing||undefined,form);
      setForm({ name:'', name_hi:'', slug:'', type:'city', parent_id:'', is_active:true });
      setEditing(null);
      fetchAll();
    }catch(e:any){ alert(e.message); }
  };
  const onEdit=(l:DbLocation)=>{
    setForm({ name:l.name, name_hi:l.name_hi||'', slug:l.slug, type:l.type, parent_id:l.parent_id||'', is_active:l.is_active });
    setEditing(l.id);
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete location and its children?')) return;
    await locationsService.remove(id);
    await auditService.log('location_deleted','locations',id);
    fetchAll();
  };
  const toggleActive=async(l:DbLocation)=>{
    await locationsService.update(l.id,{is_active: !l.is_active});
    fetchAll();
  };

  const filtered=list.filter(l=>{
    if(filterType && l.type!==filterType) return false;
    if(search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.slug.includes(search.toLowerCase())) return false;
    return true;
  });

  const parentOptions=list.filter(x=> x.type==='state' || x.type==='district');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-black text-xl flex items-center gap-2"><MapPin className="w-5 h-5 text-[#8B0000]" /> Locations</h1>
          <p className="text-xs text-slate-500">State → District → City → Locality hierarchy. Used in Article Editor & public state/city pages.</p>
        </div>
        <span className="text-xs font-mono bg-white border rounded-full px-3 py-1">{list.length} locations</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">{editing?'Edit Location':'New Location'}</h3>
        <div className="grid md:grid-cols-6 gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value, slug: form.slug||e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="Name (EN)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          <input value={form.name_hi} onChange={e=>setForm({...form, name_hi:e.target.value})} placeholder="नाम (HI)" className="px-3 py-2 rounded-xl border bg-slate-50 text-sm font-devanagari" />
          <input value={form.slug} onChange={e=>setForm({...form, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} placeholder="slug" className="px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" />
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value as any})} className="px-3 py-2 rounded-xl border bg-white text-xs font-bold">
            <option value="state">State</option><option value="district">District</option><option value="city">City</option><option value="locality">Locality</option>
          </select>
          <select value={form.parent_id} onChange={e=>setForm({...form, parent_id:e.target.value})} className="px-3 py-2 rounded-xl border bg-white text-xs">
            <option value="">Parent (optional)</option>
            {parentOptions.map(p=> <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
          </select>
          <label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})} /> Active</label>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={onSubmit} className="px-5 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black flex items-center gap-1">{editing?<Save className="w-4 h-4"/>:<Plus className="w-4 h-4"/>} {editing?'Update':'Create'}</button>
          {editing && <button onClick={()=>{setEditing(null); setForm({ name:'',name_hi:'',slug:'',type:'city',parent_id:'',is_active:true});}} className="px-3 py-2 bg-white border rounded-xl text-xs flex items-center gap-1"><X className="w-3 h-3"/> Cancel</button>}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search locations..." className="pl-8 pr-3 py-2 rounded-xl border bg-white text-sm w-full" />
        </div>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="px-3 py-2 border rounded-xl bg-white text-xs font-bold">
          <option value="">All Types</option><option value="state">State</option><option value="district">District</option><option value="city">City</option><option value="locality">Locality</option>
        </select>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Name</th><th className="p-3">Type</th><th className="p-3">Slug</th><th className="p-3">Parent</th><th className="p-3">Active</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {filtered.length===0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No locations found. Create states/districts/cities for articles.</td></tr>
                : filtered.map(l=>{
                  const parent=list.find(p=>p.id===l.parent_id);
                  return (
                  <tr key={l.id} className="border-t hover:bg-slate-50">
                    <td className="p-3"><p className="font-bold">{l.name} <span className="font-devanagari text-slate-500">/ {l.name_hi||'-'}</span></p></td>
                    <td className="p-3 text-center"><span className="px-2 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase">{l.type}</span></td>
                    <td className="p-3 font-mono text-[11px]">{l.slug}</td>
                    <td className="p-3 text-center text-[11px]">{parent?.name||'-'}</td>
                    <td className="p-3 text-center"><button onClick={()=>toggleActive(l)} className={`px-2 py-1 rounded-full text-[10px] font-black ${l.is_active?'bg-emerald-100 text-emerald-700':'bg-slate-200 text-slate-600'}`}>{l.is_active?'Active':'Disabled'}</button></td>
                    <td className="p-3 flex gap-1 justify-center">
                      <button onClick={()=>onEdit(l)} className="p-1.5 hover:bg-slate-100 rounded"><Edit className="w-3.5 h-3.5"/></button>
                      <button onClick={()=>onDelete(l.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      }
      <p className="text-[11px] text-slate-500">Hierarchy correctly uses parent_id. Article Editor now pulls these locations. Public /state/:stateId and /city/:stateId/:cityName query same table.</p>
    </div>
  );
};
