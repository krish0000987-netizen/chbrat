# चाणक्य भारत — खोजी समाचार

**Chanakya Bharat** — Dharohar, Dharma, Desh-Videsh ki Khoji Khabar | **कुशीनगर (उत्तर प्रदेश)** | 📞 **9919529245**

Production-ready Hindi news portal — **Supabase + Vite React + Vercel**.

Brand: **चाणक्य भारत** (Chanakya Bharat)  
Tagline: **खोजी समाचार** (Investigative News)  
Location: **कुशीनगर (उत्तर प्रदेश)**  
Phone: **9919529245**

## Quick Start

```bash
npm install
cp .env.example .env.local  # fill with your Supabase keys
npm run dev     # http://localhost:3000
npm run build   # production build -> dist/
```

## Supabase Setup (required — tables not yet created on rvfn... project)

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/rvfnauieyvomeftwrbxn/sql
2. Copy entire `supabase/schema.sql` and **Run** in SQL Editor (creates 18 tables, RLS, storage buckets, seeds).
3. In **Authentication > Providers** enable Email/Password.
4. Create first super_admin:
```sql
-- after signup via /admin/login with your email, run:
update public.profiles set role='super_admin' where email='your-email@example.com';
```
5. In **Storage** verify buckets: `article-images`, `author-images`, `site-assets`, `epapers`, `advertisements`, `gallery` (created by schema).
6. Update `.env` with project keys:
```
VITE_SUPABASE_URL=https://rvfnauieyvomeftwrbxn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable__o0ts74iGN8rnOJd0Y_mEA_YFXHlUkT
```

## Environment Variables

Required (browser):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)

Required (server / Edge Functions only):

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) — **never expose in browser**
- `SUPABASE_JWKS_URL`

See `.env.example` for template.

## Admin Panel

Routes (protected):

- `/admin/login` — Email/password login (Supabase Auth)
- `/admin` — Dashboard (live Supabase stats)
- `/admin/articles` — CRUD + publish workflow (draft → review → scheduled → published)
- `/admin/categories` — Hindi/EN name, slug, icon, color, ordering
- `/admin/locations` — State → District → City → Locality (Kushinagar focus)
- `/admin/authors` — Reporters
- `/admin/media` — Supabase Storage `site-assets`, `article-images`, etc.
- `/admin/breaking-news` — Ticker with start/expiry, priority
- `/admin/epaper` — PDF + cover upload to `epapers` bucket
- `/admin/homepage` — Drag to order sections (hero, latest, regional, etc.)
- `/admin/navigation` — Main/mega/mobile/footer menus
- `/admin/advertisements` — Position, dates, priority
- `/admin/seo` — Site-wide meta, OG, canonical
- `/admin/comments` — pending/approved/rejected/spam
- `/admin/subscribers` — newsletter
- `/admin/analytics` — real events (page_view, article_view, etc.)
- `/admin/activity` — audit_logs
- `/admin/users` — role management (super_admin, admin, editor, reporter, viewer)
- `/admin/settings` — **Logo upload** via `site-assets` bucket + branding, contact (9919529245), social, SEO, footer

Roles & permissions enforced via DB RLS + central `can*` checks (see `src/context/AuthContext.tsx`).

## Logo System

No hard-coded logo. Admin → **Site Settings > Branding/General**:

- Upload logo → stored in `site-assets` bucket
- Replace / preview / remove / set active logo
- Favicon, OG default image
- Site name (hi/en), tagline (खोजी समाचार), phone, location, social links

Frontend loads `site_settings` dynamically ( `siteSettingsService.getAll()` ).

## Kushinagar Local Focus

Default locations seeded: Uttar Pradesh → Kushinagar → Padrauna, Gorakhpur, Deoria, Maharajganj.
All category/state/city routes support location filtering: `/state/uttar-pradesh`, `/city/uttar-pradesh/kushinagar`, `/category/:slug`.

## Public Website

- `/` — Homepage (hero, latest, regional UP/Kushinagar, astrology, sports, epaper, ads)
- `/article/:id` — SEO + JSON-LD, share, print, related, comments (approved only)
- `/category/:slug`, `/state/:stateId`, `/city/:stateId/:cityName`, `/videos`, `/photos`, `/web-stories`, `/epaper`, `/authors`, `/live`, `/search`

## Deployment (Vercel)

```bash
vercel --token $VERCEL_TOKEN --prod --yes \
  -e VITE_SUPABASE_URL=https://rvfnauieyvomeftwrbxn.supabase.co \
  -e VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable__o0ts74iGN8rnOJd0Y_mEA_YFXHlUkT \
  -e NEXT_PUBLIC_SUPABASE_URL=https://rvfnauieyvomeftwrbxn.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__o0ts74iGN8rnOJd0Y_mEA_YFXHlUkT
```

`vercel.json` handles SPA rewrites (`/index.html`).

## Verification

```bash
npm run lint   # tsc --noEmit
npm run build  # vite build
```

Check mobile, dark mode, ticker, search, epaper, and admin auth guards.

## Previous Brand Cleanup

All traces of **Chitrakoot Jyoti / चित्रकूट ज्योति / 8827294576 / Bhopal** removed. Search:

```bash
grep -r "Chitrakoot" --include="*.tsx" --include="*.ts" src/  # should be 0
```

Branding now reads **चाणक्य भारत • खोजी समाचार • कुशीनगर (उत्तर प्रदेश) • 9919529245** everywhere.
