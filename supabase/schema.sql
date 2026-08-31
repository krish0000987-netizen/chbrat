-- Chanakya Bharat - Production Supabase Schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/pbjxhvuvkiksmueaerfe/sql
-- Storage buckets: article-images, author-images, site-assets, epapers, advertisements, gallery

-- Enable UUID
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'viewer' check (role in ('super_admin','admin','editor','reporter','viewer')),
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hi text,
  slug text unique not null,
  description text,
  icon text,
  color text default '#8B0000',
  seo_title text,
  seo_description text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_active on public.categories(is_active);

-- LOCATIONS (state -> district -> city -> locality)
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hi text,
  slug text unique not null,
  type text not null check (type in ('state','district','city','locality')),
  parent_id uuid references public.locations(id) on delete cascade,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_locations_parent on public.locations(parent_id);
create index if not exists idx_locations_slug on public.locations(slug);

-- AUTHORS / REPORTERS
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hi text,
  slug text unique not null,
  designation text,
  bio text,
  bio_hi text,
  avatar_url text,
  email text,
  phone text,
  twitter text,
  facebook text,
  instagram text,
  is_active boolean default true,
  article_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_authors_slug on public.authors(slug);

-- TAGS
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- MEDIA LIBRARY
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  original_name text,
  storage_path text not null,
  public_url text,
  mime_type text,
  file_size int,
  width int,
  height int,
  alt_text text,
  caption text,
  credit text,
  folder text default 'general' check (folder in ('article-images','author-images','site-assets','epapers','advertisements','gallery','general')),
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
create index if not exists idx_media_folder on public.media(folder);
create index if not exists idx_media_created on public.media(created_at desc);

-- ARTICLES (core)
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_hi text,
  slug text unique not null,
  subheadline text,
  subheadline_hi text,
  content text not null, -- rich HTML
  excerpt text,
  category_id uuid references public.categories(id) on delete set null,
  subcategory text,
  state_id uuid references public.locations(id) on delete set null,
  district_id uuid references public.locations(id) on delete set null,
  city_id uuid references public.locations(id) on delete set null,
  locality text,
  author_id uuid references public.authors(id) on delete set null,
  hero_image_id uuid references public.media(id) on delete set null,
  hero_image_url text,
  hero_image_caption text,
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft','review','scheduled','published','unpublished','archived')),
  published_at timestamptz,
  scheduled_at timestamptz,
  seo_title text,
  seo_description text,
  seo_keywords text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  twitter_image text,
  is_breaking boolean default false,
  is_featured boolean default false,
  is_trending boolean default false,
  is_lead boolean default false,
  is_exclusive boolean default false,
  is_editors_pick boolean default false,
  is_video boolean default false,
  is_photo boolean default false,
  views_count int default 0,
  language text default 'hi' check (language in ('hi','en')),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_status on public.articles(status);
create index if not exists idx_articles_category on public.articles(category_id);
create index if not exists idx_articles_author on public.articles(author_id);
create index if not exists idx_articles_published on public.articles(published_at desc);
create index if not exists idx_articles_breaking on public.articles(is_breaking) where is_breaking = true;
create index if not exists idx_articles_featured on public.articles(is_featured) where is_featured = true;
create index if not exists idx_articles_search on public.articles using gin (to_tsvector('simple', title || ' ' || coalesce(title_hi,'') || ' ' || coalesce(content,'')));

-- ARTICLE_TAGS pivot
create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- EPAPERS
create table if not exists public.epapers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_hi text,
  edition_date date not null,
  edition_type text default 'daily' check (edition_type in ('daily','weekly','special')),
  description text,
  pdf_storage_path text not null,
  pdf_public_url text,
  cover_image_path text,
  cover_public_url text,
  file_size int,
  page_count int,
  language text default 'hi' check (language in ('hi','en')),
  state text,
  district text,
  status text default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean default false,
  views_count int default 0,
  downloads_count int default 0,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_epapers_date on public.epapers(edition_date desc);
create index if not exists idx_epapers_featured on public.epapers(is_featured) where is_featured = true;
create index if not exists idx_epapers_status on public.epapers(status);

