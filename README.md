# Festivibe

A mobile-first festival group planning app. Create a crew, share a link, pick your artists, and see who's going to the same sets.

Built for Coachella 2026 Week 2 (Apr 17–19). No login required — just name and phone number.

---

## Links

| | |
|---|---|
| **Production** | https://festivibe.vercel.app |
| **GitHub** | https://github.com/worktaelim/festivibe |
| **Supabase** | https://supabase.com/dashboard/project/igkfjtvujhzebezxsacs |
| **Vercel** | https://vercel.com/worktaelim/festivibe |

---

## What it does

1. **Create a group** — pick a cover photo, name the crew, add an event website URL
2. **Share the invite** — copies a short link (`/group/abc123`) + invitation message to clipboard
3. **Join** — name and phone required; photo optional; profile pre-fills across groups
4. **Pick artists** — heart artists in the Lineup tab across Fri / Sat / Sun
5. **See overlaps** — Crew tab shows artists 2+ members want to see, with tap-to-text
6. **Edit profile** — tap your avatar anytime to change name or photo
7. **Real-time** — all picks and members sync live via Supabase postgres_changes

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript |
| Database | Supabase (Postgres + Realtime) |
| Storage | Supabase Storage (`covers` bucket) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Styling | Inline styles (no CSS framework) |
| Auth | None — identity stored in localStorage per group |

---

## Project structure

```
app/
  page.tsx                  # Group creation flow (4 steps)
  group/[groupId]/
    page.tsx                # Dynamic group page + OG metadata
components/
  GroupApp.tsx              # Main app shell, all tabs, join form, edit profile
  Icons.tsx                 # 2.5D SVG icon set (Cactus, Heart, Camera, etc.)
lib/
  artists.ts                # Static lineup data — 139 Week 2 artists across 3 days
  db.ts                     # All Supabase queries (groups, members, picks, storage)
  supabase.ts               # Supabase client init
public/
  manifest.json             # PWA manifest
```

---

## Local setup

```bash
git clone https://github.com/worktaelim/festivibe.git
cd festivibe
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://igkfjtvujhzebezxsacs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase dashboard>
```

```bash
npm run dev
# http://localhost:3000
```

---

## Supabase setup

Run this SQL in the [Supabase SQL editor](https://supabase.com/dashboard/project/igkfjtvujhzebezxsacs/sql):

```sql
drop table if exists picks;
drop table if exists members;
drop table if exists groups;

create table groups (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  cover_url   text not null default '',
  website_url text not null default '',
  created_at  timestamptz default now()
);

create table members (
  id        uuid primary key default gen_random_uuid(),
  group_id  uuid references groups(id),
  name      text not null,
  phone     text default '',
  photo_url text default '',
  color     text default '#f72585',
  joined_at timestamptz default now()
);

create table picks (
  id        text primary key,
  group_id  uuid references groups(id),
  member_id uuid references members(id),
  artist_id text not null,
  created_at timestamptz default now()
);

alter table groups  enable row level security;
alter table members enable row level security;
alter table picks   enable row level security;

create policy "public read/write groups"  on groups  for all using (true) with check (true);
create policy "public read/write members" on members for all using (true) with check (true);
create policy "public read/write picks"   on picks   for all using (true) with check (true);
```

Then set up the cover photo storage bucket:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('covers', 'covers', true, 5242880, '{image/jpeg,image/png,image/webp}')
on conflict (id) do nothing;

create policy "Public covers upload" on storage.objects
  for insert to anon with check (bucket_id = 'covers');

create policy "Public covers read" on storage.objects
  for select to anon using (bucket_id = 'covers');
```

---

## How key things work

**Short URLs** — `createGroup` generates a 6-char alphanumeric code (e.g. `abc123`) stored in the `groups.code` column. The URL is `/group/abc123`. `getGroup` detects UUID vs short code and queries accordingly (UUID for old links, code for new ones).

**Identity** — no auth. On join, `memberId` is saved to `localStorage` as `festivibe_member_<group UUID>`. Visiting the same link again restores your session. A separate `festivibe_user` key caches name/phone/photo so they pre-fill when joining a new group.

**Optimistic picks** — `handleToggle` in `GroupApp` updates local `picks` state immediately, then writes to Supabase. On error it reverts. Real-time subscriptions keep other members' views in sync.

**OG preview** — `generateMetadata` in the group page returns `og:title`, `og:description`, and `og:image` (the Supabase Storage URL for the cover photo). OG image only works for groups created after the storage bucket was configured — base64 URLs are filtered out.

**Cover photo upload** — client-side canvas resize to max 800px wide → upload to Supabase Storage `covers` bucket → store public CDN URL. Falls back to base64 if the bucket isn't set up.

**Real-time** — `subscribeMembers` and `subscribePicks` open `postgres_changes` channels filtered by `group_id`. On any event they refetch the full table for that group (simple over delta patching).

---

## Deployment

Vercel is connected to the `main` branch. Every push auto-deploys. No build config needed — Next.js is detected automatically.

Environment variables are set in the Vercel dashboard under Settings → Environment Variables (same two `NEXT_PUBLIC_` keys as `.env.local`).

---

## Git account note

This repo belongs to the `worktaelim` GitHub account. Before pushing:

```bash
gh auth switch --user worktaelim
git push origin main
```
