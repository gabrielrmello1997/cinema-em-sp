# Prompt para Claude Code — Frontend Cinema em SP

## Contexto do Projeto

Projeto Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4. O backend já está completo e funcionando. Você deve criar o **frontend** (página principal + componentes) baseado no design do Figma, integrando-se ao backend existente.

## Como rodar o projeto

```bash
pnpm dev     # dev server em localhost:3000
pnpm build   # build de produção
pnpm lint    # ESLint
```

## Estrutura atual do projeto

```
src/
├── app/
│   ├── api/
│   │   ├── refresh/route.ts     # GET/POST — atualiza dados do feed RSS
│   │   └── sessions/route.ts    # GET — retorna dados cacheados (suporta ?from=DD/MM&to=DD/MM)
│   ├── favicon.ico
│   ├── globals.css              # Tailwind + variáveis CSS (light/dark mode)
│   ├── layout.tsx               # Root layout (Geist font, lang=pt-BR)
│   └── page.tsx                 # Página inicial (Server Component)
├── components/
│   └── session-table.tsx        # Componente atual (PODE SER SUBSTITUÍDO)
└── lib/
    ├── tmdb.ts                  # Cliente TMDB para posters
    └── substack/
        ├── programming.ts       # Interfaces Session, CinemaInfo + constantes
        ├── programming-dom.ts   # Parser do HTML do Substack
        ├── rss.ts               # Fetch do feed RSS
        └── store.ts             # Persistência em public/data/sessions.json
```

## Interfaces que você precisa usar

### Session (film session)
```ts
interface Session {
  cinema: string;     // "CINESESC"
  day: string;        // "QUARTA-FEIRA (09/07)"
  time: string;       // "19h30"
  title: string;      // "Blade Runner: O Caçador de Androides"
  year: number;       // 1982
  country: string;    // "EUA"
  duration: number;   // 117 (minutos)
  director: string;   // "Ridley Scott"
  mostra: string;     // "CINE-CONCERTO" (vazio se não aplicável)
  poster: string;     // URL do poster TMDB (vazio se não encontrado)
}
```

### CinemaInfo (cinema metadata)
```ts
interface CinemaInfo {
  name: string;       // "CINESESC"
  address: string;    // "R. Augusta, 2075 - Cerqueira César"
  infoUrl: string;    // "https://www.sescsp.org.br/programacao/"
}
```

### StoredData (retorno da API e do loadStored)
```ts
interface StoredData {
  feedDate: string;         // RFC 2822 date
  feedTitle: string;        // Título do post mais recente
  refreshedAt: string;      // ISO timestamp
  sessions: Session[];      // Sessões da semana mais recente
  allSessions: Session[];   // Todas as sessões acumuladas
  cinemas: CinemaInfo[];    // Dados dos 43 cinemas
}
```

## Fluxo de dados atual (NÃO MODIFICAR)

1. `public/data/sessions.json` é o cache persistente
2. `page.tsx` (Server Component) faz `loadStored()` e passa os dados como props
3. `page.tsx` renderiza um **componente client** (`"use client"`) com as props abaixo
4. `/api/refresh` atualiza o cache (chamado manualmente via GET ou POST)
5. `/api/sessions` serve o cache via API (com suporte a filtro por data)

**Props que page.tsx passa para o componente:**
```ts
<YourComponent
  sessions={stored.sessions}         // Session[] — semana atual
  allSessions={stored.allSessions}   // Session[] — todo o histórico
  feedTitle={stored.feedTitle}       // string
  refreshedAt={stored.refreshedAt}   // string
  cinemas={stored.cinemas}           // CinemaInfo[] — metadados dos cinemas
/>
```

## Layout atual (NÃO MODIFICAR)

`layout.tsx`:
```tsx
// Geist Sans + Geist Mono fonts (variáveis --font-geist-sans, --font-geist-mono)
// html lang="pt-BR", body com min-h-full flex flex-col
```

`page.tsx` atual:
```tsx
export default async function Home() {
  const stored = await loadStored();
  if (!stored || stored.sessions.length === 0) {
    return <p>Nenhuma sessão disponível. Execute /api/refresh primeiro.</p>;
  }
  return <YourComponent ... />;
}
```

## Classe utilitária existente que você pode usar

`parseDate(s: Session): Date | null` — extrai Date do campo `s.day` (formato "QUARTA-FEIRA (09/07)"):
```ts
function parseDate(s: Session): Date | null {
  const m = s.day.match(/\((\d{2})\/(\d{2})\)/);
  if (!m) return null;
  const date = new Date(new Date().getFullYear(), Number(m[2]) - 1, Number(m[1]));
  if (date.getTime() > Date.now() + 90 * 24 * 60 * 60 * 1000) {
    date.setFullYear(date.getFullYear() - 1);
  }
  return date;
}
```

## O que você deve fazer

1. **Substituir completamente `components/session-table.tsx`** — o componente atual é um placeholder de teste e será deletado/reescrito do zero com base no Figma
2. **Modificar `page.tsx`** se necessário para adaptar ao novo layout (ex: adicionar hero, sidebar, about section)
3. **Modificar `app/globals.css`** — adicionar estilos globais, variáveis de cor, fonts (se necessário custom fonts além da Geist)
4. **Criar novos componentes** em `components/` conforme necessário (ex: `hero.tsx`, `sidebar.tsx`, `film-card.tsx`, `about.tsx`)

## Recomendações técnicas

- Componente principal client: `"use client"` no topo
- Usar `useMemo` para derivações de dados (filtros, agrupamentos, semanas)
- A semana atual é `sessions` (sempre a última semana). Semanas anteriores vêm de `allSessions`
- `allSessions` contém TUDO (incluindo a semana atual). Use `sessionsInWeek(allSessions, mondayDate)` para filtrar por semana
- Para a sidebar de cinemas: use `cinemas` prop para nome + endereço + link. Para saber quais cinemas têm sessão na semana selecionada, derive de `resolvedSessions`
- `poster` pode ser string vazia — trate com fallback (placeholder ou sem imagem)
- Tailwind CSS v4 — use `@theme inline {}` no CSS para custom tokens

## O que NÃO fazer

- NÃO modificar `lib/` (backend inteiro — parsing, TMDB, store, RSS)
- NÃO modificar `app/api/` (API routes — refresh, sessions, test-substack)
- NÃO modificar `app/layout.tsx` a não ser que seja estritamente necessário
- NÃO adicionar novas dependências (npm packages) — use Tailwind + React built-ins
- NÃO mudar a estrutura de dados ou o fluxo backend→frontend
- NÃO manter nada do `session-table.tsx` atual — ele será deletado e reescrito do zero