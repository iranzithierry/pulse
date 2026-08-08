"use client";

import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EventList } from "@/components/event-list";
import { StreamDialog } from "@/components/stream-dialog";
import { StreamPanel } from "@/components/stream-panel";
import type { StreamEvent, StreamServer } from "@/lib/types";
import Image from "next/image";

export default function Home() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<StreamEvent | null>(null);
  const [servers, setServers] = useState<StreamServer[]>([]);
  const [serversLoading, setServersLoading] = useState(false);
  const [serversError, setServersError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);

    try {
      const response = await fetch("/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load events");
      }

      setEvents(data.events ?? []);
    } catch (error) {
      setEventsError(
        error instanceof Error ? error.message : "Failed to load events",
      );
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const loadServers = useCallback(async (event: StreamEvent) => {
    setSelectedEvent(event);
    setServers([]);
    setServersLoading(true);
    setServersError(null);

    try {
      const response = await fetch(
        `/api/streams?url=${encodeURIComponent(event.href)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load streams");
      }

      setServers(data.servers ?? []);
    } catch (error) {
      setServersError(
        error instanceof Error ? error.message : "Failed to load streams",
      );
    } finally {
      setServersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const clearSelection = useCallback(() => {
    setSelectedEvent(null);
    setServers([]);
    setServersError(null);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" className="size-10" alt="Pulse" width={42} height={42} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              Pulse - Live Streams
            </h1>
            <p className="text-xs text-zinc-500">
              Browse live matches and open stream servers
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {eventsError ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {eventsError}
          </div>
        ) : null}

        {eventsLoading && events.length === 0 ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-24 text-sm text-zinc-500">
            <LoaderCircle className="size-4 animate-spin" />
            Loading events...
          </div>
        ) : (
          <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <EventList
              events={events}
              selectedHref={selectedEvent?.href ?? null}
              loading={eventsLoading}
              onSelect={loadServers}
              onRefresh={loadEvents}
            />
            <div className="hidden min-h-0 lg:flex lg:flex-col">
              <StreamPanel
                event={selectedEvent}
                servers={servers}
                loading={serversLoading}
                error={serversError}
                onBack={clearSelection}
              />
            </div>
          </div>
        )}
      </main>

      <StreamDialog
        open={selectedEvent !== null}
        event={selectedEvent}
        servers={servers}
        loading={serversLoading}
        error={serversError}
        onClose={clearSelection}
      />
    </div>
  );
}
