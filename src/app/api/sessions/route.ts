import { NextRequest, NextResponse } from "next/server";

import { loadStored } from "@/lib/substack/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const stored = await loadStored();

  if (!stored) {
    return NextResponse.json(
      { error: "Nenhum dado disponível. Execute /api/refresh primeiro." },
      { status: 404 },
    );
  }

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  if (!from && !to) {
    return NextResponse.json(stored);
  }

  const toMMDD = (d: string) => {
    const [dd_, mm_] = d.split("/");
    return `${mm_}/${dd_}`;
  };

  const allSessions = stored.allSessions ?? stored.sessions;

  const filtered = allSessions.filter((s) => {
    const dayMatch = s.day.match(/\((\d{2})\/(\d{2})\)/);
    if (!dayMatch) return true;

    const date = `${dayMatch[2]}/${dayMatch[1]}`;
    if (from && date < toMMDD(from)) return false;
    if (to && date > toMMDD(to)) return false;
    return true;
  });

  return NextResponse.json({ ...stored, sessions: filtered });
}
