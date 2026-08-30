import { supabase } from '../lib/supabase';

export type ArticleStatus = 'draft'|'review'|'scheduled'|'published'|'unpublished'|'archived';
export interface DbArticle {
  id: string; title: string; title_hi?: string; slug: string; subheadline?: string; content: string; excerpt?: string;
  category_id?: string; subcategory?: string; state_id?: string; city_id?: string; locality?: string;
  author_id?: string; hero_image_url?: string; hero_image_caption?: string; thumbnail_url?: string;
  status: ArticleStatus; published_at?: string; scheduled_at?: string;
  seo_title?: string; seo_description?: string; seo_keywords?: string; canonical_url?: string;
  og_title?: string; og_description?: string; og_image?: string; twitter_image?: string;
  is_breaking: boolean; is_featured: boolean; is_trending: boolean; is_lead: boolean; is_exclusive: boolean;
  is_editors_pick?: boolean; is_video?: boolean; is_photo?: boolean;
  views_count: number; language: 'hi'|'en';
  created_at: string; updated_at: string;
  // joins
  categories?: { id:string; name:string; name_hi:string; slug:string };
  authors?: { id:string; name:string; slug:string; avatar_url:string };
}

const TABLE = 'articles';

export const articlesService = {
  async list(params?: { status?: ArticleStatus; categoryId?: string; search?: string; isBreaking?: boolean; isFeatured?: boolean; limit?: number; offset?: number; order?: string }) {
    let q = supabase.from(TABLE).select('*, categories(id,name,name_hi,slug), authors(id,name,slug,avatar_url)', { count: 'exact' });
    if (params?.status) q = q.eq('status', params.status);
    if (params?.categoryId) q = q.eq('category_id', params.categoryId);
    if (params?.isBreaking !== undefined) q = q.eq('is_breaking', params.isBreaking);
    if (params?.isFeatured !== undefined) q = q.eq('is_featured', params.isFeatured);
    if (params?.search) q = q.ilike('title', `%${params.search}%`);
    if (params?.order) q = q.order(params.order, { ascending: false });
    else q = q.order('published_at', { ascending: false });
    if (params?.limit) q = q.limit(params.limit);
    if (params?.offset) q = q.range(params.offset, params.offset + (params?.limit||10) -1);
    const { data, error, count } = await q;
    if (error) throw error;
    return { data: data as DbArticle[], count };
  },
  async getBySlug(slug: string) {
    const { data, error } = await supabase.from(TABLE).select('*, categories(*), authors(*)').eq('slug', slug).single();
    if (error) throw error;
    return data as DbArticle;
  },
  async getById(id: string) {
    const { data, error } = await supabase.from(TABLE).select('*, categories(*), authors(*)').eq('id', id).single();
    if (error) throw error;
    return data as DbArticle;
  },
  async create(payload: Partial<DbArticle>) {
    const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
    if (error) throw error;
    return data as DbArticle;
  },
  async update(id: string, payload: Partial<DbArticle>) {
    const { data, error } = await supabase.from(TABLE).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as DbArticle;
  },
  async remove(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw error;
  },
  async bulkUpdate(ids: string[], payload: Partial<DbArticle>) {
    const { error } = await supabase.from(TABLE).update(payload).in('id', ids);
    if (error) throw error;
  },
  async incrementView(id: string) {
    // lightweight: rpc or update
    const { error } = await supabase.rpc('increment_article_view', { article_id: id } as any);
    if (error) {
      // fallback: fetch + update
      const { data } = await supabase.from(TABLE).select('views_count').eq('id', id).single();
      if (data) await supabase.from(TABLE).update({ views_count: (data as any).views_count + 1 }).eq('id', id);
    }
  }
};
