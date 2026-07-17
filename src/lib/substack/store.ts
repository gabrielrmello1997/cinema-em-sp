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

function resolvePath(): string {
  return (
    process.env.SESSIONS_PATH ??
    path.join(process.cwd(), "public", "data", "sessions.json")
  );
}

export async function loadStored(): Promise<StoredData | null> {
  try {
    const raw = await fs.readFile(resolvePath(), "utf-8");
    const data = JSON.parse(raw) as StoredData;
    if (!data.allSessions) data.allSessions = data.sessions;
    return data;
  } catch {
    return null;
  }
}

export async function saveStored(data: StoredData): Promise<void> {
  const dataPath = resolvePath();
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data), "utf-8");
}

export function isNewerFeed(currentGuid: string, stored: StoredData | null): boolean {
  if (!stored) return true;
  return currentGuid !== stored.feedGuid;
}
