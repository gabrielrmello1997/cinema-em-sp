import { promises as fs } from "node:fs";
import path from "node:path";

import { fetchAllItems } from "../src/lib/substack/rss";
import type { FeedItem } from "../src/lib/substack/rss";
import { extractSessionsDom } from "../src/lib/substack/programming-dom";
import { loadStored, saveStored, isNewerFeed } from "../src/lib/substack/store";
import type { StoredData } from "../src/lib/substack/store";
import { loadOverrides, applyOverrides } from "../src/lib/substack/overrides";
import { searchMovie, tmdbKey } from "../src/lib/tmdb";
import type { Session } from "../src/lib/substack/programming";
import { CINEMAS_DATA } from "../src/lib/substack/programming";

function sessionKey(s: Session): string {
  return `${s.cinema}|${s.day}|${s.time}`;
}

const force = process.argv.includes("--force");

async function backupAndWrite(dataPath: string, data: StoredData): Promise<void> {
  const dir = path.dirname(dataPath);
  const ext = path.extname(dataPath);
  const base = path.basename(dataPath, ext);

  const backupsDir = process.env.SESSIONS_BACKUP_DIR
    ? path.resolve(process.env.SESSIONS_BACKUP_DIR)
    : path.join(dir, ".sessions-backups");

  await fs.mkdir(backupsDir, { recursive: true });

  // Backup do arquivo atual (se existir e for válido)
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    JSON.parse(raw);

    // backup simples
    await fs.copyFile(dataPath, path.join(backupsDir, `${base}.backup.json`));

    // backup com timestamp
    const ts = new Date().toISOString().replace(/[:.Z-]/g, "").replace("T", "T");
    await fs.copyFile(dataPath, path.join(backupsDir, `${base}.${ts}.json`));

    // Limpa backups antigos com timestamp (mantém últimos 5)
    const entries = await fs.readdir(backupsDir);
    const stamped = entries
      .filter((f) => {
        if (!f.startsWith(`${base}.`)) return false;
        if (f === `${base}.json` || f === `${base}.backup.json`) return false;
        return f.endsWith(".json");
      })
      .sort()
      .reverse();

    if (stamped.length > 5) {
      for (const old of stamped.slice(5)) {
        await fs.unlink(path.join(backupsDir, old));
      }
    }
  } catch {
    // Arquivo atual inexistente ou inválido — nada a backup
  }

  // Valida estrutura do novo dado
  const payload = JSON.stringify(data);
  const parsed = JSON.parse(payload);
  if (!parsed.sessions || !Array.isArray(parsed.sessions)) {
    throw new Error("Dado inválido: sessions ausente ou não é array");
  }
  if (!parsed.feedTitle) {
    throw new Error("Dado inválido: feedTitle ausente");
  }

  // Escrita atômica
  const tmp = dataPath + ".tmp." + process.pid;
  await fs.writeFile(tmp, payload, "utf-8");
  await fs.rename(tmp, dataPath);
}

const started = Date.now();
const MAX_EXECUTION_MS = 8000;
let stage = "start";

async function main() {
  try {
    console.log("[refresh] Started");

    stage = "rss";
    let items: FeedItem[];
    try {
      items = await fetchAllItems();
    } catch (err) {
      console.error("[refresh] Falha ao buscar RSS:", err);
      process.exit(1);
    }

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
      stage = "parse-latest";
      latestSessions = extractSessionsDom(latest.html);
      for (const s of latestSessions) {
        s.feedTitle = latest.title;
      }

      if (latestSessions.length === 0) {
        console.log("[refresh] Latest post has no session data, skipping");
        process.exit(1);
      }

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
      latestSessions = storedSessions;
      allSessions = storedAllSessions;
    }

    stage = "override";
    const overrides = await loadOverrides();
    applyOverrides(allSessions, overrides);
    applyOverrides(latestSessions, overrides);

    stage = "cache";
    const posterCache = new Map<string, string>();
    for (const s of stored?.allSessions ?? []) {
      const key = tmdbKey(s.title, s.year, s.director, s.originalTitle);
      if (s.poster && !posterCache.has(key)) {
        posterCache.set(key, s.poster);
      }
    }

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
    const saveData: StoredData = {
      feedGuid: isNewPost ? latest.guid : stored!.feedGuid,
      feedUrl: isNewPost ? latest.link : stored!.feedUrl,
      feedDate: isNewPost ? latest.date : stored!.feedDate,
      feedTitle: isNewPost ? latest.title : stored!.feedTitle,
      refreshedAt: new Date().toISOString(),
      sessions: latestSessions,
      allSessions,
      cinemas: CINEMAS_DATA,
    };

    const dataPath = process.env.SESSIONS_PATH
      ?? path.join(process.cwd(), "public", "data", "sessions.json");

    await backupAndWrite(dataPath, saveData);

    const elapsed = Date.now() - started;
    console.log(`[refresh] Persisted successfully (${elapsed}ms)`);
    console.log(`[refresh] Parsed ${allSessions.length} total sessions`);
    console.log(`[refresh] Posters: ${postersFound} found, ${postersMissing} missing`);

    console.log(JSON.stringify({
      ok: true,
      updated: isNewPost,
      postId: isNewPost ? latest.guid : stored!.feedGuid,
      postTitle: isNewPost ? latest.title : stored!.feedTitle,
      sessionsParsed: latestSessions.length,
      sessionsSaved: allSessions.length,
      postersFound,
      postersMissing,
      refreshedAt: saveData.refreshedAt,
    }));

    process.exit(0);
  } catch (error) {
    const elapsed = Date.now() - started;
    const message = error instanceof Error ? error.message : String(error);

    console.error(`[refresh] Failed at stage "${stage}":`, message);

    console.error(JSON.stringify({
      ok: false,
      stage,
      error: message,
      elapsed,
    }));

    process.exit(1);
  }
}

main();
