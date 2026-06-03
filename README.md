# RateThe90

Production-ready, mobile-first PWA for logging football matches with spoiler-hidden scores by default.

## Tech

- Next.js App Router + TypeScript
- Tailwind CSS
- TanStack Query
- Supabase (Auth + Postgres + RLS)
- football-data.org (server-side only)
- date-fns + date-fns-tz
- lucide-react

## Setup

1. Create a Supabase project.
2. Run SQL from `/supabase/schema.sql` in Supabase SQL Editor.
3. In Supabase Auth URL config, add redirect URLs:
   - `http://localhost:3000/**`
4. Create a football-data.org API token.
5. Copy `.env.example` to `.env.local` and fill values.
6. Install deps and run:
   - `npm install`
   - `npm run dev`

## Environment variables

See `.env.example`.

## Notes

- `FOOTBALL_DATA_TOKEN` is server-only and never exposed to the browser.
- Browser uses internal API routes under `/api/football/*`.
- Scores are spoiler-hidden by default and reveal state is local-only (`localStorage`).
- PWA shell is installable with `manifest.webmanifest` + service worker fallback.
