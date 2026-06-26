import { type NextRequest, NextResponse } from "next/server";
import { scrapeStreamServers } from "@/lib/scraper";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");

	if (!url) {
		return NextResponse.json(
			{ error: "Missing url parameter" },
			{ status: 400 },
		);
	}

	try {
		const parsed = new URL(url);
		if (!parsed.hostname.endsWith("thestreameast.top")) {
			return NextResponse.json(
				{ error: "Invalid source URL" },
				{ status: 400 },
			);
		}

		const servers = await scrapeStreamServers(url);
		return NextResponse.json({ servers });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to load streams";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
