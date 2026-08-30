import { supabase } from '../lib/supabase';
export interface DbMedia { id:string; filename:string; storage_path:string; public_url?:string; mime_type?:string; file_size?:number; alt_text?:string; caption?:string; folder:string; created_at:string }
export const mediaService = {
  async list(folder?:string) {
    let q = supabase.from('media').select('*').order('created_at', { ascending:false });
    if (folder) q = q.eq('folder', folder);
    const { data, error } = await q;
    if (error) throw error;
    return data as DbMedia[];
  },
  async upload(file: File, folder='article-images', meta?: { alt_text?:string; caption?:string }) {
    const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
    // map folder to bucket id
    const bucket = ['article-images','author-images','site-assets','epapers','advertisements','gallery'].includes(folder) ? folder : 'article-images';
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type });
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    const { data, error } = await supabase.from('media').insert({
      filename: file.name,
      original_name: file.name,
      storage_path: path,
      public_url: urlData.publicUrl,
      mime_type: file.type,
      file_size: file.size,
      folder: bucket,
      ...meta
    } as any).select().single();
    if (error) throw error;
    return data as DbMedia;
  },
  async remove(id:string) {
    const { data: m } = await supabase.from('media').select('storage_path,folder').eq('id', id).single();
    if (m) {
      const bucket = (m as any).folder || 'article-images';
      await supabase.storage.from(bucket).remove([(m as any).storage_path]);
    }
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  }
};
