import React, { useEffect, useState } from 'react';
import { commentsService, DbComment } from '../../services/comments';
import { auditService } from '../../services/auditLogs';
import { MessageSquare, Check, X, Trash2, ShieldAlert, Search, Filter } from 'lucide-react';

export const CommentsManager: React.FC = () => {
  const [list, setList]=useState<DbComment[]>([]);
  const [loading, setLoading]=useState(true);
  const [statusFilter, setStatusFilter]=useState<string>('');
  const [search, setSearch]=useState('');
  const fetchAll=async()=>{
    setLoading(true);
    try{
      const r=await commentsService.list({ status: statusFilter||undefined, search: search||undefined, limit:50 });
      setList(r);
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[statusFilter]);

  const setStatus=async(id:string, status:DbComment['status'])=>{
    await commentsService.updateStatus(id, status);
    await auditService.log(`comment_${status}`,'comments',id,{status});
    fetchAll();
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete comment permanently?')) return;
    await commentsService.remove(id);
    await auditService.log('comment_deleted','comments',id);
    fetchAll();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-black text-xl flex items-center gap-2"><MessageSquare className="w-5 h-5 text-[#8B0000]" /> Comments Moderation</h1>
        <p className="text-xs text-slate-500">Pending → Approved (public) / Rejected / Spam. Public ArticlePage shows only approved comments.</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchAll()} placeholder="Search comment body..." className="pl-8 pr-3 py-2 rounded-xl border bg-white text-sm w-full" />
        </div>
        <button onClick={fetchAll} className="px-4 py-2 bg-white border rounded-xl text-xs font-bold">Search</button>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-xl bg-white text-xs font-bold">
          <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="spam">Spam</option>
        </select>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : list.length===0 ? <div className="bg-white rounded-2xl border p-12 text-center"><MessageSquare className="w-10 h-10 mx-auto text-slate-300"/><p className="font-black mt-2">No comments</p><p className="text-xs text-slate-500">When users comment on articles, they appear here as pending for moderation.</p></div>
      : <div className="space-y-2">
          {list.map(c=>(
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border p-4">
              <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{c.body}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {c.guest_name||'Guest'} {c.guest_email?`• ${c.guest_email}`:''} • {new Date(c.created_at).toLocaleString('en-IN')} • Article: {(c as any).articles?.title?.slice(0,40) || c.article_id.slice(0,8)}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${c.status==='approved'?'bg-emerald-100 text-emerald-700': c.status==='pending'?'bg-amber-100 text-amber-700': c.status==='spam'?'bg-red-100 text-red-700':'bg-slate-100'}`}>{c.status}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {c.status!=='approved' && <button onClick={()=>setStatus(c.id,'approved')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-black flex items-center gap-1"><Check className="w-3 h-3"/> Approve</button>}
                  {c.status!=='rejected' && <button onClick={()=>setStatus(c.id,'rejected')} className="px-3 py-1.5 bg-white border rounded-xl text-[11px] font-bold flex items-center gap-1"><X className="w-3 h-3"/> Reject</button>}
                  {c.status!=='spam' && <button onClick={()=>setStatus(c.id,'spam')} className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-[11px] font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Spam</button>}
                  <button onClick={()=>onDelete(c.id)} className="px-3 py-1.5 hover:bg-red-50 text-red-600 rounded-xl text-[11px] flex items-center gap-1 justify-center"><Trash2 className="w-3 h-3"/> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
