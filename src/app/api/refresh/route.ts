import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { fetchAllItems } from "@/lib/substack/rss";
import { extractSessionsDom } from "@/lib/substack/programming-dom";
import { loadStored, saveStored, isNewerFeed } from "@/lib/substack/store";
import { searchMovie, tmdbKey } from "@/lib/tmdb";
import type { Session } from "@/lib/substack/programming";
import { CINEMAS_DATA } from "@/lib/substack/programming";

function sessionKey(s: Session): string {
  return `${s.cinema}|${s.day}|${s.time}|${s.title}`;
}

async function handleRefresh(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const started = Date.now();
  console.log("[refresh] Started");

  try {
    const items = await fetchAllItems();
    const latest = items[0];
    const stored = await loadStored();

    console.log(`[refresh] Latest post: ${latest.guid} — ${latest.title}`);

    if (!isNewerFeed(latest.guid, stored)) {
      const elapsed = Date.now() - started;
      console.log(`[refresh] No new post (${elapsed}ms)`);
      return NextResponse.json({
        ok: true,
        updated: false,
        reason: "Latest post already processed",
        latestPostId: latest.guid,
        latestPostTitle: latest.title,
        checkedAt: new Date().toISOString(),
      });
    }

    console.log("[refresh] New post detected");

    // Parse sessions from the latest post
    const latestSessions = extractSessionsDom(latest.html);
    for (const s of latestSessions) {
      s.feedTitle = latest.title;
    }

    if (latestSessions.length === 0) {
      console.log("[refresh] Latest post has no session data, skipping");
      return NextResponse.json({
        ok: false,
        stage: "post-parser",
        error: "The latest post could not be parsed",
      }, { status: 422 });
    }

    // Build full history (all posts)
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

    // Deduplicate against stored history (by session key)
    if (stored?.allSessions) {
      for (const s of stored.allSessions) {
        const key = sessionKey(s);
        if (!seen.has(key)) {
          seen.add(key);
          allSessions.push(s);
        }
      }
    }

    // Build poster cache from stored data
    const posterCache = new Map<string, string>();
    for (const s of stored?.allSessions ?? []) {
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      if (s.poster && !posterCache.has(key)) {
        posterCache.set(key, s.poster);
      }
    }

    // Search TMDB for missing posters
    const tmdbQueried = new Set<string>();
    let postersFound = 0;
    let postersMissing = 0;

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
        try {
          const poster = await searchMovie(s.title, s.year, s.director, s.originalTitle);
          s.poster = poster ?? "";
          posterCache.set(key, s.poster);
          if (poster) {
            postersFound++;
          } else {
            postersMissing++;
          }
        } catch (err) {
          console.warn(`[refresh] TMDB falhou para "${s.title}":`, err);
          s.poster = "";
          postersMissing++;
        }
      }
    }

    for (const s of latestSessions) {
      if (s.poster) continue;
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      const cached = posterCache.get(key);
      if (cached) s.poster = cached;
    }

    await saveStored({
      feedGuid: latest.guid,
      feedUrl: latest.link,
      feedDate: latest.date,
      feedTitle: latest.title,
      refreshedAt: new Date().toISOString(),
      sessions: latestSessions,
      allSessions,
      cinemas: CINEMAS_DATA,
    });

    revalidatePath("/");

    const elapsed = Date.now() - started;
    console.log(`[refresh] Persisted successfully (${elapsed}ms)`);
    console.log(`[refresh] Parsed ${allSessions.length} total sessions`);

    return NextResponse.json({
      ok: true,
      updated: true,
      postId: latest.guid,
      postTitle: latest.title,
      sessionsParsed: latestSessions.length,
      sessionsSaved: allSessions.length,
      postersFound,
      postersMissing,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    const elapsed = Date.now() - started;
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("feed") || message.includes("RSS") || message.includes("Nenhum item")) {
      console.error(`[refresh] RSS error (${elapsed}ms):`, error);
      return NextResponse.json(
        { ok: false, stage: "rss", error: "Failed to fetch or parse RSS feed" },
        { status: 502 },
      );
    }

    console.error(`[refresh] Error (${elapsed}ms):`, error);
    return NextResponse.json(
      { ok: false, stage: "persistence", error: "Failed to persist refreshed data", detail: message },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handleRefresh(request);
}

export async function POST(request: Request) {
  return handleRefresh(request);
}
