import { supabase } from '../lib/supabase';
import { mockArticles } from '../data/mockNewsData';

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
  categories?: { id:string; name:string; name_hi:string; slug:string };
  authors?: { id:string; name:string; slug:string; avatar_url:string };
}

const TABLE = 'articles';
const LS_KEY = 'cj_articles_db';

// helper: localStorage fallback that mirrors current website data
function getLocal(): DbArticle[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    // seed from mockArticles on first use - map to DbArticle shape
    const seeded: DbArticle[] = mockArticles.map(m => ({
      id: m.id, title: m.title.replace('[DEMO NEWS] ','').replace('[DEMO OPINION] ','').replace('[DEMO EXPLAINER] ','').replace('[DEMO FACT CHECK] ',''),
      title_hi: (m as any).hindiTitle || m.title, slug: m.slug, subheadline: m.subheadline, content: m.content.join('\n\n'), excerpt: m.subheadline,
      category_id: undefined, subcategory: m.subcategory, author_id: undefined,
      hero_image_url: m.heroImage, hero_image_caption: m.imageCaption,
      status: 'published' as ArticleStatus, published_at: m.publishedAt,
      seo_title: m.title, seo_description: m.subheadline,
      is_breaking: !!m.isBreaking, is_featured: !!m.isLeadHero, is_trending: !!m.isTrending, is_lead: !!m.isLeadHero, is_exclusive: !!m.isExclusive,
      views_count: m.viewsCount, language: 'hi' as const, created_at: m.publishedAt, updated_at: m.publishedAt,
      categories: { id: 'cat-'+m.category, name: m.category, name_hi: m.category, slug: m.category.toLowerCase() },
      authors: { id: m.author.id, name: m.author.name, slug: m.author.id, avatar_url: m.author.avatar }
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
    return seeded;
  } catch { return []; }
}
function setLocal(data: DbArticle[]) { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); localStorage.setItem('ir_articles', JSON.stringify(data.map(d=>({
  id:d.id, slug:d.slug, title:d.title, hindiTitle:d.title_hi, subheadline:d.subheadline||'', content: d.content.split('\n\n'), category: (d.categories?.name as any)||'India',
  author:{ id: d.authors?.id||'auth-1', name: d.authors?.name||'चाणक्य भारत डेस्क', role:'Reporter', avatar: d.authors?.avatar_url||'', bio:'' },
  publishedAt: d.published_at||d.created_at, readTimeMinutes:4, heroImage:d.hero_image_url||'', imageCaption:d.hero_image_caption||'',
  isBreaking:d.is_breaking, isLeadHero:d.is_lead, isTrending:d.is_trending, tags:[], viewsCount:d.views_count, commentsCount:0, sharesCount:0
})))); } catch {} }

async function trySupabase<T>(fn: ()=>Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); } catch(e:any) {
    // table not found or network -> fallback to local
    const msg = e?.message || '';
    if (msg.includes('Could not find the table') || msg.includes('Failed to fetch') || msg.includes('placeholder')) {
      return fallback;
    }
    throw e;
  }
}

export const articlesService = {
  async list(params?: { status?: ArticleStatus; categoryId?: string; search?: string; isBreaking?: boolean; isFeatured?: boolean; limit?: number; offset?: number; order?: string }) {
    return trySupabase(async ()=>{
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
    }, (()=>{ let d=getLocal();
      if (params?.status) d=d.filter(x=>x.status===params.status);
      if (params?.search) d=d.filter(x=>x.title.toLowerCase().includes(params.search!.toLowerCase()) || (x.title_hi||'').toLowerCase().includes(params.search!.toLowerCase()));
      if (params?.isBreaking) d=d.filter(x=>x.is_breaking);
      if (params?.isFeatured) d=d.filter(x=>x.is_featured);
      if (params?.order==='updated_at') d=[...d].sort((a,b)=> new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      const count=d.length;
      if (params?.limit) d=d.slice(params.offset||0, (params.offset||0)+params.limit);
      return { data:d, count };
    })());
  },
  async getBySlug(slug: string) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from(TABLE).select('*, categories(*), authors(*)').eq('slug', slug).single();
      if (error) throw error;
      return data as DbArticle;
    }, getLocal().find(x=>x.slug===slug) as DbArticle);
  },
  async getById(id: string) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from(TABLE).select('*, categories(*), authors(*)').eq('id', id).single();
      if (error) throw error;
      return data as DbArticle;
    }, getLocal().find(x=>x.id===id) as DbArticle);
  },
  async create(payload: Partial<DbArticle>) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
      if (error) throw error;
      return data as DbArticle;
    }, (()=>{
      const local=getLocal();
      const n: DbArticle = { id: 'art-'+Date.now(), title: payload.title||'Untitled', title_hi: payload.title_hi, slug: payload.slug||'slug-'+Date.now(), content: payload.content||'', status: payload.status||'draft', is_breaking:!!payload.is_breaking, is_featured:!!payload.is_featured, is_trending:!!payload.is_trending, is_lead:!!payload.is_lead, is_exclusive:!!payload.is_exclusive, views_count:0, language: (payload.language as any)||'hi', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...payload } as DbArticle;
      local.unshift(n);
      setLocal(local);
      return n;
    })());
  },
  async update(id: string, payload: Partial<DbArticle>) {
    return trySupabase(async ()=>{
      const { data, error } = await supabase.from(TABLE).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return data as DbArticle;
    }, (()=>{
      const local=getLocal();
      const idx=local.findIndex(x=>x.id===id);
      if(idx>=0){ local[idx]={ ...local[idx], ...payload, updated_at: new Date().toISOString() } as DbArticle; setLocal(local); return local[idx]; }
      throw new Error('Not found');
    })());
  },
  async remove(id: string) {
    return trySupabase(async ()=>{
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
    }, (()=>{
      const local=getLocal().filter(x=>x.id!==id);
      setLocal(local);
    })() as any);
  },
  async bulkUpdate(ids: string[], payload: Partial<DbArticle>) {
    return trySupabase(async ()=>{
      const { error } = await supabase.from(TABLE).update(payload).in('id', ids);
      if (error) throw error;
    }, (()=>{
      const local=getLocal();
      local.forEach(x=>{ if(ids.includes(x.id)) Object.assign(x, payload, { updated_at: new Date().toISOString() }); });
      setLocal(local);
    })() as any);
  },
  async incrementView(id: string) {
    try { await supabase.rpc('increment_article_view', { article_id: id } as any); } catch {}
  }
};
