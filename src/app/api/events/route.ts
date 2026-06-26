import { NextResponse } from "next/server";
import { scrapeEvents } from "@/lib/scraper";

export async function GET() {
  try {
    const events = await scrapeEvents();
    return NextResponse.json({ events });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
