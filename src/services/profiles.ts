import { supabase } from '../lib/supabase';
export type Role='super_admin'|'admin'|'editor'|'reporter'|'viewer';
export interface DbProfile { id:string; email?:string; full_name?:string; avatar_url?:string; role:Role; phone?:string; created_at:string; }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
const LS='cj_profiles_db';
function getLocal():DbProfile[]{ try{const r=localStorage.getItem(LS); return r?JSON.parse(r):[];}catch{return []} }
function setLocal(d:DbProfile[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
export const profilesService={
  async list(){ return trySupabase(async()=>{const {data,error}=await supabase.from('profiles').select('*').order('created_at'); if(error) throw error; return data as DbProfile[];}, getLocal()); },
  async updateRole(id:string, role:Role){
    return trySupabase(async()=>{const {data,error}=await supabase.from('profiles').update({role} as any).eq('id',id).select().single(); if(error) throw error; return data;},(()=>{
      const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i].role=role; setLocal(l); return l[i]; } throw new Error('Not found');
    })() as any);
  },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('profiles').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async getCurrentRole():Promise<Role|null>{
    try{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user) return null;
      const {data}=await supabase.from('profiles').select('role').eq('id',user.id).single();
      return (data as any)?.role || 'viewer';
    }catch{ return 'viewer'; }
  }
};
