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

  const dirMatch = text.match(/^(.+),\s*Dir[ecç]?\.?\s*:\s*(.+)$/);
  if (dirMatch) {
    result.country = dirMatch[1].trim();
    result.director = dirMatch[2].trim();
    return result;
  }

  const m = text.match(/^(.+),\s*[^\d]*(\d+)\s*['’]?\s*$/);
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
  | { ok: true; title: string; year: number; director: string; duration: number; country: string }
  | { ok: false } {

  const parenBlock = firstText.match(/^(.*?)\s*\((\d{4}),\s*(\d+)\s*['’],\s*Dir[ecç]?\.?\s*:\s*(.+)\);?\s*$/);
  if (parenBlock) {
    return {
      ok: true,
      title: parenBlock[1].trim(),
      year: Number(parenBlock[2]),
      duration: Number(parenBlock[3]),
      director: parenBlock[4].trim(),
      country: "",
    };
  }

  const yearDurParen = firstText.match(/^(.*?)\s*\((\d{4}),\s*(\d+)\s*['’]\)\s*$/);
  if (yearDurParen) {
    return {
      ok: true,
      title: yearDurParen[1].trim(),
      year: Number(yearDurParen[2]),
      director: "",
      duration: Number(yearDurParen[3]),
      country: "",
    };
  }

  const yearParenExtra = firstText.match(/^(.*?)\s*\((\d{4})\).*$/);
  if (yearParenExtra) {
    return {
      ok: true,
      title: yearParenExtra[1].trim(),
      year: Number(yearParenExtra[2]),
      director: "",
      duration: 0,
      country: "",
    };
  }

  const dirYearParen = firstText.match(/^(.*?)\s*\((.+),\s*(\d{4}),\s*(.+),\s*(\d+)\s*['’]\)\s*$/);
  if (dirYearParen) {
    return {
      ok: true,
      title: dirYearParen[1].trim(),
      year: Number(dirYearParen[3]),
      director: dirYearParen[2].trim(),
      duration: Number(dirYearParen[5]),
      country: dirYearParen[4].trim(),
    };
  }

  const dirYearNoCountry = firstText.match(/^(.*?)\s*\((.+),\s*(\d{4}),\s*(\d+)\s*['’]\)\s*$/);
  if (dirYearNoCountry) {
    return {
      ok: true,
      title: dirYearNoCountry[1].trim(),
      year: Number(dirYearNoCountry[3]),
      director: dirYearNoCountry[2].trim(),
      duration: Number(dirYearNoCountry[4]),
      country: "",
    };
  }

  const filmMatch = firstText.match(/^(.*?)\s*\((\d{4})\)(?:[,，]\s*(.*?)(?:\s*[,，]?\s*(\d+)\s*['’](?:\d+["”])?)?)?\s*$/);
  if (filmMatch) {
    return {
      ok: true,
      title: filmMatch[1].trim(),
      year: Number(filmMatch[2]),
      director: (filmMatch[3] || "").replace(/[,\s]+$/, ""),
      duration: Number(filmMatch[4]) || 0,
      country: "",
    };
  }

  const yearDur = firstText.match(/^(.+),\s*(\d{4}),\s*(\d+)\s*['’]\s*$/);
  if (yearDur) {
    return {
      ok: true,
      title: yearDur[1].trim(),
      year: Number(yearDur[2]),
      director: "",
      duration: Number(yearDur[3]),
      country: "",
    };
  }

  const durOnly = firstText.match(/^(.+),\s*(\d+)\s*['’]\s*$/);
  if (durOnly && !/,\s*\d{4}\s*,/.test(firstText)) {
    return {
      ok: true,
      title: durOnly[1].trim(),
      year: 0,
      director: "",
      duration: Number(durOnly[2]),
      country: "",
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
        country: "",
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

function extractShowcase(text: string): Array<{ title: string; director: string }> | null {
  const prefix = "Exibição dos filmes:";
  const idx = text.indexOf(prefix);
  if (idx === -1) return null;

  const list = text.slice(idx + prefix.length).replace(/^\s+/, "").replace(/\.\s*$/, "");
  const items: string[] = [];

  for (const part of list.split("; ")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const segments = trimmed.split(/\be\b(?=.*,\s*de\s)/);
    for (const seg of segments) {
      const s = seg.trim();
      if (s) items.push(s);
    }
  }

  const result: Array<{ title: string; director: string }> = [];
  for (const item of items) {
    const withComma = item.match(/^(.+),\s*de\s+(.+)$/);
    if (withComma) {
      result.push({ title: withComma[1].trim(), director: withComma[2].trim() });
      continue;
    }
    const plain = item.match(/^(.+)\s+de\s+(.+)$/);
    if (plain) {
      result.push({ title: plain[1].trim(), director: plain[2].trim() });
    }
  }

  return result.length > 0 ? result : null;
}

function processH4(h4: HTMLElement, ctx: { day: string; cinema: string; mostra: string }, sessions: Session[]) {
  if (!ctx.cinema || !ctx.day) return;

  const text = rawText(h4);
  const timeMatch = text.match(/\|\s*([0-9]{1,2}h[0-9]{0,2})/);
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
    const firstLi = lis[0];
    if (firstLi) {
      const showcasePs = firstLi.querySelectorAll("p");
      if (showcasePs.length > 0) {
        const showcaseFilms = extractShowcase(rawText(showcasePs[0]));
        if (showcaseFilms) {
          let totalDuration = 0;
          if (showcasePs.length > 1) {
            const durMatch = rawText(showcasePs[1]).match(/Duração total:\s*(\d+)\s*['’]/);
            if (durMatch) totalDuration = Number(durMatch[1]);
          }
          for (const film of showcaseFilms) {
            const session: Session = { cinema: ctx.cinema, day: ctx.day, time, title: film.title, year: 0, country: "", duration: totalDuration, director: film.director, mostra: ctx.mostra, poster: "" };
            validateSession(session, sessions.length);
            sessions.push(session);
          }
          return;
        }
      }
    }

    for (const li of lis) {
      const ps = li.querySelectorAll("p");
      if (ps.length === 0) continue;

      const parts: string[] = [];
      for (const p of ps) {
        parts.push(...extractFromP(p));
      }

      const first = extractFilm(parts[0]);
      if (!first.ok) continue;

      let { title, year, director, duration, country = "" } = first;

      for (let i = 1; i < parts.length; i++) {
        const meta = parseMetadata(parts[i]);
        if (meta.director && !director) director = meta.director;
        if (meta.country && !country) { country = meta.country; duration = meta.duration ?? duration; }
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
