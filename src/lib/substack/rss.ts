import { XMLParser } from "fast-xml-parser";

export interface FeedData {
  title: string;
  date: string;
  html: string;
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, { cache: "no-store" });

    if (response.ok) return response;

    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }

  throw new Error(`Erro ao baixar o feed após ${retries} tentativas`);
}

export async function fetchFeed(): Promise<FeedData> {
  const response = await fetchWithRetry("https://cinemaemsp.substack.com/feed", 3);

  const xml = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    cdataPropName: "cdata",
    parseTagValue: false,
    trimValues: false,
  });

  const rss = parser.parse(xml);

  const item = rss?.rss?.channel?.item?.[0] ?? rss?.rss?.channel?.item;

  if (!item) {
    throw new Error("Nenhum item encontrado no feed.");
  }

  let html = "";

  if (typeof item["content:encoded"] === "string") {
    html = item["content:encoded"];
  } else if (item["content:encoded"]?.cdata) {
    html = item["content:encoded"].cdata;
  }

  return {
    title:
      typeof item.title === "string"
        ? item.title
        : item.title?.cdata ?? "",

    date: item.pubDate ?? "",

    html,
  };
}