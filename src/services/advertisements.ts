import { supabase } from '../lib/supabase';
export interface DbAd { id:string; name:string; position:string; image_url?:string; link_url?:string; html_content?:string; start_date?:string; end_date?:string; is_active:boolean; priority:number; views_count:number; clicks_count:number; created_at:string; }
const LS='cj_ads_db';
function getLocal():DbAd[]{ try{const r=localStorage.getItem(LS); return r?JSON.parse(r):[];}catch{return []} }
function setLocal(d:DbAd[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
export const adsService={
  async list(){ return trySupabase(async()=>{const {data,error}=await supabase.from('advertisements').select('*').order('priority').order('created_at',{ascending:false}); if(error) throw error; return data as DbAd[];}, getLocal()); },
  async listActive(position?:string){ return trySupabase(async()=>{let q=supabase.from('advertisements').select('*').eq('is_active',true).order('priority'); if(position) q=q.eq('position',position); const {data,error}=await q; if(error) throw error; return data as DbAd[];}, getLocal().filter(x=>x.is_active && (!position || x.position===position))); },
  async create(payload:Partial<DbAd>){ return trySupabase(async()=>{const {data,error}=await supabase.from('advertisements').insert(payload).select().single(); if(error) throw error; return data as DbAd;},(()=>{
    const l=getLocal(); const n:DbAd={id:'ad-'+Date.now(), name:payload.name||'New Ad', position:payload.position||'sidebar', is_active:true, priority:0, views_count:0, clicks_count:0, created_at:new Date().toISOString(), ...payload} as DbAd; l.unshift(n); setLocal(l); return n;
  })()); },
  async update(id:string,payload:Partial<DbAd>){ return trySupabase(async()=>{const {data,error}=await supabase.from('advertisements').update({...payload, updated_at:new Date().toISOString()} as any).eq('id',id).select().single(); if(error) throw error; return data as DbAd;},(()=>{
    const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i]={...l[i],...payload} as DbAd; setLocal(l); return l[i]; } throw new Error('Not found');
  })()); },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('advertisements').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async uploadImage(file:File){
    try{
      const path=`advertisements/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
      const {error}=await supabase.storage.from('advertisements').upload(path,file);
      if(error) throw error;
      const {data}=supabase.storage.from('advertisements').getPublicUrl(path);
      return data.publicUrl;
    }catch{
      return URL.createObjectURL(file);
    }
  }
};
