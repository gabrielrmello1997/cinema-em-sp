export const dynamic = "force-dynamic";

import SessionTable from "@/components/session-table";

export default async function Home() {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  let data: {
    sessions: any[];
    allSessions: any[];
    feedTitle: string;
    refreshedAt: string;
    cinemas: any[];
  } | null = null;

  try {
    const res = await fetch(`${base}/api/sessions`, { cache: "no-store" });
    if (res.ok) data = await res.json();
  } catch {}

  if (!data || !data.sessions?.length) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 bg-bg">
        <p className="text-ink/60 text-xl">Nenhuma sessão disponível. Execute /api/refresh primeiro.</p>
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
