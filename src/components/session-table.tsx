"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import type { Session, CinemaInfo } from "@/lib/substack/programming";
import { DAY_ORDER, parseDate, todayDate } from "@/lib/session-utils";
import Sidebar from "@/components/sidebar";
import Hero from "@/components/hero";
import Toolbar from "@/components/toolbar";
import Agenda from "@/components/agenda";
import SobreSection from "@/components/sobre-section";
import TextosSection from "@/components/textos-section";
import CtaSection from "@/components/cta-section";
import Footer from "@/components/footer";
import FullscreenPoster from "@/components/fullscreen-poster";

interface Props {
  sessions: Session[];
  allSessions: Session[];
  feedTitle: string;
  refreshedAt: string;
  cinemas: CinemaInfo[];
}

export default function SessionTable({ sessions, allSessions, feedTitle, refreshedAt, cinemas }: Props) {
  const [query, setQuery] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(-1);
  const [postOpen, setPostOpen] = useState(false);
  const [fullscreenPoster, setFullscreenPoster] = useState<string | null>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const postTitles = useMemo(() => {
    const set = new Set<string>();
    for (const s of allSessions) {
      if (s.feedTitle) set.add(s.feedTitle);
    }
    return Array.from(set);
  }, [allSessions]);

  const olderPostTitles = useMemo(() =>
    postTitles.filter(t => t !== feedTitle),
  [postTitles, feedTitle]);

  const resolvedSessions = useMemo(() => {
    if (!selectedPost) return sessions;
    return allSessions.filter((s) => s.feedTitle === selectedPost);
  }, [selectedPost, sessions, allSessions]);

  const currentPostTitle = selectedPost || feedTitle;

  const daysOut = useMemo(() => {
    const unique = new Map<string, Session[]>();
    for (const s of resolvedSessions) {
      if (!unique.has(s.day)) unique.set(s.day, []);
      unique.get(s.day)!.push(s);
    }
    return Array.from(unique.entries())
      .sort(([a], [b]) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99))
      .map(([day, sess]) => {
        const d = parseDate(sess[0]);
        const today = todayDate();
        let year = today.getFullYear();
        if (d) {
          const test = new Date(year, d.getMonth(), d.getDate());
          if (test.getTime() > today.getTime() + 90 * 24 * 60 * 60 * 1000) year -= 1;
        }
        const dayDate = d ? new Date(year, d.getMonth(), d.getDate()) : null;
        return { day, sessions: sess, date: dayDate };
      });
  }, [resolvedSessions]);

  const dayTabs = useMemo(() => {
    const today = todayDate();
    return daysOut.map((d, i) => {
      if (!d.date) return { ...d, label: d.day, dayNum: 0, month: "", isToday: false, index: i };
      const diff = Math.round((d.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let label: string;
      if (diff === 0) label = "HOJE";
      else if (diff === 1) label = "AMANHÃ";
      else label = d.date.toLocaleDateString("pt-BR", { weekday: "long" }).replace("-feira", "").toUpperCase();
      return { ...d, label, dayNum: d.date.getDate(), month: d.date.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase().slice(0, 3), isToday: diff === 0, index: i };
    });
  }, [daysOut]);

  const daySelectorDays = useMemo(() =>
    dayTabs.map((d) => ({
      id: d.day,
      label: d.label,
      dateLabel: `${String(d.dayNum).padStart(2, "0")} ${d.month.slice(0, 3)}`,
    })),
  [dayTabs]);

  const selectedDayId = activeDayIndex >= 0 ? dayTabs[activeDayIndex]?.day ?? "" : "";

  const filtered = useMemo(() => {
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const q = normalize(query);
    const selectedDay = activeDayIndex >= 0 ? dayTabs[activeDayIndex]?.day : null;
    const result = resolvedSessions.filter((s) => {
      if (selectedDay && s.day !== selectedDay) return false;
      if (q) {
        const inTitle = normalize(s.title).includes(q);
        const inCinema = normalize(s.cinema).includes(q);
        const inDirector = normalize(s.director).includes(q);
        const inCountry = normalize(s.country).includes(q);
        if (!inTitle && !inCinema && !inDirector && !inCountry) return false;
      }
      if (cinemaFilter && s.cinema !== cinemaFilter) return false;
      if (timeFilter) {
        const h = parseInt(s.time);
        if (timeFilter === "manha" && h >= 12) return false;
        if (timeFilter === "tarde" && (h < 12 || h >= 18)) return false;
        if (timeFilter === "noite" && h < 18) return false;
      }
      return true;
    });
    const timeVal = (s: Session) => {
      const h = parseInt(s.time);
      const m = parseInt(s.time.split("h")[1] || "0");
      return h * 60 + m;
    };
    result.sort((a, b) => {
      const da = parseDate(a);
      const db = parseDate(b);
      if (da && db) {
        const dateDiff = da.getTime() - db.getTime();
        if (dateDiff !== 0) return dateDiff;
      }
      return timeVal(a) - timeVal(b);
    });
    return result;
  }, [resolvedSessions, query, cinemaFilter, timeFilter, activeDayIndex, dayTabs]);

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of filtered) {
      const gk = `${s.cinema}|${s.day}|${s.time}|${s.mostra}`;
      if (!map.has(gk)) map.set(gk, []);
      map.get(gk)!.push(s);
    }
    return Array.from(map.values());
  }, [filtered]);

  const dayGroups = useMemo(() => {
    const result: { day: string; groups: Session[][] }[] = [];
    for (const g of groups) {
      const day = g[0].day;
      const last = result[result.length - 1];
      if (last && last.day === day) {
        last.groups.push(g);
      } else {
        result.push({ day, groups: [g] });
      }
    }
    return result;
  }, [groups]);

  const cinemaMap = useMemo(() => {
    const map = new Map<string, CinemaInfo>();
    for (const c of cinemas) map.set(c.name, c);
    return map;
  }, [cinemas]);

  const availableCinemas = useMemo(() =>
    Array.from(new Set(resolvedSessions.map((s) => s.cinema))).sort(),
  [resolvedSessions]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const closeFullscreen = useCallback(() => setFullscreenPoster(null), []);

  useEffect(() => {
    if (!postOpen) return;
    const handler = (e: MouseEvent) => {
      if (postRef.current && !postRef.current.contains(e.target as Node)) {
        setPostOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [postOpen]);

  useEffect(() => {
    if (!fullscreenPoster) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreenPoster, closeFullscreen]);

  const handleDayChange = useCallback((dayId: string) => {
    if (dayId === selectedDayId) {
      setActiveDayIndex(-1);
    } else {
      const idx = dayTabs.findIndex((d) => d.day === dayId);
      setActiveDayIndex(idx);
    }
  }, [selectedDayId, dayTabs]);

  const handleTogglePost = useCallback(() => setPostOpen((v) => !v), []);

  const handleSelectLatest = useCallback(() => {
    setSelectedPost("");
    setPostOpen(false);
    setActiveDayIndex(-1);
  }, []);

  const handleSelectOlder = useCallback((t: string) => {
    setSelectedPost((prev) => prev === t ? "" : t);
    setPostOpen(false);
    setActiveDayIndex(-1);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex">
        <Sidebar scrollTo={scrollTo} />
        <main className="flex-1 min-w-0">
          <Hero
            currentPostTitle={currentPostTitle}
            feedTitle={feedTitle}
            selectedPost={selectedPost}
            olderPostTitles={olderPostTitles}
            postOpen={postOpen}
            postRef={postRef}
            onTogglePost={handleTogglePost}
            onSelectLatest={handleSelectLatest}
            onSelectOlder={handleSelectOlder}
          />
          <Toolbar
            query={query}
            cinemaFilter={cinemaFilter}
            timeFilter={timeFilter}
            availableCinemas={availableCinemas}
            daySelectorDays={daySelectorDays}
            selectedDayId={selectedDayId}
            onQueryChange={setQuery}
            onCinemaFilterChange={setCinemaFilter}
            onTimeFilterChange={setTimeFilter}
            onDayChange={handleDayChange}
          />
          <Agenda
            groups={groups}
            dayGroups={dayGroups}
            dayTabs={dayTabs}
            cinemaMap={cinemaMap}
            onPosterClick={setFullscreenPoster}
          />
          <TextosSection />
          <SobreSection />
          <CtaSection />
          <Footer />
        </main>
      </div>
      <FullscreenPoster poster={fullscreenPoster} onClose={closeFullscreen} />
    </div>
  );
}
