import { supabase } from '../lib/supabase';
export interface DbSubscriber { id:string; email:string; name?:string; is_active:boolean; unsubscribed_at?:string|null; created_at:string; }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
const LS='cj_subscribers_db';
function getLocal():DbSubscriber[]{ try{const r=localStorage.getItem(LS); return r?JSON.parse(r):[];}catch{return []} }
function setLocal(d:DbSubscriber[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
export const subscribersService={
  async list(params?:{search?:string; active?:boolean; limit?:number; offset?:number}){
    return trySupabase(async()=>{
      let q=supabase.from('subscribers').select('*').order('created_at',{ascending:false});
      if(params?.search) q=q.ilike('email',`%${params.search}%`);
      if(params?.active!==undefined) q=q.eq('is_active',params.active);
      if(params?.limit) q=q.limit(params.limit);
      if(params?.offset) q=q.range(params.offset, params.offset+(params.limit||10)-1);
      const {data,error}=await q; if(error) throw error; return data as DbSubscriber[];
    },(()=>{
      let d=getLocal();
      if(params?.search) d=d.filter(x=>x.email.toLowerCase().includes(params.search!.toLowerCase()) || (x.name||'').toLowerCase().includes(params.search!.toLowerCase()));
      if(params?.active!==undefined) d=d.filter(x=>x.is_active===params.active);
      if(params?.limit) d=d.slice(params.offset||0, (params.offset||0)+params.limit);
      return d;
    })());
  },
  async count(){ const r=await subscribersService.list(); return r.length; },
  async toggleActive(id:string, active:boolean){
    return trySupabase(async()=>{const {data,error}=await supabase.from('subscribers').update({is_active:active, unsubscribed_at: active?null:new Date().toISOString()} as any).eq('id',id).select().single(); if(error) throw error; return data;},(()=>{
      const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i].is_active=active; l[i].unsubscribed_at= active?null:new Date().toISOString(); setLocal(l); return l[i]; } throw new Error('Not found');
    })() as any);
  },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('subscribers').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async subscribe(email:string,name?:string){
    return trySupabase(async()=>{const {data,error}=await supabase.from('subscribers').insert({email,name} as any).select().single(); if(error) throw error; return data;},(()=>{
      const l=getLocal(); if(l.some(x=>x.email===email)) throw new Error('Already subscribed');
      const n:DbSubscriber={id:'sub-'+Date.now(), email, name, is_active:true, created_at:new Date().toISOString()}; l.unshift(n); setLocal(l); return n;
    })() as any);
  },
  async exportCsv(){ const list=await subscribersService.list(); const header='email,name,status,created_at\n'; const rows=list.map(s=>`${s.email},${s.name||''},${s.is_active?'active':'unsubscribed'},${s.created_at}`).join('\n'); return header+rows; }
};
