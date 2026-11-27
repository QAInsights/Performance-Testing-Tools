import { datasetLastVerified, tools } from '../data/tools';
import { reviews } from '../data/reviews';
import { GUIDE_LANDINGS } from '../data/landings';
import { TIER_A_COMPARISONS } from '../data/comparisons';
import { landingPath } from '../lib/landingContent';
import { buildRssFeed, type FeedItem } from '../lib/feed';
import { absoluteUrl } from '../lib/urls';
import { homeDescription, homeTitle } from '../lib/pageMeta';

export function GET() {
  const toolName = (slug: string) =>
    tools.find((tool) => tool.slug === slug)?.name ?? slug;
  const items: FeedItem[] = [
    ...reviews.map((review) => ({
      title: `${toolName(review.slug)} review: ${review.handsOn ? 'hands-on' : 'desk'} verdict`,
      link: absoluteUrl(`reviews/${review.slug}`),
      description: review.verdict,
      pubDate: review.reviewedAt,
    })),
    ...GUIDE_LANDINGS.map((landing) => ({
      title: landing.title,
      link: absoluteUrl(landingPath(landing)),
      description: landing.description,
      pubDate: datasetLastVerified,
    })),
    ...TIER_A_COMPARISONS.map((spec) => ({
      title: `${spec.leftLabel} vs ${spec.rightLabel}: spec comparison & verdict`,
      link: absoluteUrl(`vs/${spec.pairPath}`),
      description: spec.answerBox,
      pubDate: datasetLastVerified,
    })),
  ];
  const lastBuildDate =
    [...reviews.map((review) => review.reviewedAt), datasetLastVerified]
      .sort()
      .at(-1) ?? datasetLastVerified;
  const xml = buildRssFeed(
    {
      title: homeTitle(),
      link: absoluteUrl(''),
      description: homeDescription(),
      lastBuildDate,
      selfLink: absoluteUrl('feed.xml'),
    },
    items,
  );
  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  });
}
