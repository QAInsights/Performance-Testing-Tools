import { datasetLastVerified, tools, type Tool } from '../data/tools';
import { siteOrigin } from '../config/site';
import { seoYear } from './pageMeta';
import * as llms from '../../scripts/llms-content.mjs';

type LlmsBuilders = {
  CANONICAL_COMPARE_PAIRS: Array<[string, string]>;
  buildLlmsTxt: (
    catalog: readonly Tool[],
    origin: string,
    options?: { datasetLastVerified?: string; seoYear?: number },
  ) => string;
  buildLlmsFullTxt: (
    catalog: readonly Tool[],
    origin: string,
    options?: { datasetLastVerified?: string },
  ) => string;
  buildWebManifest: (basePath?: string) => string;
};

const builders = llms as unknown as LlmsBuilders;

export const CANONICAL_COMPARE_PAIRS = builders.CANONICAL_COMPARE_PAIRS;

export function buildLlmsTxt(
  catalog: readonly Tool[] = tools,
  origin = siteOrigin,
): string {
  return builders.buildLlmsTxt(catalog, origin, {
    datasetLastVerified,
    seoYear,
  });
}

export function buildLlmsFullTxt(
  catalog: readonly Tool[] = tools,
  origin = siteOrigin,
): string {
  return builders.buildLlmsFullTxt(catalog, origin, { datasetLastVerified });
}

export function buildWebManifest(basePath = '/'): string {
  return builders.buildWebManifest(basePath);
}
