"use client";

import { ChevronRight, Radio, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { StreamEvent } from "@/lib/types";

type EventListProps = {
  events: StreamEvent[];
  selectedHref: string | null;
  loading: boolean;
  onSelect: (event: StreamEvent) => void;
  onRefresh: () => void;
};

export function EventList({
  events,
  selectedHref,
  loading,
  onSelect,
  onRefresh,
}: EventListProps) {
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return events;

    return events.filter(
      (event) =>
        event.name.toLowerCase().includes(normalized) ||
        event.category.toLowerCase().includes(normalized),
    );
  }, [events, query]);

  return (
    <section className="flex h-full min-w-0 flex-col border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Live events</h2>
          <p className="text-xs text-zinc-500">{events.length} matches found</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="border-b border-zinc-200 px-4 py-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search teams or leagues..."
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto max-h-[500px]">
        {filteredEvents.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            No events match your search.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {filteredEvents.map((event) => {
              const selected = selectedHref === event.href;

              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(event)}
                    className={`flex cursor-pointer w-full min-w-0 items-center gap-3 px-4 py-3 text-left transition ${selected
                        ? "bg-zinc-100"
                        : "hover:bg-zinc-100"
                      }`}
                  >
                    <span
                      className="mt-0.5 size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: event.teamColor ?? "#71717a",
                      }}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                          {event.name}
                        </p>
                        {event.isLive ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                            <Radio className="size-3" />
                            Live
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="truncate text-xs text-zinc-500">
                          {event.category}
                        </p>
                        <span className="text-xs text-zinc-500">·</span>
                        {event.timeLabel ? <span className="inline-flex shrink-0 items-center rounded-full bg-gray-200 px-2 py-0.2 text-[10px] text-gray-700">
                          {`${event.timeLabel}`}
                        </span> : ""}
                      </div>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-zinc-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
