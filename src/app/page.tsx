import { loadStored } from "@/lib/substack/store";
import SessionTable from "@/components/session-table";

export default async function Home() {
  const stored = await loadStored();

  if (!stored || stored.sessions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 bg-bg">
        <p className="text-ink/60 text-xl">Nenhuma sessão disponível. Execute /api/refresh primeiro.</p>
      </main>
    );
  }

  return (
    <SessionTable
      sessions={stored.sessions}
      allSessions={stored.allSessions}
      feedTitle={stored.feedTitle}
      refreshedAt={stored.refreshedAt}
      cinemas={stored.cinemas}
    />
  );
}
