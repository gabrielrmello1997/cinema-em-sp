import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { fetchAllItems } from "@/lib/substack/rss";
import { extractSessionsDom } from "@/lib/substack/programming-dom";
import { loadStored, saveStored, isNewerFeed } from "@/lib/substack/store";
import { searchMovie } from "@/lib/tmdb";
import type { Session } from "@/lib/substack/programming";

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
          allSessions.push(s);
        }
      }
    }

    const latest = items[0];
    const latestSessions = extractSessionsDom(latest.html);
    const stored = await loadStored();

    const posterCache = new Map<string, string>();
    for (const s of stored?.allSessions ?? []) {
      if (s.poster) posterCache.set(sessionKey(s), s.poster);
    }

    for (const s of allSessions) {
      const cached = posterCache.get(sessionKey(s));
      if (cached) s.poster = cached;
    }

    for (const s of latestSessions) {
      if (!s.poster && s.year > 1900) {
        const poster = await searchMovie(s.title, s.year);
        s.poster = poster ?? "";

        const match = allSessions.find((a) => sessionKey(a) === sessionKey(s));
        if (match) match.poster = s.poster;
      }
    }

    const changed = isNewerFeed(latest.date, stored);

    await saveStored({
      feedDate: latest.date,
      feedTitle: latest.title,
      refreshedAt: new Date().toISOString(),
      sessions: latestSessions,
      allSessions,
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
    });
  } catch (error) {
    console.error("[refresh] erro:", error);

    return NextResponse.json(
      { error: "Erro ao processar o feed." },
      { status: 500 },
    );
  }
}
