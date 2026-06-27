import * as cheerio from "cheerio";
import {
  EMBED_BASE_URL,
  SOURCE_BASE_URL,
  type StreamEvent,
  type StreamServer,
} from "./types";

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: FETCH_HEADERS,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractTeamColor(style: string | undefined): string | undefined {
  if (!style) return undefined;
  const match = style.match(/background-color:\s*([^;]+)/i);
  return match?.[1]?.trim();
}

function extractStreamIdFromEmbedUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  const match = src.match(/new-stream-embed\/(\d+)/);
  return match?.[1];
}

export async function scrapeEvents(
  sourceUrl = SOURCE_BASE_URL,
): Promise<StreamEvent[]> {
  const html = await fetchHtml(sourceUrl);
  const $ = cheerio.load(html);
  const events: StreamEvent[] = [];

  $("li.f1-podium--item").each((index, element) => {
    const item = $(element);
    const link = item.find("a.f1-podium--link").first();
    const href = link.attr("href");

    if (!href) return;

    const category = normalizeText(
      item.find(".f1-podium--rank").first().text(),
    );
    const name = normalizeText(item.find(".f1-podium--driver").first().text());
    const timeLabel = normalizeText(
      item.find(".f1-podium--time").first().text(),
    );
    const isLive =
      item.find(".btn-live").length > 0 ||
      /live/i.test(timeLabel) ||
      item.find('[style*="930f0d"]').length > 0;
    const teamColor = extractTeamColor(
      item.find(".team-color-icon").first().attr("style"),
    );

    events.push({
      id: `${index}-${href}`,
      name: name || category || "Untitled event",
      category: category || "Event",
      href: href.startsWith("http") ? href : new URL(href, sourceUrl).href,
      isLive,
      teamColor,
      timeLabel: timeLabel || undefined,
    });
  });

  return events;
}

export async function scrapeStreamServers(
  eventUrl: string,
): Promise<StreamServer[]> {
  const html = await fetchHtml(eventUrl);
  const $ = cheerio.load(html);
  const servers: StreamServer[] = [];

  $("#Alternatifler .btns, #Alternatifler [id^='stream-btn-']").each(
    (_, element) => {
      const button = $(element);
      const idAttr = button.attr("id") ?? "";
      const onclick = button.attr("onclick") ?? "";
      const idMatch =
        idAttr.match(/stream-btn-(\d+)/) ??
        onclick.match(/changeStream\((\d+)\)/);
      const id = idMatch?.[1];

      if (!id) return;

      const label = normalizeText(button.text()) || `Server ${id}`;
      const isActive = (button.attr("class") ?? "").includes("Aktif");

      servers.push({
        id,
        label,
        isActive,
        embedUrl: `${EMBED_BASE_URL}/${id}?ad=111`,
      });
    },
  );

  if (servers.length === 0) {
    const iframeSrc =
      $("#wp_player").attr("src") ??
      $(".embed-responsive iframe.embed-responsive-item").attr("src");
    const id = extractStreamIdFromEmbedUrl(iframeSrc);

    if (id) {
      servers.push({
        id,
        label: `Server 1`,
        isActive: true,
        embedUrl: `${EMBED_BASE_URL}/${id}?ad=111`,
      });
    }
  }

  const unique = new Map<string, StreamServer>();
  for (const server of servers) {
    unique.set(server.id, server);
  }

  return Array.from(unique.values());
}
