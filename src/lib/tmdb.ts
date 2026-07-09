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

function cleanTitle(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/:|;|,/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function tmdbFetch(url: string): Promise<{ results?: { poster_path?: string | null }[] } | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function searchMovie(
  title: string,
  year: number,
): Promise<string | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  await rateLimit();

  const clean = cleanTitle(title);
  if (!clean) return null;

  try {
    const urlWithYear = `${BASE}/search/movie?query=${encodeURIComponent(clean)}&year=${year}&api_key=${key}`;
    let data = await tmdbFetch(urlWithYear);
    let path = data?.results?.[0]?.poster_path;

    if (!path) {
      const urlAnyYear = `${BASE}/search/movie?query=${encodeURIComponent(clean)}&api_key=${key}`;
      data = await tmdbFetch(urlAnyYear);
      path = data?.results?.[0]?.poster_path;
    }

    return path ? `${IMAGE}${path}` : null;
  } catch (err) {
    console.warn(`[tmdb] falha ao buscar "${title}":`, err);
    return null;
  }
}

const tmdbCache = new Map<string, string>();

export function getTMDBCache(): Map<string, string> {
  return tmdbCache;
}

export function tmdbKey(title: string, year: number): string {
  return `${title.toLowerCase().trim()}|${year}`;
}
