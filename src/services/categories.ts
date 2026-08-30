import { supabase } from '../lib/supabase';
export interface DbCategory { id:string; name:string; name_hi?:string; slug:string; description?:string; icon?:string; color?:string; display_order:number; is_active:boolean; created_at:string }
export const categoriesService = {
  async list() {
    const { data, error } = await supabase.from('categories').select('*').order('display_order');
    if (error) throw error;
    return data as DbCategory[];
  },
  async create(payload: Partial<DbCategory>) {
    const { data, error } = await supabase.from('categories').insert(payload).select().single();
    if (error) throw error;
    return data as DbCategory;
  },
  async update(id:string, payload: Partial<DbCategory>) {
    const { data, error } = await supabase.from('categories').update({...payload, updated_at: new Date().toISOString()} as any).eq('id', id).select().single();
    if (error) throw error;
    return data as DbCategory;
  },
  async remove(id:string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
  async reorder(ids:string[]) {
    // update display_order sequentially
    for (let i=0;i<ids.length;i++) {
      await supabase.from('categories').update({ display_order: i } as any).eq('id', ids[i]);
    }
  }
};
