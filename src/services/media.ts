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
    const bucket = ['article-images','author-images','site-assets','epapers','advertisements','gallery'].includes(folder) ? folder : 'article-images';

    // helper: fallback to base64 data URL when Supabase storage/DB is unavailable
    const toDataUrl = async (): Promise<DbMedia> => {
      const b64 = await new Promise<string>((resolve, reject)=>{
        const r = new FileReader();
        r.onload = ()=> resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      // try to store meta in media table if possible, but don't fail if table missing
      try {
        const { data } = await supabase.from('media').insert({
          filename: file.name,
          original_name: file.name,
          storage_path: `fallback/${path}`,
          public_url: b64,
          mime_type: file.type,
          file_size: file.size,
          folder: bucket,
          ...meta
        } as any).select().single();
        if (data) return { ...(data as any), public_url: b64 } as DbMedia;
      } catch {}
      // pure fallback object
      return {
        id: `local-${Date.now()}`,
        filename: file.name,
        storage_path: `fallback/${path}`,
        public_url: b64,
        mime_type: file.type,
        file_size: file.size,
        folder: bucket,
        created_at: new Date().toISOString(),
      } as DbMedia;
    };

    try {
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      // verify url is usable (not placeholder)
      if (!publicUrl || publicUrl.includes('placeholder')) throw new Error('Invalid public URL');

      try {
        const { data, error } = await supabase.from('media').insert({
          filename: file.name,
          original_name: file.name,
          storage_path: path,
          public_url: publicUrl,
          mime_type: file.type,
          file_size: file.size,
          folder: bucket,
          ...meta
        } as any).select().single();
        if (error) throw error;
        return data as DbMedia;
      } catch (dbErr:any) {
        // bucket uploaded but DB insert failed (table missing) — still return usable URL
        console.warn('[media] DB insert failed, returning storage URL', dbErr?.message);
        return {
          id: `storage-${Date.now()}`,
          filename: file.name,
          storage_path: path,
          public_url: publicUrl,
          mime_type: file.type,
          file_size: file.size,
          folder: bucket,
          created_at: new Date().toISOString(),
        } as DbMedia;
      }
    } catch (e:any) {
      console.warn('[media] Supabase upload failed, falling back to base64:', e?.message);
      return toDataUrl();
    }
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