-- BREAKING NEWS
create table if not exists public.breaking_news (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  headline_hi text,
  article_id uuid references public.articles(id) on delete set null,
  link_url text,
  priority int default 0,
  is_active boolean default true,
  start_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_breaking_active on public.breaking_news(is_active) where is_active = true;

-- HOMEPAGE SECTIONS
create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_hi text,
  slug text unique not null,
  section_type text not null check (section_type in ('hero','top_stories','latest','trending','regional','category_block','editors_pick','opinion','business','sports','video','photo','epaper','advertisement','newsletter')),
  layout_type text default 'three_column' check (layout_type in ('hero_grid','three_column','horizontal_rail','list','large_feature','compact_list','two_column','video_grid','photo_grid')),
  category_id uuid references public.categories(id) on delete set null,
  display_order int default 0,
  is_enabled boolean default true,
  item_count int default 4,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_homepage_order on public.homepage_sections(display_order);

-- ADVERTISEMENTS
create table if not exists public.advertisements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null check (position in ('header','top_banner','hero_side','article_top','article_middle','article_bottom','sidebar','footer','mobile_banner')),
  image_url text,
  link_url text,
  html_content text,
  start_date date,
  end_date date,
  is_active boolean default true,
  priority int default 0,
  views_count int default 0,
  clicks_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_ads_position on public.advertisements(position);
create index if not exists idx_ads_active on public.advertisements(is_active) where is_active = true;

-- NAVIGATION
create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  label_hi text,
  url text not null,
  menu_type text not null check (menu_type in ('main','mega','mobile','footer')),
  parent_id uuid references public.navigation_items(id) on delete cascade,
  display_order int default 0,
  is_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_nav_menu on public.navigation_items(menu_type);
create index if not exists idx_nav_order on public.navigation_items(display_order);

-- COMMENTS
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  guest_name text,
  guest_email text,
  body text not null,
  status text default 'pending' check (status in ('pending','approved','rejected','spam')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_comments_article on public.comments(article_id);
create index if not exists idx_comments_status on public.comments(status);

-- SITE SETTINGS (key-value)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz default now()
);

-- SUBSCRIBERS / NEWSLETTER
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  is_active boolean default true,
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

-- ANALYTICS EVENTS
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view','article_view','epaper_view','epaper_download','ad_view','ad_click','search')),
  article_id uuid references public.articles(id) on delete set null,
  epaper_id uuid references public.epapers(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_analytics_type on public.analytics_events(event_type);
create index if not exists idx_analytics_created on public.analytics_events(created_at desc);

-- AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);
create index if not exists idx_audit_user on public.audit_logs(user_id);
create index if not exists idx_audit_entity on public.audit_logs(entity);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);

-- RLS: Enable on all tables (policies allow public read for published content, admin write via service role)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.authors enable row level security;
alter table public.tags enable row level security;
alter table public.media enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.epapers enable row level security;
alter table public.breaking_news enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.advertisements enable row level security;
alter table public.navigation_items enable row level security;
alter table public.comments enable row level security;
alter table public.site_settings enable row level security;
alter table public.subscribers enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;

-- PUBLIC READ policies (published content)
create policy "Public can read published articles" on public.articles for select using (status = 'published' or status = 'scheduled' and scheduled_at <= now());
create policy "Public can read active categories" on public.categories for select using (is_active = true);
create policy "Public can read active locations" on public.locations for select using (is_active = true);
create policy "Public can read active authors" on public.authors for select using (is_active = true);
create policy "Public can read tags" on public.tags for select using (true);
create policy "Public can read published epapers" on public.epapers for select using (status = 'published');
create policy "Public can read active breaking" on public.breaking_news for select using (is_active = true and (expires_at is null or expires_at > now()));
create policy "Public can read enabled homepage" on public.homepage_sections for select using (is_enabled = true);
create policy "Public can read active ads" on public.advertisements for select using (is_active = true and (end_date is null or end_date >= current_date));
create policy "Public can read enabled nav" on public.navigation_items for select using (is_enabled = true);
create policy "Public can read approved comments" on public.comments for select using (status = 'approved');
create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Public can read media" on public.media for select using (true);

