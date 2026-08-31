# Supabase Setup — Chanakya Bharat (खोजी समाचार)

Project: **https://rvfnauieyvomeftwrbxn.supabase.co**  
Brand: चाणक्य भारत | Kushinagar (Uttar Pradesh) | 9919529245

## 1. Apply Schema

Open **Supabase Dashboard → SQL Editor** for project `rvfnauieyvomeftwrbxn`:

https://supabase.com/dashboard/project/rvfnauieyvomeftwrbxn/sql

Copy **entire** `supabase/schema.sql` (449 lines) and Run. It creates:

- `profiles`, `categories`, `locations`, `authors`, `tags`, `media`, `articles`, `article_tags`, `epapers`, `breaking_news`, `homepage_sections`, `advertisements`, `navigation_items`, `comments`, `site_settings`, `subscribers`, `analytics_events`, `audit_logs`
- RLS enabled (public can read published/active content; authenticated can manage via service_role)
- Storage buckets: `article-images`, `author-images`, `site-assets`, `epapers`, `advertisements`, `gallery` (public)
- Seeds: 8 categories (देश-विदेश ... टेक), locations (Uttar Pradesh → Kushinagar → Padrauna ...), site_settings (site_name=Chanakya Bharat, tagline=खोजी समाचार, phone=9919529245, location=कुशीनगर...), homepage sections
- Triggers: `handle_updated_at`, `handle_new_user` (auto profile on signup)

Verify:

```sql
select * from site_settings;
select * from categories;
select * from storage.buckets;
```

## 2. Auth

Enable **Email/Password** in Authentication → Providers.

Create first user via Admin UI `/admin/login` → Sign Up, then promote:

```sql
update public.profiles set role='super_admin' where email='your-email@example.com';
-- roles: super_admin, admin, editor, reporter, viewer
```

## 3. Storage

Buckets are created by schema. Verify in Dashboard → Storage. If missing, create manually as **public**.

Policies: public read, authenticated write (already in schema). For `site-assets` logo upload:

```sql
-- already included
create policy "Public read site-assets" on storage.objects for select using (bucket_id='site-assets');
create policy "Auth write site-assets" on storage.objects for insert with check (bucket_id='site-assets' and auth.role()='authenticated');
```

## 4. Environment Variables

`.env` / `.env.local` (Vite):

```
VITE_SUPABASE_URL=https://rvfnauieyvomeftwrbxn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
SUPABASE_URL=https://rvfnauieyvomeftwrbxn.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx
SUPABASE_JWKS_URL=https://rvfnauieyvomeftwrbxn.supabase.co/auth/v1/.well-known/jwks.json
```

Never expose `SUPABASE_SECRET_KEY` in browser.

## 5. Test

```bash
npm install
npm run dev
# visit http://localhost:3000 and /admin/login
```

## 6. Seed Demo (optional, clearly marked)

Insert one published article to test homepage:

```sql
insert into articles (title, title_hi, slug, content, category_id, status, published_at, is_featured)
values ('Test Article','टेस्ट खबर','test-article','<p>Demo content for Chanakya Bharat — खोजी समाचार</p>', (select id from categories limit 1), 'published', now(), true);
```

Remove demo seed before production.

## 7. Current Status

As of 31 Aug 2026, the `rvfnauieyvomeftwrbxn` project **has no tables** (checked via anon query → "Could not find table"). You must run `supabase/schema.sql` once. After that, the site will show live Supabase data; otherwise it falls back to mock + localStorage (branded as Chanakya Bharat).

