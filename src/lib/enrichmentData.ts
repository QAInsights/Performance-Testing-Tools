import enrichmentData from '../data/enrichment.json';
import type { Tool } from '../data/tools';
import { sanitizeEnrichmentForDisplay } from './enrichmentQuality';

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

export const getRawEnrichment = (slug: string): EnrichmentEntry | undefined =>
  dataset.entries[slug];

/** Prefer this for UI. Applies AI/source quality gates without mutating JSON. */
export const getEnrichment = (
  slug: string,
  tool?: Pick<Tool, 'url' | 'repoUrl' | 'status'>,
): EnrichmentEntry | undefined =>
  sanitizeEnrichmentForDisplay(dataset.entries[slug], tool);
