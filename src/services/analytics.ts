import { supabase } from '../lib/supabase';
export type EventType='page_view'|'article_view'|'epaper_view'|'epaper_download'|'ad_view'|'ad_click'|'search';
export interface DbEvent { id:string; event_type:EventType; article_id?:string|null; epaper_id?:string|null; metadata?:any; created_at:string; }
const LS='cj_analytics_db';
function getLocal():DbEvent[]{ try{const r=localStorage.getItem(LS); return r?JSON.parse(r):[];}catch{return []} }
function seedIfNeeded(){ const l=getLocal(); if(l.length===0){
  const now=Date.now(); const evts:DbEvent[]=[];
  for(let i=0;i<7;i++){ const d=new Date(now-i*86400000).toISOString(); evts.push({id:'ev-'+i+'-pv',event_type:'page_view',created_at:d} as DbEvent); evts.push({id:'ev-'+i+'-av',event_type:'article_view',created_at:d} as DbEvent); }
  localStorage.setItem(LS,JSON.stringify(evts)); return evts;
 } return l;
}
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
export const analyticsService={
  async track(type:EventType, meta?:{article_id?:string; epaper_id?:string; metadata?:any}){
    const payload={event_type:type, article_id:meta?.article_id||null, epaper_id:meta?.epaper_id||null, metadata:meta?.metadata||{}, created_at:new Date().toISOString()} as any;
    // also store locally for immediate dashboard feedback
    try{ const l=getLocal(); l.unshift({id:'ev-'+Date.now(), ...payload}); localStorage.setItem(LS,JSON.stringify(l.slice(0,500))); }catch{}
    return trySupabase(async()=>{const {data,error}=await supabase.from('analytics_events').insert(payload).select().single(); if(error) throw error; return data;}, payload);
  },
  async summary(rangeDays=7){
    return trySupabase(async()=>{
      const since=new Date(Date.now()-rangeDays*86400000).toISOString();
      const {data,error}=await supabase.from('analytics_events').select('event_type,created_at').gte('created_at',since);
      if(error) throw error;
      const rows=data as DbEvent[];
      const byType:Record<string,number>={}; rows.forEach(r=>{byType[r.event_type]=(byType[r.event_type]||0)+1;});
      const byDay:Record<string,number>={}; rows.forEach(r=>{const d=r.created_at.slice(0,10); byDay[d]=(byDay[d]||0)+1;});
      return {total:rows.length, byType, byDay, rows};
    },(()=>{
      const l=seedIfNeeded(); const since=Date.now()-rangeDays*86400000; const rows=l.filter(r=> new Date(r.created_at).getTime()>=since);
      const byType:Record<string,number>={}; rows.forEach(r=>{byType[r.event_type]=(byType[r.event_type]||0)+1;});
      const byDay:Record<string,number>={}; rows.forEach(r=>{const d=r.created_at.slice(0,10); byDay[d]=(byDay[d]||0)+1;});
      return {total:rows.length, byType, byDay, rows};
    })());
  },
  async topArticles(limit=5){
    return trySupabase(async()=>{
      const {data,error}=await supabase.from('analytics_events').select('article_id').eq('event_type','article_view').not('article_id','is',null);
      if(error) throw error;
      const counts:Record<string,number>={}; (data as any[]).forEach(r=>{counts[r.article_id]=(counts[r.article_id]||0)+1;});
      return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,limit);
    },(()=>{
      const l=getLocal().filter(x=>x.event_type==='article_view' && x.article_id);
      const counts:Record<string,number>={}; l.forEach(r=>{counts[r.article_id!]=(counts[r.article_id!]||0)+1;});
      return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,limit);
    })());
  },
  async listRecent(limit=20){
    return trySupabase(async()=>{const {data,error}=await supabase.from('analytics_events').select('*').order('created_at',{ascending:false}).limit(limit); if(error) throw error; return data as DbEvent[];}, getLocal().slice(0,limit));
  }
};
