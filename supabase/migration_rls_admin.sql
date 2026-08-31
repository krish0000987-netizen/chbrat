-- Migration: Enable authenticated admin writes (RLS fix for browser Supabase client)
-- Existing schema only allowed public reads + service_role bypass; browser anon key with authenticated JWT was blocked.
-- This migration adds permissive authenticated policies for CMS tables. For stricter RBAC, replace with role-checked policies.

-- Helper: allow authenticated to INSERT/UPDATE/DELETE on content tables
do $$ begin
  -- Articles
  drop policy if exists "Authenticated can insert articles" on public.articles;
  create policy "Authenticated can insert articles" on public.articles for insert with check (auth.role() = 'authenticated');
  drop policy if exists "Authenticated can update articles" on public.articles;
  create policy "Authenticated can update articles" on public.articles for update using (auth.role() = 'authenticated');
  drop policy if exists "Authenticated can delete articles" on public.articles;
  create policy "Authenticated can delete articles" on public.articles for delete using (auth.role() = 'authenticated');

  -- Categories
  drop policy if exists "Authenticated can manage categories" on public.categories;
  create policy "Authenticated can manage categories" on public.categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Locations
  drop policy if exists "Authenticated can manage locations" on public.locations;
  create policy "Authenticated can manage locations" on public.locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Authors
  drop policy if exists "Authenticated can manage authors" on public.authors;
  create policy "Authenticated can manage authors" on public.authors for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Tags
  drop policy if exists "Authenticated can manage tags" on public.tags;
  create policy "Authenticated can manage tags" on public.tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  drop policy if exists "Authenticated can manage article_tags" on public.article_tags;
  create policy "Authenticated can manage article_tags" on public.article_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Media
  drop policy if exists "Authenticated can manage media" on public.media;
  create policy "Authenticated can manage media" on public.media for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Epapers
  drop policy if exists "Authenticated can manage epapers" on public.epapers;
  create policy "Authenticated can manage epapers" on public.epapers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Breaking news
  drop policy if exists "Authenticated can manage breaking_news" on public.breaking_news;
  create policy "Authenticated can manage breaking_news" on public.breaking_news for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Homepage sections
  drop policy if exists "Authenticated can manage homepage_sections" on public.homepage_sections;
  create policy "Authenticated can manage homepage_sections" on public.homepage_sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Advertisements
  drop policy if exists "Authenticated can manage advertisements" on public.advertisements;
  create policy "Authenticated can manage advertisements" on public.advertisements for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Navigation
  drop policy if exists "Authenticated can manage navigation" on public.navigation_items;
  create policy "Authenticated can manage navigation" on public.navigation_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Comments (allow insert by anyone (guest) but moderation by authenticated)
  drop policy if exists "Anyone can insert comments" on public.comments;
  create policy "Anyone can insert comments" on public.comments for insert with check (true);
  drop policy if exists "Authenticated can manage comments" on public.comments;
  create policy "Authenticated can manage comments" on public.comments for update using (auth.role() = 'authenticated');
  drop policy if exists "Authenticated can delete comments" on public.comments;
  create policy "Authenticated can delete comments" on public.comments for delete using (auth.role() = 'authenticated');

  -- Subscribers (anyone can insert, authenticated can manage)
  drop policy if exists "Anyone can subscribe" on public.subscribers;
  create policy "Anyone can subscribe" on public.subscribers for insert with check (true);
  drop policy if exists "Authenticated can manage subscribers" on public.subscribers;
  create policy "Authenticated can manage subscribers" on public.subscribers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Site settings
  drop policy if exists "Authenticated can manage site_settings" on public.site_settings;
  create policy "Authenticated can manage site_settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Analytics (anyone can insert page_view, authenticated can read)
  drop policy if exists "Anyone can insert analytics" on public.analytics_events;
  create policy "Anyone can insert analytics" on public.analytics_events for insert with check (true);
  drop policy if exists "Authenticated can read analytics" on public.analytics_events;
  create policy "Authenticated can read analytics" on public.analytics_events for select using (auth.role() = 'authenticated');

  -- Audit logs (authenticated can insert/read)
  drop policy if exists "Authenticated can manage audit_logs" on public.audit_logs;
  create policy "Authenticated can manage audit_logs" on public.audit_logs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

  -- Profiles (already has self policies; add admin read)
  drop policy if exists "Authenticated can read all profiles" on public.profiles;
  create policy "Authenticated can read all profiles" on public.profiles for select using (auth.role() = 'authenticated');
  drop policy if exists "Authenticated can update any profile role" on public.profiles;
  create policy "Authenticated can update any profile role" on public.profiles for update using (auth.role() = 'authenticated');

end $$;

-- Storage: ensure all buckets allow authenticated uploads (gallery, site-assets, advertisements, author-images)
drop policy if exists "Auth write gallery" on storage.objects;
create policy "Auth write gallery" on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
drop policy if exists "Auth update gallery" on storage.objects;
create policy "Auth update gallery" on storage.objects for update using (bucket_id = 'gallery' and auth.role() = 'authenticated');
drop policy if exists "Auth delete gallery" on storage.objects;
create policy "Auth delete gallery" on storage.objects for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "Public read gallery" on storage.objects for select using (bucket_id = 'gallery');

drop policy if exists "Public read site-assets" on storage.objects;
create policy "Public read site-assets" on storage.objects for select using (bucket_id = 'site-assets');
drop policy if exists "Auth write site-assets" on storage.objects;
create policy "Auth write site-assets" on storage.objects for insert with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');

drop policy if exists "Public read advertisements" on storage.objects;
create policy "Public read advertisements" on storage.objects for select using (bucket_id = 'advertisements');
drop policy if exists "Auth write advertisements" on storage.objects;
create policy "Auth write advertisements" on storage.objects for insert with check (bucket_id = 'advertisements' and auth.role() = 'authenticated');

drop policy if exists "Public read author-images" on storage.objects;
create policy "Public read author-images" on storage.objects for select using (bucket_id = 'author-images');
drop policy if exists "Auth write author-images" on storage.objects;
create policy "Auth write author-images" on storage.objects for insert with check (bucket_id = 'author-images' and auth.role() = 'authenticated');

-- Scheduled publishing helper function (call via cron)
create or replace function public.publish_scheduled_articles() returns int language plpgsql as $$
declare cnt int;
begin
  update public.articles set status='published', published_at=now() where status='scheduled' and scheduled_at <= now();
  get diagnostics cnt = row_count;
  return cnt;
end; $$;
