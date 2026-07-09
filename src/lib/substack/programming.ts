export interface Session {
  cinema: string;
  day: string;
  time: string;
  title: string;
  year: number;
  country: string;
  duration: number;
  director: string;
  mostra: string;
  poster: string;
}

export interface CinemaInfo {
  name: string;
  address: string;
  infoUrl: string;
}

export const CINEMAS_DATA: CinemaInfo[] = [
  { name: "BIBLIOTECA ROBERTO SANTOS", address: "", infoUrl: "" },
  { name: "BIBLIOTECINE", address: "", infoUrl: "" },
  { name: "CASA DE FRANCISCA", address: "R. Quintino Bocaiúva, 22 - Sé", infoUrl: "https://casadefrancisca.art.br/novo/programacao" },
  { name: "CCBB", address: "", infoUrl: "" },
  { name: "CCSP", address: "Rua Vergueiro, 1000 - Paraíso", infoUrl: "https://centrocultural.sp.gov.br/category/programacao/cinema/" },
  { name: "CFC CIDADE TIRADENTES", address: "", infoUrl: "" },
  { name: "CINE BELAS ARTES", address: "R. da Consolação, 2423 - Consolação", infoUrl: "https://www.cinebelasartes.com.br/programacao-especial/" },
  { name: "CINE BIJOU", address: "Praça Franklin Roosevelt, 172 - Consolação", infoUrl: "" },
  { name: "CINECLUBE BA", address: "Rua Dr. Álvaro Alvim, 90 - Vila Mariana", infoUrl: "https://www.instagram.com/cineclubeba/" },
  { name: "CINECLUBE CINCO", address: "R. Formosa, 51 - Centro Histórico de São Paulo", infoUrl: "https://www.instagram.com/cineclubecinco" },
  { name: "CINECLUBE DO JAPONÊS", address: "R. do Lago, 717 - Butantã", infoUrl: "" },
  { name: "CINECLUBE FGV", address: "R. Itapeva, 432 - Bela Vista", infoUrl: "https://www.instagram.com/cineclubefgv/" },
  { name: "CINECLUBE MARIETA", address: "", infoUrl: "" },
  { name: "CINE JOIA", address: "Praça Carlos Gomes, 82 - Liberdade", infoUrl: "" },
  { name: "CINE MATILHA", address: "Rua Rego Freitas, 542 - República", infoUrl: "https://www.instagram.com/cinematilha/" },
  { name: "CINE OLIDO", address: "Av. São João, 473 - Centro Histórico de São Paulo", infoUrl: "https://www.circuitospcine.com.br/cinemas/spcine-olido/" },
  { name: "CINE SEGALL", address: "Rua Berta, 111 - Vila Mariana", infoUrl: "https://www.gov.br/museus/pt-br/museus-ibram/museu-lasar-segall/acesso-a-informacao/acoes-e-programas/cine-segall/programacao" },
  { name: "CINESESC", address: "R. Augusta, 2075 - Cerqueira César", infoUrl: "https://www.sescsp.org.br/programacao/" },
  { name: "CINE-TEATRO DENOY DE OLIVEIRA", address: "R. Rui Barbosa, 323 - Bela Vista", infoUrl: "https://instagram.com/cineteatrodenoy" },
  { name: "CINEMATECA BRASILEIRA", address: "Largo Sen. Raul Cardoso, 207 - Vila Clementino", infoUrl: "https://cinemateca.org.br/programacao/" },
  { name: "CINUSP", address: "R. do Anfiteatro, 109 - Butantã", infoUrl: "http://www.usp.br/cinusp/" },
  { name: "CINUSP MARIA ANTÔNIA", address: "R. Maria Antônia, 294 - Vila Buarque", infoUrl: "http://www.usp.br/cinusp/" },
  { name: "ESPAÇO PETROBRAS DE CINEMA", address: "R. Augusta, 1475 - Consolação", infoUrl: "https://espacopetrobrasdecinema.com.br/" },
  { name: "INSTITUTO MOREIRA SALLES", address: "Avenida Paulista, 2424 - Bela Vista", infoUrl: "https://ims.com.br/programacao/cinema-2/#sao-paulo" },
  { name: "MIS", address: "", infoUrl: "" },
  { name: "NÁSTIENKA CINECLUBE RUSSO", address: "R. do Lago, 717 - Butantã", infoUrl: "https://www.instagram.com/nastienka.cineclube" },
  { name: "NASTIENKA CINECLUBE", address: "", infoUrl: "" },
  { name: "PATUÁ DISCOS", address: "Rua Fidalga, 516 - Vila Madalena", infoUrl: "https://www.instagram.com/patuadiscos/" },
  { name: "SESC 24 DE MAIO", address: "", infoUrl: "" },
  { name: "SESC AVENIDA PAULISTA", address: "", infoUrl: "" },
  { name: "SESC BELENZINHO", address: "", infoUrl: "" },
  { name: "SESC CAMPO LIMPO", address: "R. Nossa Sra. do Bom Conselho, 120 - Vila Prel", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC CONSOLAÇÃO", address: "R. Dr. Vila Nova, 245 - Vila Buarque", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC INTERLAGOS", address: "", infoUrl: "" },
  { name: "SESC IPIRANGA", address: "", infoUrl: "" },
  { name: "SESC PINHEIROS", address: "", infoUrl: "" },
  { name: "SESC POMPEIA", address: "", infoUrl: "" },
  { name: "SESC SANTANA", address: "", infoUrl: "" },
  { name: "SESC SANTO AMARO", address: "", infoUrl: "" },
  { name: "SESC VILA MARIANA", address: "", infoUrl: "" },
  { name: "SOBERANO", address: "Rua do Triunfo, 155 - Santa Ifigênia", infoUrl: "https://www.instagram.com/soberanoruadotriunfo/" },
];

export const CINEMAS = CINEMAS_DATA.map((c) => c.name);

export const DAYS = [
  "SEGUNDA-FEIRA",
  "TERÇA-FEIRA",
  "QUARTA-FEIRA",
  "QUINTA-FEIRA",
  "SEXTA-FEIRA",
  "SÁBADO",
  "DOMINGO",
];
