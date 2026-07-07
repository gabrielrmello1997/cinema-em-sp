export interface Session {
  cinema: string;
  day: string;
  time: string;
  title: string;
  year: number;
  country: string;
  duration: number;
  director: string;
  poster: string;
}

const CINEMAS = [
  "BIBLIOTECA ROBERTO SANTOS",
  "BIBLIOTECINE",
  "CASA DE FRANCISCA",
  "CCBB",
  "CCSP",
  "CFC CIDADE TIRADENTES",
  "CINE BELAS ARTES",
  "CINE BIJOU",
  "CINECLUBE BA",
  "CINECLUBE CINCO",
  "CINECLUBE DO JAPONÊS",
  "CINECLUBE FGV",
  "CINECLUBE MARIETA",
  "CINE JOIA",
  "CINE MATILHA",
  "CINE OLIDO",
  "CINE SEGALL",
  "CINESESC",
  "CINE-TEATRO DENOY DE OLIVEIRA",
  "CINEMATECA BRASILEIRA",
  "CINUSP",
  "CINUSP MARIA ANTÔNIA",
  "ESPAÇO PETROBRAS DE CINEMA",
  "INSTITUTO MOREIRA SALLES",
  "MIS",
  "NÁSTIENKA CINECLUBE RUSSO",
  "NASTIENKA CINECLUBE",
  "PATUÁ DISCOS",
  "SESC 24 DE MAIO",
  "SESC AVENIDA PAULISTA",
  "SESC BELENZINHO",
  "SESC CAMPO LIMPO",
  "SESC CONSOLAÇÃO",
  "SESC INTERLAGOS",
  "SESC IPIRANGA",
  "SESC PINHEIROS",
  "SESC POMPEIA",
  "SESC SANTANA",
  "SESC SANTO AMARO",
  "SESC VILA MARIANA",
  "SOBERANO",
];

const DAYS = [
  "SEGUNDA-FEIRA",
  "TERÇA-FEIRA",
  "QUARTA-FEIRA",
  "QUINTA-FEIRA",
  "SEXTA-FEIRA",
  "SÁBADO",
  "DOMINGO",
];

function validateSession(s: Session, lineIndex: number) {
  const issues: string[] = [];

  if (!s.cinema) issues.push("cinema vazio");
  if (!s.day) issues.push("day vazio");
  if (!s.time) issues.push("time vazio");
  if (!s.title) issues.push("title vazio");
  if (!s.year || s.year < 1900) issues.push(`year inválido (${s.year})`);
  if (!s.country) issues.push("country vazio");
  if (!s.duration) issues.push("duration zero");
  if (!s.director) issues.push("director vazio");

  if (issues.length) {
    console.warn(`[parser] sessão na linha ${lineIndex} com problemas: ${issues.join(", ")}`);
    console.warn(`  → "${s.title}" (${s.year}) @ ${s.cinema}, ${s.day} ${s.time}`);
  }
}

export function extractSessions(text: string): Session[] {
  const sessions: Session[] = [];
  let currentDay = "";
  let currentCinema = "";
  let totalSkipped = 0;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .map((l) => l.replace(/^•\s*/, ""))
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (DAYS.some((d) => line.startsWith(d))) {
      currentDay = line;
      continue;
    }

    if (CINEMAS.includes(line)) {
      currentCinema = line;
      continue;
    }

    const match = line.match(/^(.*?)\s*\((\d{4})\).*?\|\s*([0-9]{1,2}h[0-9]{0,2})/);

    if (!match) {
      totalSkipped++;
      continue;
    }

    const title = match[1].trim();
    const year = Number(match[2]);
    const time = match[3];

    let country = "";
    let duration = 0;
    let director = "";

    for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
      const next = lines[j];

      if (!country) {
        const m = next.match(/^(.+?)[,\s]+(\d+)’/);
        if (m) {
          country = m[1].trim();
          duration = Number(m[2]);
          continue;
        }
      }

      if (next.startsWith("Direção:")) {
        director = next.replace("Direção:", "").trim();
        break;
      }
    }

    const session: Session = { cinema: currentCinema, day: currentDay, time, title, year, country, duration, director, poster: "" };
    validateSession(session, i);
    sessions.push(session);
  }

  console.log(`[parser] ${sessions.length} sessões extraídas, ${totalSkipped} linhas ignoradas`);

  return sessions;
}