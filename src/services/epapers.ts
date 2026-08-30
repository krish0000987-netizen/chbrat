import { supabase } from '../lib/supabase';

export interface DbEpaper { id:string; title:string; title_hi?:string; edition_date:string; edition_type:string; description?:string; pdf_storage_path:string; pdf_public_url?:string; cover_image_path?:string; cover_public_url?:string; file_size?:number; page_count?:number; language:string; status:string; is_featured:boolean; views_count:number; downloads_count:number; published_at?:string; created_at:string; updated_at?:string }

const LS_KEY='cj_epapers_db';
function getLocal(): DbEpaper[] {
  try { const r=localStorage.getItem(LS_KEY); return r?JSON.parse(r):[]; } catch{ return []; }
}
function setLocal(d:DbEpaper[]){ try{ localStorage.setItem(LS_KEY, JSON.stringify(d)); }catch{} }

async function trySupabase<T>(fn:()=>Promise<T>, fallback:T):Promise<T>{
  try{ return await fn(); } catch(e:any){
    const m=e?.message||'';
    if(m.includes('Could not find the table') || m.includes('Failed to fetch') || m.includes('placeholder')) return fallback;
    throw e;
  }
}

export const epapersService = {
  async list(params?: { status?: string; featured?: boolean; limit?: number }) {
    return trySupabase(async ()=>{
      let q = supabase.from('epapers').select('*').order('edition_date', { ascending:false });
      if (params?.status) q = q.eq('status', params.status);
      if (params?.featured !== undefined) q = q.eq('is_featured', params.featured);
      if (params?.limit) q = q.limit(params.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data as DbEpaper[];
    }, (()=>{
      let d=getLocal();
      if(params?.status) d=d.filter(x=>x.status===params.status);
      if(params?.featured!==undefined) d=d.filter(x=>x.is_featured===params.featured);
      if(params?.limit) d=d.slice(0, params.limit);
      return d;
    })());
  },
  async getFeatured() {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from('epapers').select('*').eq('is_featured', true).eq('status','published').order('edition_date',{ascending:false}).limit(1).single();
      if (error) return null;
      return data as DbEpaper;
    }, getLocal().find(x=>x.is_featured && x.status==='published') || null);
  },
  async getById(id:string) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from('epapers').select('*').eq('id', id).single();
      if (error) throw error;
      return data as DbEpaper;
    }, getLocal().find(x=>x.id===id) as DbEpaper);
  },
  async create(payload: Partial<DbEpaper>) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from('epapers').insert(payload).select().single();
      if (error) throw error;
      return data as DbEpaper;
    }, (()=>{
      const local=getLocal();
      const n:DbEpaper={ id:'ep-'+Date.now(), title:payload.title||'E-Paper', edition_date:payload.edition_date||new Date().toISOString().slice(0,10), edition_type:payload.edition_type||'daily', pdf_storage_path:payload.pdf_storage_path||'', pdf_public_url:payload.pdf_public_url, cover_image_path:payload.cover_image_path, cover_public_url:payload.cover_public_url, file_size:payload.file_size, language:payload.language||'hi', status:payload.status||'published', is_featured:!!payload.is_featured, views_count:0, downloads_count:0, published_at:new Date().toISOString(), created_at:new Date().toISOString() } as DbEpaper;
      local.unshift(n);
      setLocal(local);
      return n;
    })());
  },
  async update(id:string, payload: Partial<DbEpaper>) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from('epapers').update({...payload, updated_at: new Date().toISOString()} as any).eq('id', id).select().single();
      if (error) throw error;
      return data as DbEpaper;
    }, (()=>{
      const local=getLocal();
      const idx=local.findIndex(x=>x.id===id);
      if(idx>=0){ local[idx]={ ...local[idx], ...payload } as DbEpaper; setLocal(local); return local[idx]; }
      throw new Error('Not found');
    })());
  },
  async remove(id:string) {
    return trySupabase(async ()=>{
      const { error } = await supabase.from('epapers').delete().eq('id', id);
      if (error) throw error;
    }, (()=>{
      setLocal(getLocal().filter(x=>x.id!==id));
    })() as any);
  },
  async uploadPdf(file: File, coverFile?: File) {
    // try Supabase Storage, fallback to local object URL
    try {
      const pdfName = `epapers/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
      const { error: pdfErr } = await supabase.storage.from('epapers').upload(pdfName, file, { contentType: 'application/pdf' });
      if (pdfErr) throw pdfErr;
      const { data: pdfUrl } = supabase.storage.from('epapers').getPublicUrl(pdfName);
      let coverUrl: string | undefined;
      let coverPath: string | undefined;
      if (coverFile) {
        const coverName = `epapers/covers/${Date.now()}-${coverFile.name.replace(/\s+/g,'-')}`;
        const { error: covErr } = await supabase.storage.from('epapers').upload(coverName, coverFile);
        if (covErr) throw covErr;
        const { data } = supabase.storage.from('epapers').getPublicUrl(coverName);
        coverUrl = data.publicUrl;
        coverPath = coverName;
      }
      return { pdfPath: pdfName, pdfUrl: pdfUrl.publicUrl, coverPath, coverUrl, fileSize: file.size };
    } catch {
      // local fallback: create blob URLs (will not persist across reloads but works for demo integration)
      const pdfUrl = URL.createObjectURL(file);
      let coverUrl: string | undefined;
      let coverPath: string | undefined;
      if (coverFile) {
        coverUrl = URL.createObjectURL(coverFile);
        coverPath = 'local-cover';
      }
      return { pdfPath: 'local/'+file.name, pdfUrl, coverPath, coverUrl, fileSize: file.size };
    }
  }
};
