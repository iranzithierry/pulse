export type StreamEvent = {
  id: string;
  name: string;
  category: string;
  href: string;
  isLive: boolean;
  teamColor?: string;
  timeLabel?: string;
};

export type StreamServer = {
  id: string;
  label: string;
  isActive: boolean;
  embedUrl: string;
};

export const EMBED_BASE_URL = "https://gooz.aapmains.net/new-stream-embed";
export const SOURCE_BASE_URL = "https://thestreameast.top";
