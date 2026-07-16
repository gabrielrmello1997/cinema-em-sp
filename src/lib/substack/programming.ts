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
  feedTitle?: string;
  originalTitle?: string;
}

export interface CinemaInfo {
  name: string;
  address: string;
  infoUrl: string;
}

export const CINEMAS_DATA: CinemaInfo[] = [
  { name: "BIBLIOTECA ROBERTO SANTOS", address: "Rua Cisplatina, 505 - Ipiranga", infoUrl: "https://www.instagram.com/bibliotecarobertosantos/" },
  { name: "BIBLIOTECINE", address: "Av. Professor Lineu Prestes, Tv. Doze, nº 350", infoUrl: "https://www.instagram.com/bibliotecine/" },
  { name: "CASA DE FRANCISCA", address: "R. Quintino Bocaiúva, 22 - Sé", infoUrl: "https://casadefrancisca.art.br/novo/programacao" },
  { name: "CCBB", address: "R. Álvares Penteado, 112 - Centro", infoUrl: "https://ccbb.com.br/sao-paulo/programacao/" },
  { name: "CCSP", address: "Rua Vergueiro, 1000 - Paraíso", infoUrl: "https://centrocultural.sp.gov.br/category/programacao/cinema/" },
  { name: "CFC CIDADE TIRADENTES", address: "R. Inácio Monteiro, 6900 - Jardim São Paulo", infoUrl: "https://www.circuitospcine.com.br/cinemas/centro-de-formacao-cultural-cidade-tiradentes/" },
  { name: "CINE BELAS ARTES", address: "R. da Consolação, 2423 - Consolação", infoUrl: "https://www.cinebelasartes.com.br/programacao-especial/" },
  { name: "CINE BIJOU", address: "Praça Franklin Roosevelt, 172 - Consolação", infoUrl: "https://www.instagram.com/satyrosbijou/" },
  { name: "CINECLUBE BA", address: "Rua Dr. Álvaro Alvim, 90 - Vila Mariana", infoUrl: "https://www.instagram.com/cineclubeba/" },
  { name: "CINECLUBE CINCO", address: "R. Formosa, 51 - Centro Histórico de São Paulo", infoUrl: "https://www.instagram.com/cineclubecinco" },
  { name: "CINECLUBE DO JAPONÊS", address: "R. do Lago, 717 - Butantã", infoUrl: "https://www.instagram.com/comissaodealunosjaponesusp/" },
  { name: "CINECLUBE FGV", address: "R. Itapeva, 432 - Bela Vista", infoUrl: "https://www.instagram.com/cineclubefgv/" },
  { name: "CINECLUBE MARIETA", address: "R. Rocha, 274 - Bixiga", infoUrl: "https://www.projetomarieta.com.br/cineclube" },
  { name: "CINE JOIA", address: "Praça Carlos Gomes, 82 - Liberdade", infoUrl: "https://www.cinejoia.com.br/agenda/" },
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
  { name: "MIS", address: "Av. Europa, 158 - Jardim Europa", infoUrl: "https://ims.com.br/programacao/cinema-2/#sao-paulo" },
  { name: "NÁSTIENKA CINECLUBE RUSSO", address: "R. do Lago, 717 - Butantã", infoUrl: "https://www.instagram.com/nastienka.cineclube" },
  { name: "NASTIENKA CINECLUBE", address: "Sala 212, Faculdade de Letras da USP - Avenida Professor Luciano Gualberto, 403 - Butantã", infoUrl: "https://www.instagram.com/nastienka.cineclube/" },
  { name: "PATUÁ DISCOS", address: "Rua Fidalga, 516 - Vila Madalena", infoUrl: "https://www.instagram.com/patuadiscos/" },
  { name: "SESC 24 DE MAIO", address: "R. 24 de Maio, 109 - República", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC AVENIDA PAULISTA", address: "Av. Paulista, 119 - Bela Vista", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC BELENZINHO", address: "R. Padre Adelino, 1000 - Belenzinho", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC CAMPO LIMPO", address: "R. Nossa Sra. do Bom Conselho, 120 - Vila Prel", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC CONSOLAÇÃO", address: "R. Dr. Vila Nova, 245 - Vila Buarque", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC INTERLAGOS", address: "Av. Manuel Alves Soares, 1100 - Parque Colonial", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC IPIRANGA", address: "R. Bom Pastor, 822 - Ipiranga", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC PINHEIROS", address: "R. Pais Leme, 195 - Pinheiros", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC POMPEIA", address: "R. Clélia, 93 - Água Branca", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC SANTANA", address: "Av. Luiz Dumont Villares, 579 - Santana", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC SANTO AMARO", address: "R. Amador Bueno, 505 - Santo Amaro", infoUrl: "https://www.sescsp.org.br/programacao" },
  { name: "SESC VILA MARIANA", address: "R. Pelotas, 141 - Vila Mariana", infoUrl: "https://www.sescsp.org.br/programacao" },
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
