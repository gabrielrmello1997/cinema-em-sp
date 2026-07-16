import { XMLParser } from "fast-xml-parser";

export interface FeedItem {
  guid: string;
  link: string;
  title: string;
  date: string;
  html: string;
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(url, { cache: "no-store", signal: controller.signal });
      if (response.ok) return response;
    } finally {
      clearTimeout(timeout);
    }
    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }

  throw new Error(`Erro ao baixar o feed após ${retries} tentativas`);
}

function parseItem(item: Record<string, unknown>): FeedItem {
  let html = "";

  if (typeof item["content:encoded"] === "string") {
    html = item["content:encoded"];
  } else if ((item["content:encoded"] as { cdata?: string })?.cdata) {
    html = (item["content:encoded"] as { cdata: string }).cdata;
  }

  const guid =
    typeof item.guid === "string"
      ? item.guid
      : (item.guid as { cdata?: string })?.cdata
        ?? (item.guid as { "#text"?: string })?.["#text"]
        ?? "";

  const link =
    typeof item.link === "string"
      ? item.link
      : (item.link as { cdata?: string })?.cdata
        ?? (item.link as { "#text"?: string })?.["#text"]
        ?? "";

  return {
    guid,
    link,
    title:
      typeof item.title === "string"
        ? item.title
        : (item.title as { cdata?: string })?.cdata ?? "",
    date: (item.pubDate as string) ?? "",
    html,
  };
}

export async function fetchAllItems(): Promise<FeedItem[]> {
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

  const rawItems = rss?.rss?.channel?.item;

  if (!rawItems) {
    throw new Error("Nenhum item encontrado no feed.");
  }

  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items.map(parseItem);
}
