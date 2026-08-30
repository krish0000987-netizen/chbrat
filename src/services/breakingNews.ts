import { supabase } from '../lib/supabase';
export interface DbBreaking { id:string; headline:string; headline_hi?:string; article_id?:string; link_url?:string; priority:number; is_active:boolean; start_at:string; expires_at?:string }
export const breakingNewsService = {
  async listActive() {
    const { data, error } = await supabase.from('breaking_news').select('*').eq('is_active', true).order('priority').order('created_at', {ascending:false});
    if (error) throw error;
    return data as DbBreaking[];
  },
  async listAll() {
    const { data, error } = await supabase.from('breaking_news').select('*').order('priority');
    if (error) throw error;
    return data as DbBreaking[];
  },
  async create(payload: Partial<DbBreaking>) {
    const { data, error } = await supabase.from('breaking_news').insert(payload).select().single();
    if (error) throw error;
    return data as DbBreaking;
  },
  async update(id:string, payload: Partial<DbBreaking>) {
    const { data, error } = await supabase.from('breaking_news').update({...payload, updated_at: new Date().toISOString()} as any).eq('id', id).select().single();
    if (error) throw error;
    return data as DbBreaking;
  },
  async remove(id:string) {
    const { error } = await supabase.from('breaking_news').delete().eq('id', id);
    if (error) throw error;
  }
};
