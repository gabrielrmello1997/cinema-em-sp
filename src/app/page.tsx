import { loadStored } from "@/lib/substack/store";
import SessionTable from "@/components/session-table";

export default async function Home() {
  const stored = await loadStored();

  if (!stored || stored.sessions.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-zinc-500">Nenhuma sessão disponível. Execute /api/refresh primeiro.</p>
      </main>
    );
  }

  return (
    <SessionTable
      sessions={stored.sessions}
      allSessions={stored.allSessions}
      feedTitle={stored.feedTitle}
      refreshedAt={stored.refreshedAt}
    />
  );
}
