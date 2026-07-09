import { loadStored } from "@/lib/substack/store";
import Sidebar from "@/components/sidebar";
import SessionList from "@/components/session-list";

export default async function Home() {
  const stored = await loadStored();

  if (!stored || stored.sessions.length === 0) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <p className="font-sans text-muted text-base">
            Nenhuma sessão disponível. Execute{" "}
            <code className="bg-card px-1 py-0.5 rounded text-foreground">/api/refresh</code>{" "}
            primeiro.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <SessionList
          sessions={stored.sessions}
          allSessions={stored.allSessions}
          feedTitle={stored.feedTitle}
          refreshedAt={stored.refreshedAt}
          cinemas={stored.cinemas}
        />
      </div>
    </div>
  );
}
