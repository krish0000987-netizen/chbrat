import { supabase } from '../lib/supabase';
export interface DbLocation { id:string; name:string; name_hi?:string; slug:string; type:'state'|'district'|'city'|'locality'; parent_id?:string|null; is_active:boolean; created_at:string; }
const LS='cj_locations_db';
const seed:DbLocation[]=[
  {id:'loc-up',name:'Uttar Pradesh',name_hi:'उत्तर प्रदेश',slug:'uttar-pradesh',type:'state',is_active:true,created_at:new Date().toISOString()},
  {id:'loc-kushinagar',name:'Kushinagar',name_hi:'कुशीनगर',slug:'kushinagar',type:'district',parent_id:'loc-up',is_active:true,created_at:new Date().toISOString()},
  {id:'loc-padrauna',name:'Padrauna',name_hi:'पडरौना',slug:'padrauna',type:'city',parent_id:'loc-kushinagar',is_active:true,created_at:new Date().toISOString()},
  {id:'loc-gorakhpur',name:'Gorakhpur',name_hi:'गोरखपुर',slug:'gorakhpur',type:'city',is_active:true,created_at:new Date().toISOString()},
  {id:'loc-deoria',name:'Deoria',name_hi:'देवरिया',slug:'deoria',type:'city',is_active:true,created_at:new Date().toISOString()},
  {id:'loc-maharajganj',name:'Maharajganj',name_hi:'महराजगंज',slug:'maharajganj',type:'city',is_active:true,created_at:new Date().toISOString()},
];
function getLocal():DbLocation[]{ try{const r=localStorage.getItem(LS); if(r) return JSON.parse(r); localStorage.setItem(LS,JSON.stringify(seed)); return seed;}catch{return seed} }
function setLocal(d:DbLocation[]){ try{localStorage.setItem(LS,JSON.stringify(d));}catch{} }
async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{ try{return await fn();}catch(e:any){const m=e?.message||''; if(m.includes('Could not find')||m.includes('Failed to fetch')||m.includes('placeholder')) return fallback; throw e;} }
export const locationsService={
  async list(){ return trySupabase(async()=>{const {data,error}=await supabase.from('locations').select('*').order('type').order('name'); if(error) throw error; return data as DbLocation[];}, getLocal()); },
  async listByType(type:DbLocation['type']){ const all=await locationsService.list(); return all.filter(x=>x.type===type); },
  async create(payload:Partial<DbLocation>){ return trySupabase(async()=>{const {data,error}=await supabase.from('locations').insert(payload).select().single(); if(error) throw error; return data as DbLocation;}, (()=>{
    const l=getLocal(); const n:DbLocation={id:'loc-'+Date.now(), name:payload.name||'New Location', slug:payload.slug||'loc-'+Date.now(), type:(payload.type as any)||'city', is_active:true, created_at:new Date().toISOString(), ...payload} as DbLocation; l.push(n); setLocal(l); return n;
  })()); },
  async update(id:string,payload:Partial<DbLocation>){ return trySupabase(async()=>{const {data,error}=await supabase.from('locations').update(payload as any).eq('id',id).select().single(); if(error) throw error; return data as DbLocation;}, (()=>{
    const l=getLocal(); const i=l.findIndex(x=>x.id===id); if(i>=0){ l[i]={...l[i],...payload} as DbLocation; setLocal(l); return l[i]; } throw new Error('Not found');
  })()); },
  async remove(id:string){ return trySupabase(async()=>{const {error}=await supabase.from('locations').delete().eq('id',id); if(error) throw error;},(()=>{
    setLocal(getLocal().filter(x=>x.id!==id && x.parent_id!==id));
  })() as any); }
};
