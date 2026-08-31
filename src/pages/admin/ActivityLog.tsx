import React, { useEffect, useState } from 'react';
import { auditService, DbAudit } from '../../services/auditLogs';
import { FileText, Search, Filter, Clock, User } from 'lucide-react';

export const ActivityLog: React.FC = () => {
  const [logs, setLogs]=useState<DbAudit[]>([]);
  const [loading, setLoading]=useState(true);
  const [filterEntity, setFilterEntity]=useState('');
  const [search, setSearch]=useState('');

  const fetchLogs=async()=>{
    setLoading(true);
    try{
      const r=await auditService.list({ entity: filterEntity||undefined, limit:50, search: search||undefined });
      setLogs(r);
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchLogs(); },[filterEntity]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-black text-xl flex items-center gap-2"><FileText className="w-5 h-5 text-[#8B0000]" /> Activity Log</h1>
        <p className="text-xs text-slate-500">Audit trail for logins, publishes, uploads, role changes, setting updates. Stored in audit_logs with user, action, entity, details, timestamp.</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchLogs()} placeholder="Search action or entity..." className="pl-8 pr-3 py-2 rounded-xl border bg-white text-sm w-full" />
        </div>
        <button onClick={fetchLogs} className="px-4 py-2 bg-white border rounded-xl text-xs font-bold">Search</button>
        <select value={filterEntity} onChange={e=>setFilterEntity(e.target.value)} className="px-3 py-2 border rounded-xl bg-white text-xs font-bold">
          <option value="">All Entities</option>
          <option value="articles">Articles</option><option value="categories">Categories</option><option value="authors">Authors</option><option value="epapers">E-Papers</option><option value="media">Media</option><option value="navigation_items">Navigation</option><option value="homepage_sections">Homepage</option><option value="advertisements">Ads</option><option value="comments">Comments</option><option value="subscribers">Subscribers</option><option value="profiles">Users</option><option value="site_settings">Settings</option>
        </select>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : logs.length===0 ? <div className="bg-white rounded-2xl border p-12 text-center"><Clock className="w-10 h-10 mx-auto text-slate-300"/><p className="font-black mt-2">No activity yet</p><p className="text-xs text-slate-500">Actions like create article, publish, upload media will appear here. Call auditService.log() on each mutation.</p></div>
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Time</th><th className="p-3">User</th><th className="p-3">Action</th><th className="p-3">Entity</th><th className="p-3">Details</th></tr></thead>
              <tbody>
                {logs.map(l=>(
                  <tr key={l.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px] whitespace-nowrap">{new Date(l.created_at).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center"><span className="inline-flex items-center gap-1 text-[11px]"><User className="w-3 h-3"/>{l.user_id?.slice(0,8)||'system'}</span></td>
                    <td className="p-3 text-center"><span className="px-2 py-1 rounded-full bg-[#8B0000] text-white text-[10px] font-black uppercase">{l.action}</span></td>
                    <td className="p-3 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-[10px] font-mono">{l.entity} {l.entity_id?`• ${l.entity_id.slice(0,6)}`:''}</span></td>
                    <td className="p-3 max-w-xs"><pre className="text-[11px] font-mono bg-slate-50 rounded p-1 truncate">{l.details ? JSON.stringify(l.details).slice(0,80) : '-'}</pre></td>
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
