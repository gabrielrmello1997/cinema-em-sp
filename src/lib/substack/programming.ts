export interface Session {
  cinema: string;
  day: string;
  time: string;
  title: string;
  year: number;
  country: string;
  duration: number;
  director: string;
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

export function extractSessions(text: string): Session[] {
  const sessions: Session[] = [];
  let currentDay = "";
  let currentCinema = "";

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

    if (!match) continue;

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

    sessions.push({ cinema: currentCinema, day: currentDay, time, title, year, country, duration, director });
  }

  return sessions;
}