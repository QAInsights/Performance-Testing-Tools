import type { Tool } from '../data/tools.ts';
import type { EnrichmentEntry, EnrichmentSource } from './enrichmentData.ts';

/** Phrases that look like “AI” mislabels for generic product capabilities. */
const NON_AI_FEATURE_PATTERNS = [
  /\bjsr223\b/i,
  /\bgroovy\b/i,
  /\bscripting language/i,
  /\bbackend listener\b/i,
  /\btest script recorder\b/i,
  /\bhttp\(s\)\b/i,
  /\bparameteriz/i,
  /\bthread group\b/i,
  /\binfluxdb\b/i,
  /\bgraphite\b/i,
  /\bci\/?cd\b/i,
  /\bdashboard\b/i,
  /\bplugin\b/i,
];

const AI_SIGNAL_PATTERNS = [
  /\bai\b/i,
  /\bml\b/i,
  /\bmachine learning\b/i,
  /\bllm\b/i,
  /\bgenerative\b/i,
  /\bgpt\b/i,
  /\bneural\b/i,
  /\bai[- ]?(?:assisted|powered|driven|based)\b/i,
];

export function isGenuineAiFeature(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (NON_AI_FEATURE_PATTERNS.some((pattern) => pattern.test(value))) {
    return false;
  }
  return AI_SIGNAL_PATTERNS.some((pattern) => pattern.test(value));
}

export function filterAiFeatures(features: string[]): string[] {
  return [
    ...new Set(
      features
        .map((item) => item.trim())
        .filter((item) => isGenuineAiFeature(item)),
    ),
  ].slice(0, 8);
}

const sourceKey = (source: EnrichmentSource) =>
  `${source.url}\u0000${source.title}`;

const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

/** Higher score = more trustworthy primary source. */
export function sourceTrustScore(
  source: EnrichmentSource,
  tool?: Pick<Tool, 'url' | 'repoUrl'>,
): number {
  const host = hostOf(source.url);
  if (!host) return 0;

  let score = 1;
  // Official product URL always wins over repo mirrors.
  if (tool?.url && hostOf(tool.url) && host === hostOf(tool.url)) score += 200;
  else if (
    tool?.repoUrl &&
    hostOf(tool.repoUrl) &&
    host === hostOf(tool.repoUrl)
  )
    score += 120;
  else if (host === 'github.com' || host.endsWith('.github.io')) score += 40;
  if (
    host.includes('apache.org') ||
    host.includes('grafana.com') ||
    host.includes('microsoft.com') ||
    host.includes('amazon.com') ||
    host.includes('aws.amazon.com')
  ) {
    score += 30;
  }
  if (
    host.includes('softpedia') ||
    host.includes('alternativeto') ||
    host.includes('sourceforge.net') ||
    host.includes('linuxlinks') ||
    host.includes('slant.co')
  ) {
    score -= 50;
  }
  return score;
}

export function rankSources(
  sources: EnrichmentSource[],
  tool?: Pick<Tool, 'url' | 'repoUrl'>,
  limit = 6,
): EnrichmentSource[] {
  const unique = [
    ...new Map(sources.map((source) => [sourceKey(source), source])).values(),
  ];
  const sorted = unique.sort(
    (a, b) =>
      sourceTrustScore(b, tool) - sourceTrustScore(a, tool) ||
      a.url.localeCompare(b.url),
  );
  const trusted = sorted.filter((source) => sourceTrustScore(source, tool) > 0);
  // Prefer trusted sources; fall back to raw list only if nothing scores positive.
  return (trusted.length ? trusted : sorted).slice(0, limit);
}

/** Display-time sanitization so committed JSON still gets quality gates. */
export function sanitizeEnrichmentForDisplay(
  entry: EnrichmentEntry | undefined,
  tool?: Pick<Tool, 'url' | 'repoUrl' | 'status'>,
): EnrichmentEntry | undefined {
  if (!entry) return undefined;
  const aiFeatures = filterAiFeatures(entry.aiFeatures ?? []);
  const sources = entry.sources
    ? rankSources(entry.sources, tool, 6)
    : undefined;
  let features = entry.features;
  if (tool?.status === 'Discontinued' && features?.length) {
    features = features.slice(0, 3);
  }
  const next: EnrichmentEntry = {
    ...entry,
    features: features?.length ? features : undefined,
    aiFeatures: aiFeatures.length ? aiFeatures : undefined,
    sources: sources?.length ? sources : undefined,
  };
  return Object.fromEntries(
    Object.entries(next).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined,
    ),
  ) as EnrichmentEntry;
}
