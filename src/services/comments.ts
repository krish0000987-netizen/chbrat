import { supabase } from '../lib/supabase';
export interface DbComment { id:string; article_id:string; user_id?:string|null; guest_name?:string; guest_email?:string; body:string; status:'pending'|'approved'|'rejected'|'spam'; created_at:string; articles?:any; }
const LS='cj_comments_db';
function getLocal():DbComment[]{ try{const r=localStorage.getItem(LS); return r?JSON.parse(r):[];}catch{return []} }
function setLocal(d:DbComment[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
export const commentsService={
  async list(params?:{status?:string; articleId?:string; search?:string; limit?:number}){
    return trySupabase(async()=>{
      let q=supabase.from('comments').select('*, articles(id,title,slug)').order('created_at',{ascending:false});
      if(params?.status) q=q.eq('status',params.status);
      if(params?.articleId) q=q.eq('article_id',params.articleId);
      if(params?.search) q=q.ilike('body',`%${params.search}%`);
      if(params?.limit) q=q.limit(params.limit);
      const {data,error}=await q; if(error) throw error; return data as DbComment[];
    },(()=>{
      let d=getLocal();
      if(params?.status) d=d.filter(x=>x.status===params.status);
      if(params?.articleId) d=d.filter(x=>x.article_id===params.articleId);
      if(params?.search) d=d.filter(x=>x.body.toLowerCase().includes(params.search!.toLowerCase()));
      if(params?.limit) d=d.slice(0,params.limit);
      return d;
    })());
  },
  async updateStatus(id:string,status:DbComment['status']){
    return trySupabase(async()=>{const {data,error}=await supabase.from('comments').update({status, updated_at:new Date().toISOString()} as any).eq('id',id).select().single(); if(error) throw error; return data;},(()=>{
      const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i].status=status; setLocal(l); return l[i]; } throw new Error('Not found');
    })() as any);
  },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('comments').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async create(payload:Partial<DbComment>){
    return trySupabase(async()=>{const {data,error}=await supabase.from('comments').insert(payload).select().single(); if(error) throw error; return data;},(()=>{
      const l=getLocal(); const n:DbComment={id:'cm-'+Date.now(), article_id:payload.article_id||'art-1', body:payload.body||'', status:'pending', guest_name:payload.guest_name, guest_email:payload.guest_email, created_at:new Date().toISOString()} as DbComment; l.unshift(n); setLocal(l); return n;
    })() as any);
  }
};
