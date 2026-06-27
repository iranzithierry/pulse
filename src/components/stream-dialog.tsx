"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StreamPanel } from "@/components/stream-panel";
import type { StreamEvent, StreamServer } from "@/lib/types";

type StreamDialogProps = {
  open: boolean;
  event: StreamEvent | null;
  servers: StreamServer[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

export function StreamDialog({
  open,
  event,
  servers,
  loading,
  error,
  onClose,
}: StreamDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const media = window.matchMedia("(min-width: 1024px)");
    if (media.matches) return;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open || !event) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close stream servers"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Stream servers for ${event.name}`}
        className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col overflow-hidden rounded-t-xl bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgb(0_0_0/0.12)]"
      >
        <div className="flex shrink-0 justify-center py-2">
          <span className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>
        <StreamPanel
          event={event}
          servers={servers}
          loading={loading}
          error={error}
          onBack={onClose}
          variant="dialog"
        />
      </div>
    </div>,
    document.body,
  );
}
