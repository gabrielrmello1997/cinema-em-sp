"use client";

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { Session, CinemaInfo } from "@/lib/substack/programming";
import { DAY_ORDER, parseDate, todayDate } from "@/lib/session-utils";
import Sidebar from "@/components/sidebar";
import MobileHeader from "@/components/mobile-header";
import Hero from "@/components/hero";
import Toolbar from "@/components/toolbar";
import Agenda from "@/components/agenda";
import SobreSection from "@/components/sobre-section";
import TextosSection from "@/components/textos-section";
import CtaSection from "@/components/cta-section";
import Footer from "@/components/footer";
import FullscreenPoster from "@/components/fullscreen-poster";
import DayStickyNav from "@/components/day-sticky-nav";

interface Props {
  sessions: Session[];
  allSessions: Session[];
  feedTitle: string;
  refreshedAt: string;
  cinemas: CinemaInfo[];
}

type PostDay = {
  day: string;
};

type PostNavigationItem = {
  title: string;
  days: PostDay[];
};

type PendingPostNavigation = {
  postTitle: string;
  dayId: string;
} | null;

function getOrderedDays(postSessions: Session[]): PostDay[] {
  const uniqueDays = new Set<string>();

  for (const session of postSessions) {
    if (session.day) uniqueDays.add(session.day);
  }

  return Array.from(uniqueDays)
    .sort((a, b) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99))
    .map((day) => ({ day }));
}

function getVisibleElementById(id: string): HTMLElement | null {
  const elements = document.querySelectorAll<HTMLElement>(`[id="${id}"]`);

  for (const element of elements) {
    if (element.offsetParent !== null) return element;
  }

  return null;
}

