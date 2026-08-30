import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { articlesService, DbArticle } from '../../services/articles';
import { Search, Plus, Edit, Trash2, Eye, Copy, CheckSquare } from 'lucide-react';

export const ArticlesList: React.FC = () => {
  const [params] = useSearchParams();
  const statusFilter = params.get('status') || '';
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await articlesService.list({ status: statusFilter as any || undefined, search: search || undefined, limit: 50, order: 'updated_at' });
      setArticles(data);
    } catch {}
    setLoading(false);
  };
  useEffect(()=>{ fetch(); }, [statusFilter]);

  const toggleSelect = (id:string)=>{ const n=new Set(selected); if(n.has(id)) n.delete(id); else n.add(id); setSelected(n); };
  const bulkPublish = async ()=>{ if(!selected.size) return; if(!confirm(`Publish ${selected.size} articles?`)) return; await articlesService.bulkUpdate([...selected], { status: 'published', published_at: new Date().toISOString() } as any); setSelected(new Set()); fetch(); };
  const bulkDelete = async ()=>{ if(!selected.size) return; if(!confirm(`Delete ${selected.size} articles permanently?`)) return; for(const id of selected) await articlesService.remove(id); setSelected(new Set()); fetch(); };
  const duplicate = async (a:DbArticle)=>{ const payload={...a, id:undefined, slug: a.slug+'-copy-'+Date.now(), title: a.title+' (Copy)', status:'draft' as const, published_at: undefined} as any; delete payload.id; delete payload.created_at; delete payload.updated_at; await articlesService.create(payload); fetch(); };
  const del = async (id:string)=>{ if(!confirm('Delete this article?')) return; await articlesService.remove(id); fetch(); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetch()} placeholder="Search headline..." className="pl-8 pr-3 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm w-64" />
          </div>
          <button onClick={fetch} className="px-4 py-2 bg-white border rounded-xl text-xs font-bold">Search</button>
          <select value={statusFilter} onChange={e=>window.location.href=`/admin/articles${e.target.value?`?status=${e.target.value}`:''}`} className="px-3 py-2 border rounded-xl bg-white text-xs font-bold">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex gap-2">
          {selected.size>0 && <>
            <button onClick={bulkPublish} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Publish ({selected.size})</button>
            <button onClick={bulkDelete} className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-bold">Delete ({selected.size})</button>
          </>}
          <Link to="/admin/articles/new" className="px-4 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black inline-flex items-center gap-1"><Plus className="w-4 h-4" /> New Article</Link>
        </div>
      </div>

      {loading ? <div className="space-y-2">{[1,2,3,4,5].map(i=><div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-xl border animate-pulse" />)}</div>
      : articles.length===0 ? <div className="bg-white dark:bg-slate-900 rounded-2xl border p-12 text-center"><p className="font-black">No articles found</p><p className="text-xs text-slate-500 mt-1">Create your first story from Newsroom</p><Link to="/admin/articles/new" className="mt-3 inline-block bg-[#8B0000] text-white px-4 py-2 rounded-full text-xs font-bold">Create Article</Link></div>
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] uppercase tracking-wider font-black text-slate-500">
                <tr><th className="p-3"><CheckSquare className="w-4 h-4" /></th><th className="p-3 text-left">Article</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Views</th><th className="p-3">Date</th><th className="p-3">Actions</th></tr>
              </thead>
              <tbody>
                {articles.map(a=>(
                  <tr key={a.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3"><input type="checkbox" checked={selected.has(a.id)} onChange={()=>toggleSelect(a.id)} /></td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <img src={a.hero_image_url || 'https://placehold.co/80x60'} alt="" className="w-14 h-10 object-cover rounded border shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold line-clamp-1">{a.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{a.slug} • {a.is_breaking?'🔴 Breaking':''} {a.is_featured?'⭐ Featured':''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">{(a as any).categories?.name_hi || (a as any).categories?.name || '-'}</td>
                    <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${a.status==='published'?'bg-emerald-100 text-emerald-700': a.status==='draft'?'bg-amber-100 text-amber-700':'bg-slate-100'}`}>{a.status}</span></td>
                    <td className="p-3 text-center">{a.views_count}</td>
                    <td className="p-3 text-center text-[11px]">{a.published_at ? new Date(a.published_at).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-center">
                        <Link to={`/article/${a.slug}`} target="_blank" className="p-1.5 hover:bg-slate-100 rounded" title="View"><Eye className="w-3.5 h-3.5" /></Link>
                        <Link to={`/admin/articles/${a.id}/edit`} className="p-1.5 hover:bg-slate-100 rounded text-[#8B0000]" title="Edit"><Edit className="w-3.5 h-3.5" /></Link>
                        <button onClick={()=>duplicate(a)} className="p-1.5 hover:bg-slate-100 rounded" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                        <button onClick={()=>del(a.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
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
