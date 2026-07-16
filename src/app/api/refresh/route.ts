import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { fetchAllItems } from "@/lib/substack/rss";
import { extractSessionsDom } from "@/lib/substack/programming-dom";
import { loadStored, saveStored, isNewerFeed } from "@/lib/substack/store";
import { searchMovie, tmdbKey } from "@/lib/tmdb";
import type { Session } from "@/lib/substack/programming";
import { CINEMAS_DATA } from "@/lib/substack/programming";

export async function GET() {
  return handleRefresh();
}

export async function POST() {
  return handleRefresh();
}

function sessionKey(s: Session): string {
  return `${s.cinema}|${s.day}|${s.time}|${s.title}`;
}

async function handleRefresh() {
  try {
    const items = await fetchAllItems();
    const seen = new Set<string>();
    const allSessions: Session[] = [];

    for (const item of items) {
      const sessions = extractSessionsDom(item.html);

      for (const s of sessions) {
        const key = sessionKey(s);
        if (!seen.has(key)) {
          seen.add(key);
          s.feedTitle = item.title;
          allSessions.push(s);
        }
      }
    }

    const latest = items[0];
    const latestSessions = extractSessionsDom(latest.html);
    for (const s of latestSessions) {
      s.feedTitle = latest.title;
    }
    const stored = await loadStored();

    const posterCache = new Map<string, string>();
    for (const s of stored?.allSessions ?? []) {
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      if (s.poster && !posterCache.has(key)) {
        posterCache.set(key, s.poster);
      }
    }

    const changed = isNewerFeed(latest.date, stored);

    const tmdbQueried = new Set<string>();

    for (const s of allSessions) {
      if (s.year <= 1900) continue;
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      const cached = posterCache.get(key);
      if (cached) {
        s.poster = cached;
        continue;
      }

      if (tmdbQueried.has(key)) continue;

      if (!s.poster) {
        tmdbQueried.add(key);
        const poster = await searchMovie(s.title, s.year, s.director, s.originalTitle);
        s.poster = poster ?? "";
        posterCache.set(key, s.poster);
      }
    }

    for (const s of latestSessions) {
      if (s.poster) continue;
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      const cached = posterCache.get(key);
      if (cached) s.poster = cached;
    }

    await saveStored({
      feedDate: latest.date,
      feedTitle: latest.title,
      refreshedAt: new Date().toISOString(),
      sessions: latestSessions,
      allSessions,
      cinemas: CINEMAS_DATA,
    });

    if (changed) {
      revalidatePath("/");
    }

    console.log(
      `[refresh] ${items.length} posts, ${latestSessions.length} na semana, ${allSessions.length} no total${changed ? ` (${latest.date})` : " (mesmo feed)"}`,
    );

    return NextResponse.json({
      changed,
      feedTitle: latest.title,
      feedDate: latest.date,
      totalItems: items.length,
      sessions: latestSessions,
      allSessions,
      cinemas: CINEMAS_DATA,
    });
  } catch (error) {
    console.error("[refresh] erro:", error);

    return NextResponse.json(
      { error: "Erro ao processar o feed." },
      { status: 500 },
    );
  }
}
