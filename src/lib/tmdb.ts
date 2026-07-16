const BASE = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/w500";

let lastCall = 0;

async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastCall;
  if (elapsed < 350) {
    await new Promise((r) => setTimeout(r, 350 - elapsed));
  }
  lastCall = Date.now();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

function significantWords(title: string): string[] {
  const stop = new Set(["o", "a", "os", "as", "do", "da", "dos", "das", "de", "em", "no", "na", "nos", "nas", "e", "ou", "um", "uma", "uns", "umas", "para", "por", "com", "sem", "sob", "sobre"]);
  return title.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stop.has(w));
}

function cleanTitle(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/:|;|,/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type TmdbResult = { poster_path?: string | null; release_date?: string; original_title?: string; title?: string };
type TmdbPerson = { id: number; name: string };
type TmdbCredit = { id: number; title?: string; original_title?: string; release_date?: string; poster_path?: string | null; job?: string; department?: string };

async function tmdbFetch(url: string): Promise<{ results?: TmdbResult[] } | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

function findYearMatch(results: TmdbResult[], year: number, title: string): TmdbResult | undefined {
  const clean = cleanTitle(title).toLowerCase();
  let best: TmdbResult | undefined;
  let bestDist = Infinity;

  for (const r of results) {
    if (!r.poster_path) continue;
    const ry = r.release_date ? parseInt(r.release_date.slice(0, 4)) : 0;
    if (ry !== year) continue;

    const rTitle = cleanTitle(r.title || "").toLowerCase();
    const rOrig = cleanTitle(r.original_title || "").toLowerCase();
    const rClean = rOrig || rTitle;

    const dist = Math.min(
      rTitle ? levenshtein(clean, rTitle) : Infinity,
      rOrig ? levenshtein(clean, rOrig) : Infinity,
    );

    if (dist < bestDist) {
      bestDist = dist;
      best = r;
    }
  }

  if (best && bestDist <= Math.max(2, Math.floor(clean.length * 0.25))) {
    return best;
  }
}

export async function searchMovie(
  title: string,
  year: number,
  director?: string,
  originalTitle?: string,
): Promise<string | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  await rateLimit();

  const clean = cleanTitle(title);
  if (!clean) return null;

  const base = encodeURIComponent(clean);
  const dir = director ? encodeURIComponent(cleanTitle(director)) : "";

  const queries: { q: string; strict: boolean }[] = [];

  queries.push(
    { q: `${base}&year=${year}`, strict: true },
  );

  if (dir) {
    queries.push(
      { q: `${base}+${dir}&year=${year}`, strict: true },
      { q: `${base}+${dir}`, strict: false },
    );
  }

  queries.push({ q: `${base}`, strict: false });

  try {
    if (originalTitle) {
      await rateLimit();
      const origClean = encodeURIComponent(cleanTitle(originalTitle));
      const url = `${BASE}/search/movie?query=${origClean}&year=${year}&api_key=${key}`;
      const data = await tmdbFetch(url);
      if (data?.results?.length) {
        const match = findYearMatch(data.results, year, originalTitle);
        if (match) return `${IMAGE}${match.poster_path}`;
      }
    }

    for (const { q, strict } of queries) {
      const url = `${BASE}/search/movie?query=${q}&api_key=${key}`;
      const data = await tmdbFetch(url);
      if (!data?.results?.length) continue;

      if (strict) {
        const match = findYearMatch(data.results, year, title);
        if (match) return `${IMAGE}${match.poster_path}`;
      } else {
        const margin = 3;
        let best: TmdbResult | null = null;
        let bestDiff = Infinity;
        for (const r of data.results) {
          if (!r.poster_path) continue;
          const ry = r.release_date ? parseInt(r.release_date.slice(0, 4)) : 0;
          const diff = ry ? Math.abs(ry - year) : Infinity;
          if (diff <= margin && diff < bestDiff) {
            best = r;
            bestDiff = diff;
          }
        }
        if (best) return `${IMAGE}${best.poster_path}`;
        const first = data.results.find((r) => r.poster_path);
        if (first) return `${IMAGE}${first.poster_path}`;
      }
    }

    // fuzzy fallback: search by significant words and match by Levenshtein
    const words = significantWords(clean);
    if (words.length > 0) {
      const fuzzyQ = encodeURIComponent(words.join(" "));
      const url = `${BASE}/search/movie?query=${fuzzyQ}&api_key=${key}`;
      const data = await tmdbFetch(url);
      if (data?.results?.length) {
        const threshold = Math.max(2, Math.floor(clean.length * 0.25));
        for (const r of data.results) {
          if (!r.poster_path) continue;
          const candidate = cleanTitle(r.title || "");
          if (candidate && levenshtein(clean, candidate) <= threshold) {
            return `${IMAGE}${r.poster_path}`;
          }
          const orig = cleanTitle(r.original_title || "");
          if (orig && orig !== candidate && levenshtein(clean, orig) <= threshold) {
            return `${IMAGE}${r.poster_path}`;
          }
        }
      }
    }

    // person credits fallback: search by director name, match by year + title overlap
    if (director && year > 1900) {
      await rateLimit();
      const personUrl = `${BASE}/search/person?query=${encodeURIComponent(cleanTitle(director))}&api_key=${key}`;
      const personData = await tmdbFetch(personUrl) as { results?: TmdbPerson[] } | null;
      const personId = personData?.results?.[0]?.id;
      if (personId) {
        await rateLimit();
        const creditsUrl = `${BASE}/person/${personId}/movie_credits?api_key=${key}`;
        const creditsData = await tmdbFetch(creditsUrl) as { crew?: TmdbCredit[] } | null;
        const crewFilms = creditsData?.crew?.filter(c => c.job === "Director" && c.poster_path) ?? [];

        if (crewFilms.length > 0) {
          const cleanWords = clean.toLowerCase().split(/\s+/).filter(w => w.length > 0);
          const numTokens = cleanWords.filter(w => /^\d+$/.test(w));

          let best: { credit: TmdbCredit; score: number } | null = null;

          for (const c of crewFilms) {
            const cy = c.release_date ? parseInt(c.release_date.slice(0, 4)) : 0;
            if (!cy || Math.abs(cy - year) > 2) continue;

            let score = 0;
            score += Math.max(0, (3 - Math.abs(cy - year)) * 10);

            const cTitle = cleanTitle(c.title || "");
            const cOrig = cleanTitle(c.original_title || "");
            const cWords = (cTitle + " " + cOrig).toLowerCase().split(/\s+/);

            for (const n of numTokens) {
              if (cWords.includes(n)) score += 20;
            }

            const cClean = cTitle || cOrig;
            if (cClean) {
              const dist = levenshtein(clean, cClean);
              score += Math.max(0, (10 - dist) * 2);
            }

            if (!best || score > best.score) {
              best = { credit: c, score };
            }
          }

          if (best && best.score > 0) {
            return `${IMAGE}${best.credit.poster_path}`;
          }
        }
      }
    }

    return null;
  } catch (err) {
    console.warn(`[tmdb] falha ao buscar "${title}":`, err);
    return null;
  }
}

const tmdbCache = new Map<string, string>();

export function getTMDBCache(): Map<string, string> {
  return tmdbCache;
}

export function tmdbKey(title: string, year: number, director?: string, originalTitle?: string): string {
  const dir = director ? `|${cleanTitle(director).toLowerCase()}` : "";
  const orig = originalTitle ? `|${cleanTitle(originalTitle).toLowerCase()}` : "";
  return `${title.toLowerCase().trim()}|${year}${dir}${orig}`;
}
