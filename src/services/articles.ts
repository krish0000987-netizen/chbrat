import { supabase } from '../lib/supabase';
import { mockArticles } from '../data/mockNewsData';
import { Article, CategoryType } from '../types';

export type ArticleStatus = 'draft'|'review'|'scheduled'|'published'|'unpublished'|'archived';

export interface DbArticle {
  id: string;
  title: string;
  title_hi?: string;
  slug: string;
  subheadline?: string;
  content: string;
  excerpt?: string;
  category_id?: string;
  subcategory?: string;
  state_id?: string;
  city_id?: string;
  locality?: string;
  author_id?: string;
  hero_image_url?: string;
  hero_image_caption?: string;
  thumbnail_url?: string;
  status: ArticleStatus;
  published_at?: string;
  scheduled_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_image?: string;
  is_breaking: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_lead: boolean;
  is_exclusive: boolean;
  is_editors_pick?: boolean;
  is_video?: boolean;
  is_photo?: boolean;
  views_count: number;
  language: 'hi'|'en';
  created_at: string;
  updated_at: string;
  categories?: { id: string; name: string; name_hi: string; slug: string };
  authors?: { id: string; name: string; slug: string; avatar_url: string };
}

export const CATEGORY_LOOKUP: Record<string, { name: CategoryType; name_hi: string; slug: string }> = {
  'cat-desh-videsh': { name: 'India', name_hi: 'देश-विदेश', slug: 'desh-videsh' },
  'cat-pradesh': { name: 'State News', name_hi: 'प्रदेश', slug: 'pradesh' },
  'cat-khel': { name: 'Sports', name_hi: 'खेल', slug: 'khel' },
  'cat-dharm': { name: 'Opinion', name_hi: 'धर्म', slug: 'dharm' },
  'cat-manoranjan': { name: 'Entertainment', name_hi: 'मनोरंजन', slug: 'manoranjan' },
  'cat-vichar': { name: 'Opinion', name_hi: 'विचार', slug: 'vichar' },
  'cat-lifestyle': { name: 'Lifestyle', name_hi: 'लाइफस्टाइल & हेल्थ', slug: 'lifestyle-health' },
  'cat-tech': { name: 'Technology', name_hi: 'टेक', slug: 'tech' },
};

export const STATE_LOOKUP: Record<string, string> = {
  'loc-up': 'Uttar Pradesh',
  'loc-bihar': 'Bihar',
  'loc-delhi': 'Delhi NCR',
  'loc-mp': 'Madhya Pradesh',
  'loc-rajasthan': 'Rajasthan',
  'loc-gujarat': 'Gujarat',
  'loc-maharashtra': 'Maharashtra',
  'loc-uk': 'Uttarakhand',
  'loc-haryana': 'Haryana',
  'loc-punjab': 'Punjab',
  'loc-jharkhand': 'Jharkhand',
  'loc-national': 'National',
};

export const CITY_LOOKUP: Record<string, string> = {
  'loc-kushinagar': 'Kushinagar',
  'loc-padrauna': 'Padrauna',
  'loc-gorakhpur': 'Gorakhpur',
  'loc-deoria': 'Deoria',
  'loc-maharajganj': 'Maharajganj',
  'loc-lucknow': 'Lucknow',
  'loc-varanasi': 'Varanasi',
  'loc-ayodhya': 'Ayodhya',
  'loc-prayagraj': 'Prayagraj',
  'loc-kanpur': 'Kanpur',
  'loc-noida': 'Noida',
};

const TABLE = 'articles';
const LS_KEY = 'cj_articles_db';

