import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pulse — Temporarily Unavailable",
  description: "This website is temporarily unavailable.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <Image
          src="/logo.png"
          className="mb-6 size-14"
          alt="Pulse"
          width={56}
          height={56}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Temporarily unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          This website is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  );
}
