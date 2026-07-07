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

export async function searchMovie(
  title: string,
  year: number,
): Promise<string | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  await rateLimit();

  const url = `${BASE}/search/movie?query=${encodeURIComponent(title)}&year=${year}&language=pt-BR&api_key=${key}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`[tmdb] erro ${res.status} para "${title}" (${year})`);
      return null;
    }

    const data = (await res.json()) as {
      results?: { poster_path?: string | null }[];
    };

    const path = data.results?.[0]?.poster_path;
    return path ? `${IMAGE}${path}` : null;
  } catch (err) {
    console.warn(`[tmdb] falha ao buscar "${title}":`, err);
    return null;
  }
}
