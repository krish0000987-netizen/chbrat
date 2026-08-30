import { useEffect, useState } from 'react';
import { articlesService, DbArticle } from '../services/articles';
export function useArticles(params?: Parameters<typeof articlesService.list>[0]) {
  const [data, setData] = useState<DbArticle[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await articlesService.list(params);
      setData(res.data);
      setCount(res.count || 0);
      setError(null);
    } catch (e:any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetch(); }, [JSON.stringify(params)]);
  return { data, count, loading, error, refresh: fetch };
}
export function useArticle(slug?: string, id?: string) {
  const [data, setData] = useState<DbArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(()=>{
    if (!slug && !id) { setLoading(false); return; }
    (async()=>{
      setLoading(true);
      try {
        const res = slug ? await articlesService.getBySlug(slug) : await articlesService.getById(id!);
        setData(res);
        setError(null);
      } catch(e:any){ setError(e.message); }
      setLoading(false);
    })();
  },[slug,id]);
  return { data, loading, error };
}
