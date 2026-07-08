# cinema-em-sp

## Commands
- `pnpm dev` — Next.js dev server on port 3000
- `pnpm build` — production build (TypeScript + Next.js)
- `pnpm lint` — ESLint (Next.js core-web-vitals + TS configs)
- `pnpm start` — start production server
- No test framework configured

## Architecture
- Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4
- Path alias: `@/*` → `./src/*`
- Package manager: pnpm (workspace config in `pnpm-workspace.yaml`)
- TypeScript strict mode on

## Purpose & Flow
Fetches the latest post from `cinemaemsp.substack.com` RSS feed via `src/lib/substack/rss.ts`, extracts structured sessions (cinema, day, time, title, year, country, duration, director) from the programming HTML using JSDOM (`src/lib/substack/programming-dom.ts`).

The main endpoint is **`GET /api/refresh`** — triggers the full pipeline, fetches TMDB posters, caches to JSON, and revalidates the frontend.

`src/app/page.tsx` loads cached data and renders the session table component.

## Key Files
- `src/lib/substack/rss.ts` — fetches and parses Substack RSS/XML
- `src/lib/substack/programming-dom.ts` — session parser (cinema names, days, film metadata) using JSDOM
- `src/lib/substack/programming.ts` — cinema/day constants shared across modules
- `src/lib/tmdb.ts` — TMDB API client (search movie by title+year, returns poster URL)
- `src/lib/substack/store.ts` — save/load sessions to/from `public/data/sessions.json`
- `src/app/api/refresh/route.ts` — main refresh endpoint (fetches RSS, parses, fetches posters, saves)
- `src/app/api/sessions/route.ts` — serves stored sessions (supports `?from=` and `?to=` date filters)
- `src/app/api/test-substack/route.ts` — legacy debug endpoint (latest post only)

## Notes
- `.env` files are gitignored — copy `.env.example` to `.env.local` and add `TMDB_API_KEY=your_key`
- RSS URL is hardcoded (`https://cinemaemsp.substack.com/feed`)
- `sharp` and `unrs-resolver` are listed as ignored built dependencies in pnpm config
