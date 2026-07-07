import { NextResponse } from "next/server";

import { fetchFeed } from "@/lib/substack/rss";
import { htmlToText } from "@/lib/substack/parser";
import { extractSessions } from "@/lib/substack/programming";

export async function GET() {
  try {
    const feed = await fetchFeed();

    const text = htmlToText(feed.html);

    const sessions = extractSessions(text);

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