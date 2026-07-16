import { promises as fs } from "node:fs";
import path from "node:path";
import type { Session } from "./programming";

const OVERRIDES_PATH = path.join(process.cwd(), "public", "data", "overrides.json");

type OverrideMap = Record<string, Partial<Session>>;

let cachedOverrides: OverrideMap | null = null;

export function clearOverrideCache(): void {
  cachedOverrides = null;
}

export async function loadOverrides(): Promise<OverrideMap> {
  if (cachedOverrides) return cachedOverrides;
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf-8");
    cachedOverrides = JSON.parse(raw) as OverrideMap;
    return cachedOverrides;
  } catch {
    return {};
  }
}

export function overrideKey(s: Session): string {
  return `${s.cinema}|${s.day}|${s.time}`;
}

export function applyOverrides(sessions: Session[], overrides: OverrideMap): void {
  for (const session of sessions) {
    const key = overrideKey(session);
    const override = overrides[key];
    if (override) {
      Object.assign(session, override);
    }
  }
}
