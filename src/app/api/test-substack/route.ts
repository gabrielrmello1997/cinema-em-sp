import { NextResponse } from "next/server";

import { fetchAllItems } from "@/lib/substack/rss";
import { extractSessionsDom } from "@/lib/substack/programming-dom";

export async function GET() {
  try {
    const items = await fetchAllItems();
    const feed = items[0];

    const sessions = extractSessionsDom(feed.html);

    console.log(`[api] feed: "${feed.title}" (${feed.date}) — ${sessions.length} sessões`);

    return NextResponse.json({
      title: feed.title,
      date: feed.date,
      sessions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao processar o feed.",
      },
      {
        status: 500,
      }
    );
  }
}