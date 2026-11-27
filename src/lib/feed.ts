export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid?: string;
}

export interface FeedChannel {
  title: string;
  link: string;
  description: string;
  language?: string;
  lastBuildDate?: string;
  selfLink?: string;
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function rssDate(isoDate: string): string {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime())
    ? new Date().toUTCString()
    : date.toUTCString();
}

export function buildRssFeed(
  channel: FeedChannel,
  items: readonly FeedItem[],
): string {
  const sorted = [...items].sort(
    (left, right) => Date.parse(right.pubDate) - Date.parse(left.pubDate),
  );
  const lastBuildDate = rssDate(
    channel.lastBuildDate ?? sorted[0]?.pubDate ?? new Date().toISOString(),
  );
  const itemXml = sorted
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.guid ?? item.link)}</guid>
      <pubDate>${rssDate(item.pubDate)}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
    )
    .join('\n');
  const selfLink = channel.selfLink
    ? `    <atom:link href="${escapeXml(channel.selfLink)}" rel="self" type="application/rss+xml" />\n`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(channel.link)}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${channel.language ?? 'en-us'}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${selfLink}${itemXml}
  </channel>
</rss>
`;
}
