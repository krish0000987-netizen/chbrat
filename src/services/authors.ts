import { supabase } from '../lib/supabase';
export interface DbAuthor { id:string; name:string; name_hi?:string; slug:string; designation?:string; bio?:string; avatar_url?:string; email?:string; is_active:boolean; article_count:number; created_at:string }
export const authorsService = {
  async list() {
    const { data, error } = await supabase.from('authors').select('*').order('created_at');
    if (error) throw error;
    return data as DbAuthor[];
  },
  async create(payload: Partial<DbAuthor>) {
    const { data, error } = await supabase.from('authors').insert(payload).select().single();
    if (error) throw error;
    return data as DbAuthor;
  },
  async update(id:string, payload: Partial<DbAuthor>) {
    const { data, error } = await supabase.from('authors').update({...payload, updated_at: new Date().toISOString()} as any).eq('id', id).select().single();
    if (error) throw error;
    return data as DbAuthor;
  },
  async remove(id:string) {
    const { error } = await supabase.from('authors').delete().eq('id', id);
    if (error) throw error;
  }
};
