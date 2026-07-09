import { promises as fs } from "node:fs";
import path from "node:path";
import type { CinemaInfo, Session } from "./programming";

export interface StoredData {
  feedDate: string;
  feedTitle: string;
  refreshedAt: string;
  sessions: Session[];
  allSessions: Session[];
  cinemas: CinemaInfo[];
}

const DATA_FILE = path.join(process.cwd(), "public", "data", "sessions.json");

export async function loadStored(): Promise<StoredData | null> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw) as StoredData;
    if (!data.allSessions) data.allSessions = data.sessions;
    return data;
  } catch {
    return null;
  }
}

export async function saveStored(data: StoredData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function isNewerFeed(currentDate: string, stored: StoredData | null): boolean {
  if (!stored) return true;
  return currentDate !== stored.feedDate;
}
