import { loadStored } from "@/lib/substack/store";
import SessionTable from "@/components/session-table";

export default async function Home() {
  const data = await loadStored();

  if (!data || !data.sessions?.length) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 bg-bg">
        <p className="text-ink/60 text-xl">Nenhuma sessão disponível. Execute pnpm refresh primeiro.</p>
      </main>
    );
  }

  return (
    <SessionTable
      sessions={data.sessions}
      allSessions={data.allSessions}
      feedTitle={data.feedTitle}
      refreshedAt={data.refreshedAt}
      cinemas={data.cinemas}
    />
  );
}
