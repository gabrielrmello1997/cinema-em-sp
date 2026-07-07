export type Cinema = {
    name: string;
    address: string;
    content: string;
  };
  
  
  export function parseCinemas(text: string): Cinema[] {
  
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);
  
  
    const cinemas: Cinema[] = [];
  
    let currentCinema: Cinema | null = null;
  
  
    for (const line of lines) {
  
  
      const isCinema =
        line.length > 3 &&
        line.length < 60 &&
        line === line.toUpperCase() &&
        !line.includes("SEGUNDA") &&
        !line.includes("TERÇA") &&
        !line.includes("QUARTA") &&
        !line.includes("MOSTRA") &&
        !line.includes("EM JANELA") &&
        !line.includes("DIREÇÃO");
  
  
      if (isCinema) {
  
        if (currentCinema) {
          cinemas.push(currentCinema);
        }
  
  
        currentCinema = {
          name: line,
          address: "",
          content: line
        };
  
  
        continue;
      }
  
  
      if (!currentCinema) {
        continue;
      }
  
  
      if (
        line.includes("Rua") ||
        line.includes("R.") ||
        line.includes("Avenida") ||
        line.includes("Av.")
      ) {
  
        currentCinema.address = line;
  
      }
  
  
      currentCinema.content += "\n" + line;
  
    }
  
  
    if (currentCinema) {
      cinemas.push(currentCinema);
    }
  
  
    return cinemas;
  }