export default function SessionTable({
  sessions,
  allSessions,
  feedTitle,
  refreshedAt,
  cinemas,
}: Props) {
  const [query, setQuery] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(-1);
  const [postOpen, setPostOpen] = useState(false);
  const [fullscreenPoster, setFullscreenPoster] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const postRef = useRef<HTMLDivElement>(null);
  const pendingPostNavigationRef = useRef<PendingPostNavigation>(null);
  const shouldScrollToAgendaRef = useRef(false);

  const postTitles = useMemo(() => {
    const titles = new Set<string>();

    for (const session of allSessions) {
      if (session.feedTitle) titles.add(session.feedTitle);
    }

    const orderedTitles = Array.from(titles);

    if (!orderedTitles.includes(feedTitle)) {
      orderedTitles.unshift(feedTitle);
    } else if (orderedTitles[0] !== feedTitle) {
      return [
        feedTitle,
        ...orderedTitles.filter((title) => title !== feedTitle),
      ];
    }

    return orderedTitles;
  }, [allSessions, feedTitle]);

  const olderPostTitles = useMemo(
    () => postTitles.filter((title) => title !== feedTitle),
    [postTitles, feedTitle],
  );

  const resolvedSessions = useMemo(() => {
    if (!selectedPost) return sessions;

    return allSessions.filter(
      (session) => session.feedTitle === selectedPost,
    );
  }, [selectedPost, sessions, allSessions]);

  const currentPostTitle = selectedPost || feedTitle;

  const postNavigation = useMemo<PostNavigationItem[]>(() => {
    return postTitles
      .map((title) => {
        const matchingSessions = allSessions.filter(
          (session) => session.feedTitle === title,
        );

        const postSessions =
          title === feedTitle && matchingSessions.length === 0
            ? sessions
            : matchingSessions;

        return {
          title,
          days: getOrderedDays(postSessions),
        };
      })
      .filter((post) => post.days.length > 0);
  }, [postTitles, allSessions, feedTitle, sessions]);

  const currentPostNavigationIndex = useMemo(
    () =>
      postNavigation.findIndex((post) => post.title === currentPostTitle),
    [postNavigation, currentPostTitle],
  );

  const canNavigateToNewerPost = currentPostNavigationIndex > 0;
  const canNavigateToOlderPost =
    currentPostNavigationIndex >= 0 &&
    currentPostNavigationIndex < postNavigation.length - 1;

  const daysOut = useMemo(() => {
    const unique = new Map<string, Session[]>();

    for (const session of resolvedSessions) {
      if (!unique.has(session.day)) unique.set(session.day, []);
      unique.get(session.day)!.push(session);
    }

    return Array.from(unique.entries())
      .sort(([a], [b]) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99))
      .map(([day, daySessions]) => {
        const parsedDate = parseDate(daySessions[0]);
        const today = todayDate();
        let year = today.getFullYear();

        if (parsedDate) {
          const testDate = new Date(
            year,
            parsedDate.getMonth(),
            parsedDate.getDate(),
          );

          if (
            testDate.getTime() >
            today.getTime() + 90 * 24 * 60 * 60 * 1000
          ) {
            year -= 1;
          }
        }

        const date = parsedDate
          ? new Date(year, parsedDate.getMonth(), parsedDate.getDate())
          : null;

        return {
          day,
          sessions: daySessions,
          date,
        };
      });
  }, [resolvedSessions]);

  const dayTabs = useMemo(() => {
    const today = todayDate();

    return daysOut.map((dayOutput, index) => {
      if (!dayOutput.date) {
        return {
          ...dayOutput,
          label: dayOutput.day,
          dayNum: 0,
          month: "",
          isToday: false,
          index,
        };
      }

      const diff = Math.round(
        (dayOutput.date.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      let label: string;

      if (diff === 0) {
        label = "HOJE";
      } else if (diff === 1) {
        label = "AMANHÃ";
      } else {
        label = dayOutput.date
          .toLocaleDateString("pt-BR", { weekday: "long" })
          .replace("-feira", "")
          .toUpperCase();
      }

      return {
        ...dayOutput,
        label,
        dayNum: dayOutput.date.getDate(),
        month: dayOutput.date
          .toLocaleDateString("pt-BR", { month: "long" })
          .toUpperCase()
          .slice(0, 3),
        isToday: diff === 0,
        index,
      };
    });
  }, [daysOut]);

  const daySelectorDays = useMemo(
    () =>
      dayTabs.map((day) => ({
        id: day.day,
        label: day.label,
        dateLabel: `${String(day.dayNum).padStart(2, "0")} ${day.month.slice(0, 3)}`,
      })),
    [dayTabs],
  );

  const selectedDayId =
    activeDayIndex >= 0 ? dayTabs[activeDayIndex]?.day ?? "" : "";

  const filtered = useMemo(() => {
    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const normalizedQuery = normalize(query);
    const selectedDay =
      activeDayIndex >= 0 ? dayTabs[activeDayIndex]?.day : null;

    const result = resolvedSessions.filter((session) => {
      if (selectedDay && session.day !== selectedDay) return false;

      if (normalizedQuery) {
        const inTitle = normalize(session.title).includes(normalizedQuery);
        const inCinema = normalize(session.cinema).includes(normalizedQuery);
        const inDirector = normalize(session.director).includes(normalizedQuery);
        const inCountry = normalize(session.country).includes(normalizedQuery);

        if (!inTitle && !inCinema && !inDirector && !inCountry) {
          return false;
        }
      }

      if (cinemaFilter && session.cinema !== cinemaFilter) return false;

      if (timeFilter) {
        const hour = Number.parseInt(session.time, 10);

        if (timeFilter === "manha" && hour >= 12) return false;
        if (timeFilter === "tarde" && (hour < 12 || hour >= 18)) {
          return false;
        }
        if (timeFilter === "noite" && hour < 18) return false;
      }

      return true;
    });

    const timeValue = (session: Session) => {
      const hour = Number.parseInt(session.time, 10);
      const minute = Number.parseInt(session.time.split("h")[1] || "0", 10);
      return hour * 60 + minute;
    };

    result.sort((a, b) => {
      const dateA = parseDate(a);
      const dateB = parseDate(b);

      if (dateA && dateB) {
        const dateDifference = dateA.getTime() - dateB.getTime();
        if (dateDifference !== 0) return dateDifference;
      }

      return timeValue(a) - timeValue(b);
    });

    return result;
  }, [
    resolvedSessions,
    query,
    cinemaFilter,
    timeFilter,
    activeDayIndex,
    dayTabs,
  ]);

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>();

    for (const session of filtered) {
      const groupKey = `${session.cinema}|${session.day}|${session.time}|${session.mostra}`;

      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey)!.push(session);
    }

    return Array.from(map.values());
  }, [filtered]);

  const dayGroups = useMemo(() => {
    const result: { day: string; groups: Session[][] }[] = [];

    for (const group of groups) {
      const day = group[0].day;
      const last = result[result.length - 1];

      if (last && last.day === day) {
        last.groups.push(group);
      } else {
        result.push({ day, groups: [group] });
      }
    }

    return result;
  }, [groups]);

  const cinemaMap = useMemo(() => {
    const map = new Map<string, CinemaInfo>();

    for (const cinema of cinemas) {
      map.set(cinema.name, cinema);
    }

    return map;
  }, [cinemas]);

  const availableCinemas = useMemo(
    () =>
      Array.from(
        new Set(resolvedSessions.map((session) => session.cinema)),
      ).sort(),
    [resolvedSessions],
  );

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const closeFullscreen = useCallback(
    () => setFullscreenPoster(null),
    [],
  );

  useEffect(() => {
    if (!postOpen) return;

    const handler = (event: MouseEvent) => {
      if (
        postRef.current &&
        !postRef.current.contains(event.target as Node)
      ) {
        setPostOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [postOpen]);

  useEffect(() => {
    if (!fullscreenPoster) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFullscreen();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreenPoster, closeFullscreen]);

  useEffect(() => {
    const pendingNavigation = pendingPostNavigationRef.current;

    if (!pendingNavigation) return;
    if (pendingNavigation.postTitle !== currentPostTitle) return;

    const targetIndex = dayTabs.findIndex(
      (day) => day.day === pendingNavigation.dayId,
    );

    if (targetIndex < 0) return;

    pendingPostNavigationRef.current = null;
    setActiveDayIndex(targetIndex);
  }, [currentPostTitle, dayTabs]);

  useEffect(() => {
    if (!shouldScrollToAgendaRef.current) return;
    if (activeDayIndex < 0 || dayGroups.length === 0) return;

    shouldScrollToAgendaRef.current = false;

    const frameOne = window.requestAnimationFrame(() => {
      const frameTwo = window.requestAnimationFrame(() => {
        const agenda = getVisibleElementById("agenda");

        if (!agenda) return;

        const headerOffset = window.innerWidth < 1024 ? 102  : 24;
        const top =
          agenda.getBoundingClientRect().top +
          window.scrollY -
          headerOffset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      });

      return () => window.cancelAnimationFrame(frameTwo);
    });

    return () => window.cancelAnimationFrame(frameOne);
  }, [activeDayIndex, currentPostTitle, dayGroups.length]);

  const handleDayChange = useCallback(
    (dayId: string) => {
      if (dayId === selectedDayId) {
        setActiveDayIndex(-1);
      } else {
        const index = dayTabs.findIndex((day) => day.day === dayId);
        setActiveDayIndex(index);
      }
    },
    [selectedDayId, dayTabs],
  );

  const handleStickyDayNavigation = useCallback(
    (direction: "previous" | "next", currentDayIndex: number) => {
      const currentPostIndex = postNavigation.findIndex(
        (post) => post.title === currentPostTitle,
      );
  
      if (currentPostIndex < 0) return;
  
      // Seta esquerda: dia cronologicamente anterior
      if (direction === "previous") {
        if (currentDayIndex > 0) {
          shouldScrollToAgendaRef.current = true;
          setActiveDayIndex(currentDayIndex - 1);
          return;
        }
  
        // O post anterior cronologicamente é mais antigo
        // e aparece depois na lista postNavigation.
        const olderPost = postNavigation[currentPostIndex + 1];
        const targetDay = olderPost?.days[olderPost.days.length - 1];
  
        if (!olderPost || !targetDay) return;
  
        pendingPostNavigationRef.current = {
          postTitle: olderPost.title,
          dayId: targetDay.day,
        };
  
        shouldScrollToAgendaRef.current = true;
        setSelectedPost(
          olderPost.title === feedTitle ? "" : olderPost.title,
        );
        setActiveDayIndex(-1);
        setPostOpen(false);
        return;
      }
  
      // Seta direita: próximo dia cronológico
      if (currentDayIndex < dayTabs.length - 1) {
        shouldScrollToAgendaRef.current = true;
        setActiveDayIndex(currentDayIndex + 1);
        return;
      }
  
      // O próximo post cronologicamente é mais recente
      // e aparece antes na lista postNavigation.
      const newerPost = postNavigation[currentPostIndex - 1];
      const targetDay = newerPost?.days[0];
  
      if (!newerPost || !targetDay) return;
  
      pendingPostNavigationRef.current = {
        postTitle: newerPost.title,
        dayId: targetDay.day,
      };
  
      shouldScrollToAgendaRef.current = true;
      setSelectedPost(
        newerPost.title === feedTitle ? "" : newerPost.title,
      );
      setActiveDayIndex(-1);
      setPostOpen(false);
    },
    [
      currentPostTitle,
      dayTabs.length,
      feedTitle,
      postNavigation,
    ],
  );

  const handleTogglePost = useCallback(
    () => setPostOpen((value) => !value),
    [],
  );

  const handleSelectLatest = useCallback(() => {
    pendingPostNavigationRef.current = null;
    shouldScrollToAgendaRef.current = false;
    setSelectedPost("");
    setPostOpen(false);
    setActiveDayIndex(-1);
  }, []);

  const handleSelectOlder = useCallback((title: string) => {
    pendingPostNavigationRef.current = null;
    shouldScrollToAgendaRef.current = false;
    setSelectedPost((previous) => (previous === title ? "" : title));
    setPostOpen(false);
    setActiveDayIndex(-1);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <MobileHeader
        menuOpen={menuOpen}
        onToggle={() => setMenuOpen((value) => !value)}
        scrollTo={scrollTo}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex">
        <div className="max-lg:hidden">
          <Sidebar scrollTo={scrollTo} />
        </div>

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

          <div className="lg:hidden">
            <DayStickyNav
              dayTabs={dayTabs}
              activeDayIndex={activeDayIndex}
              canNavigateToPreviousPost={canNavigateToOlderPost}
              canNavigateToNextPost={canNavigateToNewerPost}
              onNavigate={handleStickyDayNavigation}
            />
          </div>

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

      <FullscreenPoster
        poster={fullscreenPoster}
        onClose={closeFullscreen}
      />
    </div>
  );
}

