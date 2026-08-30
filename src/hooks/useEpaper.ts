import { useEffect, useState } from 'react';
import { epapersService, DbEpaper } from '../services/epapers';
export function useEpapers(params?: Parameters<typeof epapersService.list>[0]) {
  const [data, setData] = useState<DbEpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(()=>{ (async()=>{ setLoading(true); try{ const r=await epapersService.list(params); setData(r); setError(null);} catch(e:any){setError(e.message);} setLoading(false);})(); },[JSON.stringify(params)]);
  return { data, loading, error };
}
export function useFeaturedEpaper() {
  const [data, setData] = useState<DbEpaper | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ setLoading(true); const r=await epapersService.getFeatured(); setData(r); setLoading(false);})(); },[]);
  return { data, loading };
}
