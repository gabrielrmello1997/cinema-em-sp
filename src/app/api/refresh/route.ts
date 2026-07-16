import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { fetchAllItems } from "@/lib/substack/rss";
import { extractSessionsDom } from "@/lib/substack/programming-dom";
import { loadStored, saveStored, isNewerFeed } from "@/lib/substack/store";
import { loadOverrides, applyOverrides } from "@/lib/substack/overrides";
import { searchMovie, tmdbKey } from "@/lib/tmdb";
import type { Session } from "@/lib/substack/programming";
import { CINEMAS_DATA } from "@/lib/substack/programming";

function sessionKey(s: Session): string {
  return `${s.cinema}|${s.day}|${s.time}`;
}

async function handleRefresh(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (process.env.NODE_ENV !== "development" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  const started = Date.now();
  const MAX_EXECUTION_MS = 8000;
  let stage = "start";

  try {
    console.log("[refresh] Started");

    stage = "rss";
    const items = await fetchAllItems();
    const latest = items[0];

    stage = "load";
    const stored = await loadStored();

    console.log(`[refresh] Latest post: ${latest.guid} — ${latest.title}`);

    const isNewPost = force || isNewerFeed(latest.guid, stored);

    if (!isNewPost) {
      console.log("[refresh] No new post — checking for missing posters");
    } else {
      console.log("[refresh] New post detected");
    }

    let latestSessions: Session[];
    let allSessions: Session[];
    const storedSessions = stored?.sessions ?? [];
    const storedAllSessions = stored?.allSessions ?? [];

    if (isNewPost) {
      // Parse sessions from the latest post
      stage = "parse-latest";
      latestSessions = extractSessionsDom(latest.html);
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
      stage = "merge";
      const seen = new Set<string>();
      allSessions = [];

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
    } else {
      // No new post — use stored data, just update posters
      latestSessions = storedSessions;
      allSessions = storedAllSessions;
    }

    // Apply manual overrides from overrides.json
    stage = "override";
    const overrides = await loadOverrides();
    applyOverrides(allSessions, overrides);
    applyOverrides(latestSessions, overrides);

    // Build poster cache from stored data
    stage = "cache";
    const posterCache = new Map<string, string>();
    for (const s of stored?.allSessions ?? []) {
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      if (s.poster && !posterCache.has(key)) {
        posterCache.set(key, s.poster);
      }
    }

    // Search TMDB for missing posters
    stage = "tmdb";
    const tmdbQueried = new Set<string>();
    let postersFound = 0;
    let postersMissing = 0;

    for (const s of allSessions) {
      if (Date.now() - started > MAX_EXECUTION_MS) {
        console.warn("[refresh] Tempo limite excedido, interrompendo busca TMDB");
        break;
      }
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

    stage = "save";
    await saveStored({
      feedGuid: isNewPost ? latest.guid : stored!.feedGuid,
      feedUrl: isNewPost ? latest.link : stored!.feedUrl,
      feedDate: isNewPost ? latest.date : stored!.feedDate,
      feedTitle: isNewPost ? latest.title : stored!.feedTitle,
      refreshedAt: new Date().toISOString(),
      sessions: latestSessions,
      allSessions,
      cinemas: CINEMAS_DATA,
    });

    stage = "revalidate";
    await revalidatePath("/");

    const elapsed = Date.now() - started;
    console.log(`[refresh] Persisted successfully (${elapsed}ms)`);
    console.log(`[refresh] Parsed ${allSessions.length} total sessions`);

    return NextResponse.json({
      ok: true,
      updated: isNewPost,
      postId: isNewPost ? latest.guid : stored!.feedGuid,
      postTitle: isNewPost ? latest.title : stored!.feedTitle,
      sessionsParsed: latestSessions.length,
      sessionsSaved: allSessions.length,
      postersFound,
      postersMissing,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    const elapsed = Date.now() - started;
    const message = error instanceof Error ? error.message : String(error);

    console.error(`[refresh] Failed at stage "${stage}":`, message);

    return NextResponse.json(
      { ok: false, stage, error: message },
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
