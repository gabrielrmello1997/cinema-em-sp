import { put, list, get } from "@vercel/blob";
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

export async function loadStored(): Promise<StoredData | null> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return null;

    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b,
    );

    const result = await get(latest.url, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text) as StoredData;
    if (!data.allSessions) data.allSessions = data.sessions;
    return data;
  } catch {
    return null;
  }
}

export async function saveStored(data: StoredData): Promise<void> {
  const payload = JSON.stringify(data);
  await put(BLOB_KEY, payload, {
    access: "private",
    addRandomSuffix: false,
  });
}

export function isNewerFeed(currentGuid: string, stored: StoredData | null): boolean {
  if (!stored) return true;
  return currentGuid !== stored.feedGuid;
}
