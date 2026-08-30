import { supabase } from '../lib/supabase';
export interface DbEpaper { id:string; title:string; title_hi?:string; edition_date:string; edition_type:string; description?:string; pdf_storage_path:string; pdf_public_url?:string; cover_image_path?:string; cover_public_url?:string; file_size?:number; page_count?:number; language:string; status:string; is_featured:boolean; views_count:number; downloads_count:number; published_at?:string; created_at:string }
export const epapersService = {
  async list(params?: { status?: string; featured?: boolean; limit?: number }) {
    let q = supabase.from('epapers').select('*').order('edition_date', { ascending:false });
    if (params?.status) q = q.eq('status', params.status);
    if (params?.featured !== undefined) q = q.eq('is_featured', params.featured);
    if (params?.limit) q = q.limit(params.limit);
    const { data, error } = await q;
    if (error) throw error;
    return data as DbEpaper[];
  },
  async getFeatured() {
    const { data, error } = await supabase.from('epapers').select('*').eq('is_featured', true).eq('status','published').order('edition_date',{ascending:false}).limit(1).single();
    if (error) return null;
    return data as DbEpaper;
  },
  async getById(id:string) {
    const { data, error } = await supabase.from('epapers').select('*').eq('id', id).single();
    if (error) throw error;
    return data as DbEpaper;
  },
  async create(payload: Partial<DbEpaper>) {
    const { data, error } = await supabase.from('epapers').insert(payload).select().single();
    if (error) throw error;
    return data as DbEpaper;
  },
  async update(id:string, payload: Partial<DbEpaper>) {
    const { data, error } = await supabase.from('epapers').update({...payload, updated_at: new Date().toISOString()} as any).eq('id', id).select().single();
    if (error) throw error;
    return data as DbEpaper;
  },
  async remove(id:string) {
    const { error } = await supabase.from('epapers').delete().eq('id', id);
    if (error) throw error;
  },
  async uploadPdf(file: File, coverFile?: File) {
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
  }
};
