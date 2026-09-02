import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { articlesService, DbArticle } from '../../services/articles';
import { Search, Plus, Edit, Trash2, Eye, Copy, CheckSquare, Sparkles, Filter } from 'lucide-react';

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
      const { data } = await articlesService.list({
        status: statusFilter as any || undefined,
        search: search || undefined,
        limit: 50,
        order: 'updated_at'
      });
      setArticles(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [statusFilter]);

  const toggleSelect = (id: string) => {
    const n = new Set(selected);
    if (n.has(id)) n.delete(id); else n.add(id);
    setSelected(n);
  };

  const bulkPublish = async () => {
    if (!selected.size) return;
    if (!confirm(`Publish ${selected.size} articles?`)) return;
    await articlesService.bulkUpdate([...selected], { status: 'published', published_at: new Date().toISOString() } as any);
    setSelected(new Set());
    fetch();
  };

  const bulkDelete = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} articles permanently?`)) return;
    for (const id of selected) await articlesService.remove(id);
    setSelected(new Set());
    fetch();
  };

  const duplicate = async (a: DbArticle) => {
    const payload = {
      ...a,
      id: undefined,
      slug: a.slug + '-copy-' + Date.now(),
      title: a.title + ' (प्रतिलिपि)',
      status: 'draft' as const,
      published_at: undefined
    } as any;
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    await articlesService.create(payload);
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm('क्या आप इस समाचार को हटाना चाहते हैं? (Delete this article?)')) return;
    await articlesService.remove(id);
    fetch();
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetch()}
              placeholder="शीर्षक खोजें (Search headline)..."
              className="pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm w-full font-devanagari"
            />
          </div>
          <button
            onClick={fetch}
            className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
          >
            खोजें
          </button>
          <select
            value={statusFilter}
            onChange={e => window.location.href = `/admin/articles${e.target.value ? `?status=${e.target.value}` : ''}`}
            className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold cursor-pointer"
          >
            <option value="">सभी स्थितियाँ (All Status)</option>
            <option value="published">प्रकाशित (Published)</option>
            <option value="draft">ड्राफ्ट (Draft)</option>
            <option value="scheduled">शेड्यूल (Scheduled)</option>
            <option value="archived">संग्रहित (Archived)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {selected.size > 0 && (
            <>
              <button
                onClick={bulkPublish}
                className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Publish ({selected.size})
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
              >
                Delete ({selected.size})
              </button>
            </>
          )}
          <Link
            to="/admin/articles/new"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-[#8B0000] hover:bg-[#7a0000] text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-12 text-center">
          <p className="font-black text-base">कोई समाचार नहीं मिला</p>
          <p className="text-xs text-slate-500 mt-1">पहला समाचार प्रकाशित करने के लिए बटन दबाएँ</p>
          <Link
            to="/admin/articles/new"
            className="mt-4 inline-flex items-center gap-1 bg-[#8B0000] text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Create Article
          </Link>
        </div>
      ) : (
        <>
          {/* MOBILE RESPONSIVE CARD VIEW (< 768px) */}
          <div className="block md:hidden space-y-3">
            {articles.map(a => (
              <div
                key={a.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex gap-3">
                  <img
                    src={a.hero_image_url || 'https://placehold.co/120x90/8B0000/FFFFFF?text=News'}
                    alt=""
                    className="w-20 h-16 object-cover rounded-xl border shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        a.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100'
                      }`}>
                        {a.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-devanagari truncate">
                        {(a as any).categories?.name_hi || (a as any).categories?.name || 'प्रदेश'}
                      </span>
                    </div>
                    <p className="font-bold text-xs line-clamp-2 font-devanagari text-slate-900 dark:text-slate-100 leading-snug">
                      {a.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>{a.published_at ? new Date(a.published_at).toLocaleDateString('en-IN') : 'ड्राफ्ट'} • {a.views_count} व्यूज</span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/article/${a.slug}`}
                      target="_blank"
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-200"
                      title="वेबसाइट पर देखें"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/admin/articles/${a.id}/edit`}
                      className="p-1.5 hover:bg-red-50 text-[#8B0000] font-bold rounded-lg"
                      title="संपादित करें"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => duplicate(a)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg"
                      title="प्रतिलिपि"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => del(a.id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                      title="हटाएँ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (>= 768px) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] uppercase tracking-wider font-black text-slate-500">
                  <tr>
                    <th className="p-3 w-10 text-center"><CheckSquare className="w-4 h-4 inline" /></th>
                    <th className="p-3 text-left">Article</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Views</th>
                    <th className="p-3 text-center">Date</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selected.has(a.id)}
                          onChange={() => toggleSelect(a.id)}
                          className="rounded text-[#8B0000]"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2.5 items-center">
                          <img
                            src={a.hero_image_url || 'https://placehold.co/80x60/8B0000/FFFFFF?text=News'}
                            alt=""
                            className="w-14 h-10 object-cover rounded-lg border shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold line-clamp-1 text-slate-900 dark:text-slate-100 font-devanagari">{a.title}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {a.slug} • {a.is_breaking ? '🔴 Breaking' : ''} {a.is_featured ? '⭐ Featured' : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center font-devanagari">
                        {(a as any).categories?.name_hi || (a as any).categories?.name || '-'}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          a.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                          a.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">{a.views_count}</td>
                      <td className="p-3 text-center text-[11px] text-slate-500">
                        {a.published_at ? new Date(a.published_at).toLocaleDateString('en-IN') : '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-center">
                          <Link
                            to={`/article/${a.slug}`}
                            target="_blank"
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                            title="View on site"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/admin/articles/${a.id}/edit`}
                            className="p-1.5 hover:bg-red-50 rounded text-[#8B0000] font-bold"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => duplicate(a)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-600"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => del(a.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
