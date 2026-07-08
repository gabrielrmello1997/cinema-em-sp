import { parse as parseHtml, HTMLElement } from "node-html-parser";
import type { Session } from "./programming";
import { CINEMAS, DAYS } from "./programming";

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘");
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

function rawText(el: HTMLElement): string {
  return decodeHtmlEntities(el.textContent.trim());
}

function parseMetadata(text: string): { country?: string; duration?: number; director?: string } {
  const result: { country?: string; duration?: number; director?: string } = {};

  if (/^Dire[çc]ão\s*:/.test(text)) {
    result.director = text.replace(/^Dire[çc]ão\s*:\s*/, "").trim();
    return result;
  }

  if (/^Dir[eçc]?\.?\s*:/.test(text)) {
    result.director = text.replace(/^Dir[eçc]?\.?\s*:\s*/, "").trim();
    return result;
  }

  const m = text.match(/^(.+),\s*(\d+)['’]\s*$/);
  if (m) {
    result.country = m[1].trim();
    result.duration = Number(m[2]);
    return result;
  }

  return result;
}

function extractFromP(p: HTMLElement): string[] {
  const parts = p.innerHTML.split(/<br\s*\/?>/i);
  return parts.map((part) => decodeHtmlEntities(stripTags(part))).filter(Boolean);
}

function extractFilm(firstText: string):
  | { ok: true; title: string; year: number; director: string; duration: number }
  | { ok: false } {

  const filmMatch = firstText.match(/^(.*?)\s*\((\d{4})\)(?:[,，]\s*(.*?)(?:\s*[,，]?\s*(\d+)’(?:\d+["”])?)?)?\s*$/);
  if (filmMatch) {
    return {
      ok: true,
      title: filmMatch[1].trim(),
      year: Number(filmMatch[2]),
      director: (filmMatch[3] || "").replace(/[,\s]+$/, ""),
      duration: Number(filmMatch[4]) || 0,
    };
  }

  const simpleMatch = firstText.match(/^([^,]+),\s*(.+)$/);
  if (simpleMatch) {
    const director = simpleMatch[2].trim();
    const skip =
      /^\d+['’]/.test(director)
      || /^\d{4},/.test(director)
      || /^Dir[eçc]\.?\s*:/.test(director)
      || /^Dire[çc]ão\s*:/.test(simpleMatch[1])
      || /^\*/.test(simpleMatch[1])
      || /^Brasil$|^França$|^Portugal$|^Japão$|^Bélgica$|^Nigéria$|^Senegal$|^Tchecoslováquia$|^EUA$/.test(simpleMatch[1])
      || /^\d+['’]/.test(simpleMatch[1]);

    if (!skip) {
      return {
        ok: true,
        title: simpleMatch[1].trim(),
        year: 0,
        director,
        duration: 0,
      };
    }
  }

  return { ok: false };
}

function validateSession(s: Session, index: number) {
  const issues: string[] = [];

  if (!s.cinema) issues.push("cinema vazio");
  if (!s.day) issues.push("day vazio");
  if (!s.time) issues.push("time vazio");
  if (!s.title) issues.push("title vazio");

  if (s.year !== 0) {
    if (!s.year || s.year < 1900) issues.push(`year inválido (${s.year})`);
    if (!s.country) issues.push("country vazio");
    if (!s.duration) issues.push("duration zero");
  }

  if (!s.director) issues.push("director vazio");

  if (issues.length) {
    console.warn(`[parser-dom] sessão #${index} com problemas: ${issues.join(", ")}`);
    console.warn(`  → "${s.title}" (${s.year}) @ ${s.cinema}, ${s.day} ${s.time}`);
  }
}

function isDayLine(text: string): string | null {
  for (const d of DAYS) {
    if (text.startsWith(d)) return text;
  }
  return null;
}

function walkTree(
  el: HTMLElement,
  ctx: { day: string; cinema: string; mostra: string },
  sessions: Session[],
): void {
  for (const child of el.childNodes) {
    if (!(child instanceof HTMLElement)) continue;

    const tag = (child.tagName as string)?.toUpperCase();
    if (!tag) continue;

    const text = rawText(child);

    if (tag === "H5") {
      ctx.mostra = text;
    } else if (tag === "H2" || tag === "H3") {
      const upper = text.toUpperCase();
      if (CINEMAS.includes(upper)) {
        ctx.cinema = upper;
        ctx.mostra = "";
      }
      const day = isDayLine(text);
      if (day) {
        ctx.day = day;
        ctx.mostra = "";
      }
    } else if (tag === "P" || tag === "DIV") {
      const day = isDayLine(text);
      if (day) {
        ctx.day = day;
        ctx.mostra = "";
      } else if (!ctx.cinema) {
        const upper = text.toUpperCase();
        if (CINEMAS.includes(upper)) {
          ctx.cinema = upper;
          ctx.mostra = "";
        }
      } else if (text.startsWith("◆ ")) {
        ctx.mostra = text.replace("◆ ", "");
      }
    } else if (tag === "H4") {
      processH4(child, ctx, sessions);
    }

    walkTree(child, ctx, sessions);
  }
}

function processH4(h4: HTMLElement, ctx: { day: string; cinema: string; mostra: string }, sessions: Session[]) {
  if (!ctx.cinema || !ctx.day) return;

  const text = rawText(h4);
  const timeMatch = text.match(/\|\s*([0-9]{1,2}h[0-9]{0,2})\s*$/);
  if (!timeMatch) return;
  const time = timeMatch[1];

  const beforePipe = text.split("|")[0];
  const hasYear = /\(\d{4}\)/.test(beforePipe);

  let ul: HTMLElement | null = h4.nextElementSibling;
  while (ul && (ul.tagName as string)?.toUpperCase() !== "UL") {
    ul = ul.nextElementSibling;
  }
  if (!ul) return;

  const lis = ul.querySelectorAll("li");

  if (hasYear) {
    const titleMatch = text.match(/^(.*?)\s*\((\d{4})\)/);
    if (!titleMatch) return;
    const title = titleMatch[1].trim();
    const year = Number(titleMatch[2]);

    let country = "";
    let duration = 0;
    let director = "";

    for (const li of lis) {
      for (const p of li.querySelectorAll("p")) {
        for (const part of extractFromP(p)) {
          const meta = parseMetadata(part);
          if (meta.director && !director) director = meta.director;
          if (meta.country && !country) { country = meta.country; duration = meta.duration ?? duration; }
        }
      }
    }

    const session: Session = { cinema: ctx.cinema, day: ctx.day, time, title, year, country, duration, director, mostra: ctx.mostra, poster: "" };
    validateSession(session, sessions.length);
    sessions.push(session);
  } else {
    for (const li of lis) {
      const ps = li.querySelectorAll("p");
      if (ps.length === 0) continue;

      const first = extractFilm(rawText(ps[0]));
      if (!first.ok) continue;

      let { title, year, director, duration } = first;
      let country = "";

      for (let i = 1; i < ps.length; i++) {
        for (const part of extractFromP(ps[i])) {
          const meta = parseMetadata(part);
          if (meta.director && !director) director = meta.director;
          if (meta.country && !country) { country = meta.country; duration = meta.duration ?? duration; }
        }
      }

      const session: Session = { cinema: ctx.cinema, day: ctx.day, time, title, year, country, duration, director, mostra: ctx.mostra, poster: "" };
      validateSession(session, sessions.length);
      sessions.push(session);
    }
  }
}

export function extractSessionsDom(html: string): Session[] {
  const root = parseHtml(html);
  const sessions: Session[] = [];

  const ctx = { day: "", cinema: "", mostra: "" };
  walkTree(root, ctx, sessions);

  console.log(`[parser-dom] ${sessions.length} sessões extraídas`);
  return sessions;
}
