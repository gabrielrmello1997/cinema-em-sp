import { XMLParser } from "fast-xml-parser";

export interface FeedData {
  title: string;
  date: string;
  html: string;
}

export async function fetchFeed(): Promise<FeedData> {
  const response = await fetch("https://cinemaemsp.substack.com/feed", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Erro ao baixar o feed (${response.status})`);
  }

  const xml = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    cdataPropName: "cdata",
    parseTagValue: false,
    trimValues: false,
  });

  const rss = parser.parse(xml);

  const item = rss?.rss?.channel?.item?.[5] ?? rss?.rss?.channel?.item;

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