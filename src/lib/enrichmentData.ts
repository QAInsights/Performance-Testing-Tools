import enrichmentData from '../data/enrichment.json';

export interface EnrichmentSource {
  url: string;
  title: string;
}

export interface LatestRelease {
  version?: string;
  date?: string;
  notes?: string;
}

export interface EnrichmentEntry {
  about?: string;
  features?: string[];
  pricing?: string;
  authorOrCompany?: string;
  aiFeatures?: string[];
  latestRelease?: LatestRelease;
  sources?: EnrichmentSource[];
  fetchedAt: string;
}

export interface EnrichmentDataset {
  generatedAt: string;
  entries: Record<string, EnrichmentEntry>;
}

const dataset = enrichmentData as EnrichmentDataset;

export const getEnrichment = (slug: string): EnrichmentEntry | undefined =>
  dataset.entries[slug];