export function dbArticleToArticle(d: DbArticle): Article {
  const cat = d.category_id && CATEGORY_LOOKUP[d.category_id]
    ? CATEGORY_LOOKUP[d.category_id]
    : (d.categories
      ? { name: (d.categories.name as CategoryType) || 'India', name_hi: d.categories.name_hi || d.categories.name, slug: d.categories.slug }
      : { name: 'India' as CategoryType, name_hi: 'देश-विदेश', slug: 'desh-videsh' });

  const stateName = (d.state_id && STATE_LOOKUP[d.state_id]) || d.state_id || 'Uttar Pradesh';
  const cityName = (d.city_id && CITY_LOOKUP[d.city_id]) || d.city_id || 'Kushinagar';

  const paragraphs = typeof d.content === 'string'
    ? (d.content.includes('<') ? [d.content] : d.content.split('\n\n').filter(Boolean))
    : (d.content || []);

  return {
    id: d.id,
    slug: d.slug || `article-${d.id}`,
    title: d.title,
    hindiTitle: d.title_hi || d.title,
    subheadline: d.subheadline || d.excerpt || '',
    content: paragraphs.length > 0 ? paragraphs : ['(विवरण उपलब्ध नहीं है)'],
    category: cat.name,
    subcategory: cat.name_hi || d.subcategory || 'ताजा खबर',
    state: stateName,
    city: cityName,
    author: d.authors ? {
      id: d.authors.id,
      name: d.authors.name,
      role: 'Reporter',
      avatar: d.authors.avatar_url || '/assets/logo.jpg',
      bio: 'दैनिक चाणक्य भारत'
    } : {
      id: 'auth-cb',
      name: 'चाणक्य भारत डेस्क',
      role: 'कुशीनगर ब्यूरो',
      avatar: '/assets/logo.jpg',
      bio: 'दैनिक चाणक्य भारत'
    },
    publishedAt: d.published_at || d.created_at || new Date().toISOString(),
    readTimeMinutes: Math.max(2, Math.ceil((d.content?.length || 500) / 250)),
    heroImage: d.hero_image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCaption: d.hero_image_caption || d.title,
    isBreaking: !!d.is_breaking,
    isLeadHero: !!d.is_lead,
    isTrending: !!d.is_trending,
    isExclusive: !!d.is_exclusive,
    tags: [cat.name_hi, cat.name, stateName, cityName, 'Chanakya Bharat'].filter(Boolean),
    viewsCount: d.views_count || 120,
    commentsCount: 0,
    sharesCount: 15,
    isDemo: false
  };
}

// helper: localStorage fallback that mirrors current website data
export function getLocal(): DbArticle[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    // seed from mockArticles on first use - map to DbArticle shape
    const seeded: DbArticle[] = mockArticles.map(m => ({
      id: m.id,
      title: m.title.replace('[DEMO NEWS] ','').replace('[DEMO OPINION] ','').replace('[DEMO EXPLAINER] ','').replace('[DEMO FACT CHECK] ',''),
      title_hi: (m as any).hindiTitle || m.title,
      slug: m.slug,
      subheadline: m.subheadline,
      content: m.content.join('\n\n'),
      excerpt: m.subheadline,
      category_id: undefined,
      subcategory: m.subcategory,
      author_id: undefined,
      hero_image_url: m.heroImage,
      hero_image_caption: m.imageCaption,
      status: 'published' as ArticleStatus,
      published_at: m.publishedAt,
      seo_title: m.title,
      seo_description: m.subheadline,
      is_breaking: !!m.isBreaking,
      is_featured: !!m.isLeadHero,
      is_trending: !!m.isTrending,
      is_lead: !!m.isLeadHero,
      is_exclusive: !!m.isExclusive,
      views_count: m.viewsCount,
      language: 'hi' as const,
      created_at: m.publishedAt,
      updated_at: m.publishedAt,
      categories: { id: 'cat-'+m.category, name: m.category, name_hi: m.category, slug: m.category.toLowerCase() },
      authors: { id: m.author.id, name: m.author.name, slug: m.author.id, avatar_url: m.author.avatar }
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
    setLocal(seeded);
    return seeded;
  } catch { return []; }
}

export function setLocal(data: DbArticle[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    const published = data.filter(x => x.status === 'published');
    const websiteArticles = published.map(dbArticleToArticle);
    localStorage.setItem('ir_articles', JSON.stringify(websiteArticles));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cb_articles_updated', { detail: websiteArticles }));
    }
  } catch (e) {
    console.warn('setLocal error', e);
  }
}

async function trySupabase<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const msg = e?.message || '';
    if (msg.includes('Could not find the table') || msg.includes('Failed to fetch') || msg.includes('placeholder') || msg.includes('schema cache')) {
      return fallback;
    }
    return fallback;
  }
}

