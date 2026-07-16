import type { Session } from "./substack/programming";

export const DAY_ORDER: Record<string, number> = {
  "SEGUNDA-FEIRA": 1,
  "TERÇA-FEIRA": 2,
  "QUARTA-FEIRA": 3,
  "QUINTA-FEIRA": 4,
  "SEXTA-FEIRA": 5,
  "SÁBADO": 6,
  "DOMINGO": 7,
};

export const MONTHS: Record<number, string> = {
  1: "JANEIRO", 2: "FEVEREIRO", 3: "MARÇO", 4: "ABRIL",
  5: "MAIO", 6: "JUNHO", 7: "JULHO", 8: "AGOSTO",
  9: "SETEMBRO", 10: "OUTUBRO", 11: "NOVEMBRO", 12: "DEZEMBRO",
};

export function parseDate(s: Session): Date | null {
  const m = s.day.match(/\((\d{2})\/(\d{2})\)/);
  if (!m) return null;
  const d = new Date(new Date().getFullYear(), Number(m[2]) - 1, Number(m[1]));
  if (d.getTime() > Date.now() + 90 * 24 * 60 * 60 * 1000) {
    d.setFullYear(d.getFullYear() - 1);
  }
  return d;
}

export function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
