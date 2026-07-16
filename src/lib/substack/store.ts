import { put, list, get } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CinemaInfo, Session } from "./programming";

export interface StoredData {
  feedGuid: string;
  feedUrl: string;
  feedDate: string;
  feedTitle: string;
  refreshedAt: string;
  sessions: Session[];
  allSessions: Session[];
  cinemas: CinemaInfo[];
}

const BLOB_KEY = "sessions.json";
const FALLBACK_PATH = path.join(process.cwd(), "public", "data", "sessions.json");

export async function loadStored(): Promise<StoredData | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const latest = blobs.reduce((a, b) =>
        new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b,
      );
      const result = await get(latest.url, { access: "public" });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const data = JSON.parse(text) as StoredData;
        if (!data.allSessions) data.allSessions = data.sessions;
        return data;
      }
    }
  } catch {
    // fallback
  }

  try {
    const raw = await fs.readFile(FALLBACK_PATH, "utf-8");
    const data = JSON.parse(raw) as StoredData;
    if (!data.allSessions) data.allSessions = data.sessions;
    return data;
  } catch {
    return null;
  }
}

export async function saveStored(data: StoredData): Promise<void> {
  const payload = JSON.stringify(data);
  await put(BLOB_KEY, payload, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function isNewerFeed(currentGuid: string, stored: StoredData | null): boolean {
  if (!stored) return true;
  return currentGuid !== stored.feedGuid;
}
