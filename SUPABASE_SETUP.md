# Supabase Setup — Chitrakoot Jyoti

## 1) Create Project
You already have: https://pbjxhvuvkiksmueaerfe.supabase.co

## 2) Run Migration
Dashboard → SQL Editor → New Query → paste `supabase/schema.sql` (21KB, 20 tables + RLS + storage buckets + seeds) → Run.

This creates:
- profiles, categories, locations, authors, tags, media, articles, article_tags
- epapers, breaking_news, homepage_sections, advertisements, navigation_items
- comments, site_settings, subscribers, analytics_events, audit_logs
- Storage buckets: article-images, author-images, site-assets, epapers, advertisements, gallery
- Seeds: 8 categories (देश-विदेश etc), 6 locations, homepage sections, site_settings

## 3) Storage
Buckets are auto-created via SQL. Verify: Dashboard → Storage → 6 buckets public.

## 4) Auth — First Admin
Dashboard → Authentication → Users → Add user → email/password → Confirm.

Then SQL:
```sql
update profiles set role='super_admin' where email='your_admin@email.com';
-- or
insert into profiles (id, email, full_name, role) values ('<auth.users.id>','admin@chitrakootjyoti.com','Rajkumar Soni','super_admin');
```

Login at `/admin/login` with that email/password. No demo credentials in code.

## 5) Env
Copy `.env.example` → `.env.local` and fill your Supabase keys:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=... (server only, never expose)
```

## 6) Test CMS
- /admin → Dashboard
- /admin/articles/new → create → Publish → appears on / (homepage fetches published articles via NewsContext)
- /admin/media → upload image → copy URL into article
- /admin/epaper → upload PDF + cover → Publish → appears on /epaper (featured)
- /admin/categories, /admin/authors, /admin/breaking-news → CRUD

## 7) Scheduled Publishing
Articles with status='scheduled' and scheduled_at <= now() should be auto-published. Run via cron/Edge Function or manual:
```sql
update articles set status='published', published_at=now() where status='scheduled' and scheduled_at <= now();
```
Create pg_cron job or call from your deployment.

## 8) RLS Notes
- Public can read published articles, published epapers, active breaking news, enabled homepage sections etc.
- Writes require authenticated user (via Supabase Auth) or service_role (server).
- profiles.role enforces RBAC in UI + RLS (add stricter policies per role as needed).

## 9) Production
- Vercel: set env vars same as .env
- Build: `npm run build` (tested: 751KB)
- No secrets in git ( .gitignore covers .env* )