-- ADMIN: allow all via service_role (bypass RLS) - no additional policies needed for authenticated admin with service_role
-- For authenticated users, allow self profile read/update
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('article-images','article-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('author-images','author-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-assets','site-assets', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('epapers','epapers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('advertisements','advertisements', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('gallery','gallery', true) on conflict (id) do nothing;

-- STORAGE POLICIES (public read, authenticated write)
create policy "Public read article-images" on storage.objects for select using (bucket_id = 'article-images');
create policy "Auth write article-images" on storage.objects for insert with check (bucket_id = 'article-images' and auth.role() = 'authenticated');
create policy "Auth update article-images" on storage.objects for update using (bucket_id = 'article-images' and auth.role() = 'authenticated');
create policy "Auth delete article-images" on storage.objects for delete using (bucket_id = 'article-images' and auth.role() = 'authenticated');

create policy "Public read epapers" on storage.objects for select using (bucket_id = 'epapers');
create policy "Auth write epapers" on storage.objects for insert with check (bucket_id = 'epapers' and auth.role() = 'authenticated');

-- SEED: default categories (Hindi news)
insert into public.categories (name, name_hi, slug, description, display_order) values
('National & World','देश-विदेश','desh-videsh','National and international news',1),
('State','प्रदेश','pradesh','Uttar Pradesh and Kushinagar',2),
('Sports','खेल','khel','Cricket and sports',3),
('Spiritual','धर्म','dharm','Dharma and religion',4),
('Entertainment','मनोरंजन','manoranjan','Bollywood and entertainment',5),
('Opinion','विचार','vichar','Editorial and opinion',6),
('Lifestyle & Health','लाइफस्टाइल & हेल्थ','lifestyle-health','Health and lifestyle',7),
('Tech','टेक','tech','Technology and AI',8)
on conflict (slug) do nothing;

-- SEED: locations
insert into public.locations (name, name_hi, slug, type) values
('Uttar Pradesh','उत्तर प्रदेश','uttar-pradesh','state'),
('Kushinagar','कुशीनगर','kushinagar','district'),
('Padrauna','पडरौना','padrauna','city'),
('Gorakhpur','गोरखपुर','gorakhpur','city'),
('Deoria','देवरिया','deoria','city'),
('Maharajganj','महराजगंज','maharajganj','city')
on conflict (slug) do nothing;

-- SEED: site settings
insert into public.site_settings (key, value, description) values
('site_name', '"Chanakya Bharat"'::jsonb, 'Website name'),
('site_name_hi', '"चाणक्य भारत"'::jsonb, 'Hindi name'),
('tagline', '"Daily News from Kushinagar to Kushinagar"'::jsonb, 'Tagline'),
('logo_url', '"/assets/logo.jpg"'::jsonb, 'Logo'),
('contact_phone', '"9919529245"'::jsonb, 'Phone'),
('location', '"कुशीनगर (उत्तर प्रदेश)"'::jsonb, 'Location'),
('location_en', '"Kushinagar (Uttar Pradesh)"'::jsonb, 'Location EN'),
('editor_name', '"Chanakya Bharat Editorial Team"'::jsonb, 'Editor'),
('editor_name_hi', '"चाणक्य भारत संपादक मंडल"'::jsonb, 'Editor Hindi'),
('address', '"Kushinagar (UP)"'::jsonb, 'Address')
on conflict (key) do nothing;

-- SEED: homepage sections
insert into public.homepage_sections (title, title_hi, slug, section_type, layout_type, display_order, is_enabled) values
('Hero','मुखपृष्ठ हीरो','hero','hero','hero_grid',1,true),
('Latest News','ताजा समाचार','latest','latest','three_column',2,true),
('State News','प्रदेश समाचार','pradesh','regional','three_column',3,true),
('Astrology','भविष्य जिज्ञासा','bhavishya','category_block','horizontal_rail',4,true),
('Sports','खेल','sports','sports','three_column',5,true),
('E-Paper','ई-पेपर','epaper','epaper','large_feature',6,true)
on conflict (slug) do nothing;

-- FUNCTION: auto update updated_at
create or replace function public.handle_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists set_updated_at_articles on public.articles;
create trigger set_updated_at_articles before update on public.articles for each row execute function public.handle_updated_at();
drop trigger if exists set_updated_at_categories on public.categories;
create trigger set_updated_at_categories before update on public.categories for each row execute function public.handle_updated_at();
drop trigger if exists set_updated_at_authors on public.authors;
create trigger set_updated_at_authors before update on public.authors for each row execute function public.handle_updated_at();
drop trigger if exists set_updated_at_epapers on public.epapers;
create trigger set_updated_at_epapers before update on public.epapers for each row execute function public.handle_updated_at();

-- FUNCTION: create profile on signup
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), 'viewer');
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
