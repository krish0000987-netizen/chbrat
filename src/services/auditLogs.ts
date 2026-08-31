import { supabase } from '../lib/supabase';
export interface DbAudit { id:string; user_id?:string|null; action:string; entity:string; entity_id?:string|null; details?:any; created_at:string; }
const LS='cj_audit_db';
function getLocal():DbAudit[]{ try{const r=localStorage.getItem(LS); return r?JSON.parse(r):[];}catch{return []} }
function setLocal(d:DbAudit[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
export const auditService={
  async list(params?:{action?:string; entity?:string; limit?:number; offset?:number; search?:string}){
    return trySupabase(async()=>{
      let q=supabase.from('audit_logs').select('*').order('created_at',{ascending:false});
      if(params?.action) q=q.eq('action',params.action);
      if(params?.entity) q=q.eq('entity',params.entity);
      if(params?.limit) q=q.limit(params.limit);
      if(params?.offset) q=q.range(params.offset, params.offset+(params.limit||10)-1);
      const {data,error}=await q; if(error) throw error; return data as DbAudit[];
    },(()=>{
      let d=getLocal();
      if(params?.action) d=d.filter(x=>x.action===params.action);
      if(params?.entity) d=d.filter(x=>x.entity===params.entity);
      if(params?.search) d=d.filter(x=>x.action.toLowerCase().includes(params.search!.toLowerCase()) || x.entity.toLowerCase().includes(params.search!.toLowerCase()));
      if(params?.limit) d=d.slice(params.offset||0, (params.offset||0)+params.limit);
      return d;
    })());
  },
  async log(action:string, entity:string, entity_id?:string, details?:any){
    const row={action, entity, entity_id: entity_id||null, details: details||{}, created_at:new Date().toISOString(), user_id: null} as any;
    // local mirror
    try{ const l=getLocal(); l.unshift({id:'aud-'+Date.now(), ...row}); setLocal(l.slice(0,200)); }catch{}
    return trySupabase(async()=>{
      // attach user if available
      try{ const {data:{user}}=await supabase.auth.getUser(); if(user) row.user_id=user.id; }catch{}
      const {data,error}=await supabase.from('audit_logs').insert(row).select().single();
      if(error) throw error; return data;
    }, row);
  }
};
