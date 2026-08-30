import { supabase } from '../lib/supabase';
export const siteSettingsService = {
  async getAll() {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;
    const map: Record<string, any> = {};
    (data as any[]).forEach(r => { try { map[r.key] = JSON.parse(r.value); } catch { map[r.key]=r.value } });
    return map;
  },
  async get(key:string) {
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).single();
    if (error) return null;
    try { return JSON.parse((data as any).value); } catch { return (data as any).value; }
  },
  async set(key:string, value:any) {
    const { error } = await supabase.from('site_settings').upsert({ key, value: JSON.stringify(value) } as any);
    if (error) throw error;
  }
};
