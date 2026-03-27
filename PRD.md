# Festivibe — Product Requirements Document

**Last updated:** March 27, 2026
**Status:** Live (v1)
**Owner:** Talim (worktaelim)

---

## Overview

Festivibe is a mobile-first group planning app for music festivals. A friend creates a group, shares a short link, and the whole crew can join, mark which artists they want to see, and discover who's going to the same sets.

The target experience is Partiful-level polish — dark, festive, dead-simple to use at a festival with one hand and bad signal.

**Current scope:** Coachella 2026 Week 2 (Apr 17–19, 139 artists)

---

## Problem

Festival groups plan over group chats — messy threads, no shared view, conflicts discovered too late. There's no lightweight tool that lets a group of friends coordinate which sets they're each attending without making accounts, downloading an app, or doing heavy setup.

---

## Users

- A group of ~8 friends attending a festival together
- Ages ~20–35, all on iPhone
- At the festival: bad signal, one-handed use, sun on screen
- Casual usage: check-and-go, not a productivity tool

---

## Core user journey

1. One person creates a group — adds a cover photo, names the crew, optionally links the event site
2. They tap "+ Invite", a message + short link is copied: *"[Name] invites you to [Group]! Come pick your artists... festivibe.vercel.app/group/abc123"*
3. Friends open the link, enter name + phone (required), optional photo
4. Everyone hearts artists they want to see across Fri / Sat / Sun
5. The Crew tab shows artists that 2+ people want — with a "Text" button to coordinate
6. Anyone can tap an artist name to open Spotify / YouTube / Instagram links

---

## Features (v1 — shipped)

### Group creation
- 4-step flow: cover photo → group name → event website URL (optional) → your info
- Cover photo uploaded to Supabase Storage, served via CDN (real URL for OG previews)
- Short group URL: `/group/abc123` (6-char alphanumeric code)

### Joining
- Name (required) + phone (required) + photo (optional)
- Profile saves to `localStorage` and pre-fills when joining future groups
- No authentication — identity is localStorage-based per group

### Lineup tab
- 139 Coachella 2026 Week 2 artists across 3 days
- Filter by day (Fri / Sat / Sun)
- Search bar
- Heart toggle with optimistic UI update
- Avatar stack under each artist showing who else is interested
- Tap artist name → bottom sheet with Spotify / YouTube / Instagram deep links (URL patterns, no API)

### My Picks tab
- Your picks grouped by day
- Shows which crewmates are also going
- Remove button

### Crew tab
- Artists with 2+ interested members, sorted by count
- Per-member "Text" button (sms: link) for quick coordination
- Highlights artists you've also picked

### Header / sharing
- Full-bleed cover photo hero with gradient overlay (when set)
- Group name, member count, optional "Official site ↗" link
- "+ Invite" copies `[Name] invites you to [Group]!\n[short URL]` to clipboard
- OG meta tags: `og:title`, `og:description`, `og:image` for link previews in iMessage / WhatsApp

### Profile editing
- Tap your avatar (top-right) → edit name and photo
- Saves to Supabase + updates `localStorage` profile cache

### Pull-to-refresh
- Swipe down on any tab → refetches members and picks from Supabase

### Real-time sync
- All members see picks update live via Supabase `postgres_changes` subscriptions

---

## What was explicitly excluded from v1

| Feature | Reason excluded |
|---|---|
| Spotify / streaming API | Weak signal at festivals; URL patterns are good enough |
| Phone number verification (OTP) | Overkill for the use case; may add later |
| Push notifications | Scope |
| Week 1 artists | Start with Week 2 only; expand later |
| Other festivals | Expand later |
| Native app | PWA via web is sufficient for now |

---

## Roadmap (not prioritized)

### Near-term
- **Multi-festival support** — let users search for a festival and create a group for it (not hardcoded to Coachella W2)
- **Week 1 lineup** — add Coachella 2026 Week 1 artists
- **Phone verification** — OTP via Supabase Auth so identity persists across devices
- **Set times** — add stage and time data to artists; show schedule conflicts

### Medium-term
- **My festivals** — a home screen showing all the festival groups you've joined
- **Artist discovery** — suggest artists based on who in your crew is going
- **Group chat / comments** — lightweight reactions or comments on picks
- **Notifications** — "3 people just added Kendrick — you in?"

### Long-term
- **Any festival** — ingest lineup data for any festival (Glastonbury, Lollapalooza, etc.)
- **Native app** — if growth warrants it

---

## Design principles

- **One-handed on mobile** — all tap targets 44px+, no hover-dependent UI
- **Dark + festive** — `#0a0a0f` background, pink/purple gradient accent (`#f72585` → `#7b2fff`)
- **Instant feedback** — optimistic updates everywhere, real-time sync in background
- **No friction** — no account creation, no email, no passwords
- **Low-bandwidth friendly** — static artist data, compressed images, no streaming APIs

---

## Data model

```
groups
  id          uuid PK
  code        text UNIQUE       -- short URL slug (e.g. "abc123")
  name        text
  cover_url   text              -- Supabase Storage CDN URL (or empty)
  website_url text              -- optional event site link
  created_at  timestamptz

members
  id        uuid PK
  group_id  uuid → groups.id
  name      text
  phone     text
  photo_url text                -- base64 data URL (128px square)
  color     text                -- fallback avatar color
  joined_at timestamptz

picks
  id         text PK            -- "{member_id}_{artist_id}"
  group_id   uuid → groups.id
  member_id  uuid → members.id
  artist_id  text               -- matches Artist.id in lib/artists.ts
  created_at timestamptz
```

---

## Infrastructure

| Service | Plan | Notes |
|---|---|---|
| Vercel | Hobby (free) | Auto-deploy from `main` |
| Supabase | Free tier | Postgres + Realtime + Storage |
| GitHub | worktaelim/festivibe | Personal account |

No custom domain yet. Currently at `festivibe.vercel.app`.
