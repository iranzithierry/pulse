"use client";

import { ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function WatchContent() {
  const searchParams = useSearchParams();
  const embedUrl = searchParams.get("url");
  const title = searchParams.get("title") ?? "Stream";

  if (!embedUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-center text-zinc-300">
        <p>Missing stream URL.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <p className="truncate text-sm font-medium">{title}</p>
        <span className="w-16" />
      </header>
      <main className="flex-1">
        <iframe
          src={embedUrl}
          title={title}
          className="h-[calc(100vh-57px)] w-full border-0 bg-black"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </main>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
          <LoaderCircle className="size-5 animate-spin" />
        </div>
      }
    >
      <WatchContent />
    </Suspense>
  );
}
