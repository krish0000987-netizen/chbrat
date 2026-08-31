import { supabase } from '../lib/supabase';
export interface DbNav { id:string; label:string; label_hi?:string; url:string; menu_type:'main'|'mega'|'mobile'|'footer'; parent_id?:string|null; display_order:number; is_enabled:boolean; created_at:string; }
const LS='cj_nav_db';
const seed:DbNav[]=[
  {id:'nav-1',label:'देश-विदेश',label_hi:'देश-विदेश',url:'/desh-videsh',menu_type:'main',display_order:0,is_enabled:true,created_at:new Date().toISOString()},
  {id:'nav-2',label:'प्रदेश',url:'/pradesh',menu_type:'main',display_order:1,is_enabled:true,created_at:new Date().toISOString()},
  {id:'nav-3',label:'खेल',url:'/khel',menu_type:'main',display_order:2,is_enabled:true,created_at:new Date().toISOString()},
  {id:'nav-4',label:'मनोरंजन',url:'/manoranjan',menu_type:'main',display_order:3,is_enabled:true,created_at:new Date().toISOString()},
  {id:'nav-5',label:'ई-पेपर',url:'/epaper',menu_type:'main',display_order:4,is_enabled:true,created_at:new Date().toISOString()},
];
function getLocal():DbNav[]{ try{const r=localStorage.getItem(LS); if(r) return JSON.parse(r); localStorage.setItem(LS,JSON.stringify(seed)); return seed;}catch{return seed} }
function setLocal(d:DbNav[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')) return fallback; throw e;}}
export const navigationService={
  async list(menu?:DbNav['menu_type']){ return trySupabase(async()=>{
    let q=supabase.from('navigation_items').select('*').order('display_order');
    if(menu) q=q.eq('menu_type',menu);
    const {data,error}=await q; if(error) throw error; return data as DbNav[];
  }, (()=>{
    let d=getLocal(); if(menu) d=d.filter(x=>x.menu_type===menu); return d.sort((a,b)=>a.display_order-b.display_order);
  })()); },
  async create(payload:Partial<DbNav>){ return trySupabase(async()=>{const {data,error}=await supabase.from('navigation_items').insert(payload).select().single(); if(error) throw error; return data as DbNav;},(()=>{
    const l=getLocal(); const n:DbNav={id:'nav-'+Date.now(), label:payload.label||'New Menu', url:payload.url||'/', menu_type:(payload.menu_type as any)||'main', display_order:l.length, is_enabled:true, created_at:new Date().toISOString(), ...payload} as DbNav; l.push(n); setLocal(l); return n;
  })()); },
  async update(id:string,payload:Partial<DbNav>){ return trySupabase(async()=>{const {data,error}=await supabase.from('navigation_items').update({...payload, updated_at:new Date().toISOString()} as any).eq('id',id).select().single(); if(error) throw error; return data as DbNav;},(()=>{
    const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i]={...l[i],...payload} as DbNav; setLocal(l); return l[i]; } throw new Error('Not found');
  })()); },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('navigation_items').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id));
  })() as any); },
  async reorder(ids:string[]){ return trySupabase(async()=>{ for(let i=0;i<ids.length;i++) await supabase.from('navigation_items').update({display_order:i} as any).eq('id',ids[i]);},(()=>{
    const l=getLocal(); const map=new Map(l.map(x=>[x.id,x])); const ordered:DbNav[]=[]; ids.forEach((id,i)=>{const it=map.get(id); if(it){it.display_order=i; ordered.push(it);}}); l.forEach(x=>{if(!ids.includes(x.id)) ordered.push(x);}); setLocal(ordered);
  })() as any); }
};
