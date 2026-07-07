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
Fetches the latest post from `cinemaemsp.substack.com` RSS feed via `src/lib/substack/rss.ts`, converts HTML to text (`src/lib/substack/parser.ts`), extracts structured sessions (cinema, day, time, title, year, country, duration, director) from the programming grid (`src/lib/substack/programming.ts`).

The main endpoint is **`GET /api/test-substack`** — triggers the full pipeline and returns JSON.

`src/app/page.tsx` is still the boilerplate create-next-app page; real output is through the API route.

## Key Files
- `src/lib/substack/rss.ts` — fetches and parses Substack RSS/XML
- `src/lib/substack/parser.ts` — HTML→text conversion, HTML entity decoding
- `src/lib/substack/programming.ts` — session parser (cinema names, days, film metadata)
- `src/app/api/test-substack/route.ts` — API handler wiring the pipeline

## Notes
- `.env` files are gitignored but no `.env.example` exists — add one if env vars are introduced
- RSS URL is hardcoded (`https://cinemaemsp.substack.com/feed`)
- `sharp` and `unrs-resolver` are listed as ignored built dependencies in pnpm config
