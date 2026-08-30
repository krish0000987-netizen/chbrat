import { supabase } from '../lib/supabase';
export interface DbCategory { id:string; name:string; name_hi?:string; slug:string; description?:string; icon?:string; color?:string; display_order:number; is_active:boolean; created_at:string }
const LS='cj_categories_db';
const seed:DbCategory[]=[
  {id:'cat-desh-videsh',name:'National & World',name_hi:'देश-विदेश',slug:'desh-videsh',display_order:0,is_active:true,created_at:new Date().toISOString()},
  {id:'cat-pradesh',name:'State',name_hi:'प्रदेश',slug:'pradesh',display_order:1,is_active:true,created_at:new Date().toISOString()},
  {id:'cat-khel',name:'Sports',name_hi:'खेल',slug:'khel',display_order:2,is_active:true,created_at:new Date().toISOString()},
  {id:'cat-dharm',name:'Spiritual',name_hi:'धर्म',slug:'dharm',display_order:3,is_active:true,created_at:new Date().toISOString()},
];
function getLocal():DbCategory[]{ try{const r=localStorage.getItem(LS); if(r) return JSON.parse(r); localStorage.setItem(LS, JSON.stringify(seed)); return seed;}catch{return seed} }
function setLocal(d:DbCategory[]){ try{localStorage.setItem(LS, JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){ const m=e?.message||''; if(m.includes('Could not find the table')||m.includes('Failed to fetch')||m.includes('placeholder')) return fallback; throw e; } }
export const categoriesService = {
  async list() { return trySupabase(async()=>{ const {data,error}=await supabase.from('categories').select('*').order('display_order'); if(error) throw error; return data as DbCategory[]; }, getLocal()); },
  async create(payload: Partial<DbCategory>) { return trySupabase(async()=>{ const {data,error}=await supabase.from('categories').insert(payload).select().single(); if(error) throw error; return data as DbCategory; }, (()=>{
    const l=getLocal(); const n:DbCategory={ id:'cat-'+Date.now(), name:payload.name||'New', name_hi:payload.name_hi, slug:payload.slug||'slug-'+Date.now(), display_order:l.length, is_active:true, created_at:new Date().toISOString(), ...payload } as DbCategory; l.push(n); setLocal(l); return n;
  })()); },
  async update(id:string, payload: Partial<DbCategory>) { return trySupabase(async()=>{ const {data,error}=await supabase.from('categories').update({...payload, updated_at: new Date().toISOString()} as any).eq('id', id).select().single(); if(error) throw error; return data as DbCategory; }, (()=>{
    const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i]={...l[i], ...payload} as DbCategory; setLocal(l); return l[i]; } throw new Error('Not found');
  })()); },
  async remove(id:string) { return trySupabase(async()=>{ const {error}=await supabase.from('categories').delete().eq('id', id); if(error) throw error; }, (()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async reorder(ids:string[]) { return trySupabase(async()=>{ for(let i=0;i<ids.length;i++){ await supabase.from('categories').update({ display_order: i } as any).eq('id', ids[i]); } }, (()=>{
    const l=getLocal(); const ordered:DbCategory[]=[]; ids.forEach(id=>{ const f=l.find(x=>x.id===id); if(f) ordered.push(f); }); l.forEach(x=>{ if(!ids.includes(x.id)) ordered.push(x); }); ordered.forEach((x,i)=> x.display_order=i); setLocal(ordered);
  })() as any); }
};
