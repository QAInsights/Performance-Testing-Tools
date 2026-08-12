import type { Tool } from '../data/tools';
import type {
  EnrichmentDataset,
  EnrichmentEntry,
  EnrichmentSource,
} from './enrichmentData.ts';
import { filterAiFeatures, rankSources } from './enrichmentQuality.ts';

export {
  filterAiFeatures,
  isGenuineAiFeature,
  rankSources,
  sanitizeEnrichmentForDisplay,
  sourceTrustScore,
} from './enrichmentQuality.ts';

export interface ExaResponse {
  output?: {
    content?: Record<string, unknown>;
    grounding?: Array<{
      field?: string;
      citations?: Array<{ url?: string; title?: string }>;
    }>;
  };
  results?: Array<{ url?: string; title?: string }>;
  costDollars?: { total?: number };
}

export const enrichmentSchema = {
  type: 'object',
  properties: {
    about: { type: 'string' },
    features: { type: 'array', items: { type: 'string' } },
    pricing: { type: 'string' },
    authorOrCompany: { type: 'string' },
    aiFeatures: { type: 'array', items: { type: 'string' } },
    latestReleaseVersion: { type: 'string' },
    latestReleaseDate: { type: 'string' },
    latestReleaseNotes: { type: 'string' },
  },
  required: [
    'about',
    'features',
    'pricing',
    'authorOrCompany',
    'aiFeatures',
    'latestReleaseVersion',
    'latestReleaseDate',
    'latestReleaseNotes',
  ],
} as const;

export const enrichmentSystemPrompt =
  'Rely only on the retrieved sources. Prefer the tool’s official site, official repository, and official release notes over third-party mirrors, Softpedia, alternativeTo, or SEO clones. ' +
  'Return an empty string or empty array when a fact is not confidently found; never guess or invent versions, prices, or AI capabilities. ' +
  'aiFeatures must list only genuine AI/ML capabilities (LLM assistants, generative test design, AI anomaly detection). ' +
  'Do NOT put ordinary scripting (JSR223, Groovy, JavaScript), recorders, listeners, CI plugins, or dashboards in aiFeatures. Use features instead. ' +
  'If the product has no documented AI features, return an empty aiFeatures array.';

const asTrimmedString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const asStringArray = (value: unknown, limit = 8): string[] =>
  Array.isArray(value)
    ? [...new Set(value.map(asTrimmedString).filter(Boolean).slice(0, limit))]
    : [];

export const buildExaRequestBody = (tool: Tool) => ({
  query: [
    tool.name,
    `vendor: ${tool.vendor}`,
    `official URL: ${tool.url}`,
    tool.repoUrl ? `repository: ${tool.repoUrl}` : '',
  ]
    .filter(Boolean)
    .join('. '),
  type: 'deep',
  numResults: 8,
  systemPrompt: enrichmentSystemPrompt,
  outputSchema: enrichmentSchema,
  contents: { highlights: true },
});

const responseSources = (
  response: ExaResponse,
  tool?: Pick<Tool, 'url' | 'repoUrl'>,
): EnrichmentSource[] => {
  const grounded =
    response.output?.grounding?.flatMap((field) => field.citations ?? []) ?? [];
  const citations = grounded.length
    ? grounded
    : (response.results ?? []).map((result) => result);
  const sources = citations
    .map((citation) => ({
      url: asTrimmedString(citation.url),
      title: asTrimmedString(citation.title) || asTrimmedString(citation.url),
    }))
    .filter((source): source is EnrichmentSource =>
      /^https?:\/\//i.test(source.url),
    );
  return rankSources(sources, tool, 6);
};

export const normalizeExaResponse = (
  response: ExaResponse,
  fetchedAt = new Date().toISOString(),
  tool?: Pick<Tool, 'url' | 'repoUrl' | 'status'>,
): EnrichmentEntry => {
  const content = response.output?.content ?? {};
  const latestRelease = {
    version: asTrimmedString(content.latestReleaseVersion),
    date: asTrimmedString(content.latestReleaseDate),
    notes: asTrimmedString(content.latestReleaseNotes),
  };
  const hasRelease = Object.values(latestRelease).some(Boolean);
  const rawFeatures = asStringArray(content.features);
  const features =
    tool?.status === 'Discontinued' ? rawFeatures.slice(0, 3) : rawFeatures;

  const entry: EnrichmentEntry = {
    about: asTrimmedString(content.about) || undefined,
    features,
    pricing: asTrimmedString(content.pricing) || undefined,
    authorOrCompany: asTrimmedString(content.authorOrCompany) || undefined,
    aiFeatures: filterAiFeatures(asStringArray(content.aiFeatures, 12)),
    latestRelease: hasRelease ? latestRelease : undefined,
    sources: responseSources(response, tool),
    fetchedAt,
  };
  return Object.fromEntries(
    Object.entries(entry).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined,
    ),
  ) as EnrichmentEntry;
};

export const mergeEnrichment = (
  existing: EnrichmentDataset,
  slug: string,
  entry: EnrichmentEntry,
  generatedAt = new Date().toISOString(),
): EnrichmentDataset => ({
  generatedAt,
  entries: Object.fromEntries(
    Object.entries({ ...existing.entries, [slug]: entry }).sort(([a], [b]) =>
      a.localeCompare(b),
    ),
  ),
});

export const isStale = (
  entry: EnrichmentEntry | undefined,
  days: number,
  now = new Date(),
): boolean => {
  if (!entry?.fetchedAt) return true;
  const fetchedAt = Date.parse(entry.fetchedAt);
  if (Number.isNaN(fetchedAt)) return true;
  return now.getTime() - fetchedAt >= days * 24 * 60 * 60 * 1000;
};
