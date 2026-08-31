import React, { useEffect, useState } from 'react';
import { subscribersService, DbSubscriber } from '../../services/subscribers';
import { auditService } from '../../services/auditLogs';
import { Users2, Search, Download, Trash2, Mail, RefreshCw } from 'lucide-react';

export const SubscribersManager: React.FC = () => {
  const [list, setList]=useState<DbSubscriber[]>([]);
  const [loading, setLoading]=useState(true);
  const [search, setSearch]=useState('');
  const [filterActive, setFilterActive]=useState<string>('');

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const r=await subscribersService.list({ search: search||undefined, active: filterActive==='active'? true : filterActive==='inactive'? false : undefined, limit:100 });
      setList(r);
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[filterActive]);

  const toggle=async(s:DbSubscriber)=>{
    await subscribersService.toggleActive(s.id, !s.is_active);
    await auditService.log(s.is_active?'subscriber_unsubscribed':'subscriber_restored','subscribers',s.id);
    fetchAll();
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete subscriber permanently?')) return;
    await subscribersService.remove(id);
    await auditService.log('subscriber_deleted','subscribers',id);
    fetchAll();
  };
  const onExport=async()=>{
    const csv=await subscribersService.exportCsv();
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`subscribers_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users2 className="w-5 h-5 text-[#8B0000]" />
        <div>
          <h1 className="font-black text-xl">Subscribers</h1>
          <p className="text-xs text-slate-500">Newsletter subscribers from SubscribePage. Public signup creates real Supabase record.</p>
        </div>
        <button onClick={onExport} className="ml-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"><Download className="w-4 h-4"/> Export CSV</button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchAll()} placeholder="Search email or name..." className="pl-8 pr-3 py-2 rounded-xl border bg-white text-sm w-full" />
        </div>
        <button onClick={fetchAll} className="px-4 py-2 bg-white border rounded-xl text-xs font-bold">Search</button>
        <select value={filterActive} onChange={e=>setFilterActive(e.target.value)} className="px-3 py-2 border rounded-xl bg-white text-xs font-bold">
          <option value="">All</option><option value="active">Active</option><option value="inactive">Unsubscribed</option>
        </select>
        <span className="px-3 py-2 bg-white border rounded-xl text-xs font-mono">{list.length} subscribers</span>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : list.length===0 ? <div className="bg-white rounded-2xl border p-12 text-center"><Mail className="w-10 h-10 mx-auto text-slate-300"/><p className="font-black mt-2">No subscribers yet</p><p className="text-xs text-slate-500">Newsletter signup on SubscribePage will appear here. Test at /subscribe.</p></div>
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Email</th><th className="p-3">Name</th><th className="p-3">Status</th><th className="p-3">Joined</th><th className="p-3">Unsubscribed</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {list.map(s=>(
                  <tr key={s.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] font-bold">{s.email}</td>
                    <td className="p-3 text-center">{s.name||'-'}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${s.is_active?'bg-emerald-100 text-emerald-700':'bg-slate-200 text-slate-600'}`}>{s.is_active?'Active':'Unsubscribed'}</span></td>
                    <td className="p-3 text-center text-[11px]">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-center text-[11px]">{s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="p-3 flex gap-1 justify-center">
                      <button onClick={()=>toggle(s)} className="p-1.5 bg-white border rounded hover:bg-slate-50" title={s.is_active?'Unsubscribe':'Restore'}><RefreshCw className="w-3.5 h-3.5"/></button>
                      <button onClick={()=>onDelete(s.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
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