export const articlesService = {
  async list(params?: { status?: ArticleStatus; categoryId?: string; search?: string; isBreaking?: boolean; isFeatured?: boolean; limit?: number; offset?: number; order?: string }) {
    return trySupabase(async () => {
      let q = supabase.from(TABLE).select('*, categories(id,name,name_hi,slug), authors(id,name,slug,avatar_url)', { count: 'exact' });
      if (params?.status) q = q.eq('status', params.status);
      if (params?.categoryId) q = q.eq('category_id', params.categoryId);
      if (params?.isBreaking !== undefined) q = q.eq('is_breaking', params.isBreaking);
      if (params?.isFeatured !== undefined) q = q.eq('is_featured', params.isFeatured);
      if (params?.search) q = q.ilike('title', `%${params.search}%`);
      if (params?.order) q = q.order(params.order, { ascending: false });
      else q = q.order('published_at', { ascending: false });
      if (params?.limit) q = q.limit(params.limit);
      if (params?.offset) q = q.range(params.offset, params.offset + (params?.limit || 10) - 1);
      const { data, error, count } = await q;
      if (error) throw error;
      return { data: data as DbArticle[], count };
    }, (() => {
      let d = getLocal();
      if (params?.status) d = d.filter(x => x.status === params.status);
      if (params?.search) d = d.filter(x => x.title.toLowerCase().includes(params.search!.toLowerCase()) || (x.title_hi || '').toLowerCase().includes(params.search!.toLowerCase()));
      if (params?.isBreaking) d = d.filter(x => x.is_breaking);
      if (params?.isFeatured) d = d.filter(x => x.is_featured);
      if (params?.order === 'updated_at') d = [...d].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      else d = [...d].sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
      const count = d.length;
      if (params?.limit) d = d.slice(params.offset || 0, (params.offset || 0) + params.limit);
      return { data: d, count };
    })());
  },

  async getBySlug(slug: string) {
    return trySupabase(async () => {
      const { data, error } = await supabase.from(TABLE).select('*, categories(*), authors(*)').eq('slug', slug).single();
      if (error) throw error;
      return data as DbArticle;
    }, getLocal().find(x => x.slug === slug || x.slug === decodeURIComponent(slug)) as DbArticle);
  },

  async getById(id: string) {
    return trySupabase(async () => {
      const { data, error } = await supabase.from(TABLE).select('*, categories(*), authors(*)').eq('id', id).single();
      if (error) throw error;
      return data as DbArticle;
    }, getLocal().find(x => x.id === id) as DbArticle);
  },

  async create(payload: Partial<DbArticle>) {
    const local = getLocal();
    const catObj = payload.category_id ? CATEGORY_LOOKUP[payload.category_id] : undefined;
    const nowIso = new Date().toISOString();

    const n: DbArticle = {
      id: 'art-' + Date.now(),
      title: payload.title || 'Untitled',
      title_hi: payload.title_hi,
      slug: payload.slug || 'slug-' + Date.now(),
      content: payload.content || '',
      status: payload.status || 'draft',
      is_breaking: !!payload.is_breaking,
      is_featured: !!payload.is_featured,
      is_trending: !!payload.is_trending,
      is_lead: !!payload.is_lead,
      is_exclusive: !!payload.is_exclusive,
      views_count: 0,
      language: (payload.language as any) || 'hi',
      created_at: nowIso,
      updated_at: nowIso,
      published_at: payload.status === 'published' ? (payload.published_at || nowIso) : payload.published_at,
      categories: catObj ? { id: payload.category_id!, name: catObj.name, name_hi: catObj.name_hi, slug: catObj.slug } : undefined,
      ...payload
    } as DbArticle;

    // Immediately save locally
    local.unshift(n);
    setLocal(local);

    return trySupabase(async () => {
      const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
      if (error) throw error;
      return data as DbArticle;
    }, n);
  },

  async update(id: string, payload: Partial<DbArticle>) {
    const local = getLocal();
    const idx = local.findIndex(x => x.id === id);
    let updatedObj: DbArticle;
    const nowIso = new Date().toISOString();

    if (idx >= 0) {
      const catId = payload.category_id !== undefined ? payload.category_id : local[idx].category_id;
      const catObj = catId ? CATEGORY_LOOKUP[catId] : undefined;

      local[idx] = {
        ...local[idx],
        ...payload,
        updated_at: nowIso,
        published_at: payload.status === 'published' && !local[idx].published_at ? nowIso : (payload.published_at ?? local[idx].published_at),
        categories: catObj ? { id: catId!, name: catObj.name, name_hi: catObj.name_hi, slug: catObj.slug } : local[idx].categories
      } as DbArticle;
      updatedObj = local[idx];
      setLocal(local);
    } else {
      throw new Error('Article not found');
    }

    return trySupabase(async () => {
      const { data, error } = await supabase.from(TABLE).update({ ...payload, updated_at: nowIso }).eq('id', id).select().single();
      if (error) throw error;
      return data as DbArticle;
    }, updatedObj);
  },

  async remove(id: string) {
    const local = getLocal().filter(x => x.id !== id);
    setLocal(local);

    return trySupabase(async () => {
      const { error } = await supabase.from(TABLE).delete().eq('id', id);
      if (error) throw error;
    }, null as any);
  },

  async bulkUpdate(ids: string[], payload: Partial<DbArticle>) {
    const local = getLocal();
    const nowIso = new Date().toISOString();
    local.forEach(x => {
      if (ids.includes(x.id)) {
        Object.assign(x, payload, { updated_at: nowIso });
        if (payload.status === 'published' && !x.published_at) {
          x.published_at = nowIso;
        }
      }
    });
    setLocal(local);

    return trySupabase(async () => {
      const { error } = await supabase.from(TABLE).update(payload).in('id', ids);
      if (error) throw error;
    }, null as any);
  },

  async incrementView(id: string) {
    try { await supabase.rpc('increment_article_view', { article_id: id } as any); } catch {}
  }
};
