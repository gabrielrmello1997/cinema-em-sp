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

const TMP_PATH = "/tmp/sessions.json";
const FALLBACK_PATH = path.join(process.cwd(), "public", "data", "sessions.json");

async function readFile(filePath: string): Promise<StoredData | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as StoredData;
    if (!data.allSessions) data.allSessions = data.sessions;
    return data;
  } catch {
    return null;
  }
}

export async function loadStored(): Promise<StoredData | null> {
  const tmp = await readFile(TMP_PATH);
  if (tmp) return tmp;
  return readFile(FALLBACK_PATH);
}

export async function saveStored(data: StoredData): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(TMP_PATH, payload, "utf-8");
}

export function isNewerFeed(currentGuid: string, stored: StoredData | null): boolean {
  if (!stored) return true;
  return currentGuid !== stored.feedGuid;
}
