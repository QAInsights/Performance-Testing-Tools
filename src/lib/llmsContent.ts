import { datasetLastVerified, tools, type Tool } from '../data/tools';
import { siteOrigin } from '../config/site';
import { seoYear } from './pageMeta';
import {
  buildLlmsFullTxt as buildGeneratedFullTxt,
  buildLlmsTxt as buildGeneratedTxt,
} from './llmsGenerated';
import { buildWebManifest } from '../../scripts/llms-content.mjs';

export function buildLlmsTxt(
  catalog: readonly Tool[] = tools,
  origin = siteOrigin,
): string {
  return buildGeneratedTxt(catalog, origin, {
    datasetLastVerified,
    seoYear,
  });
}

export function buildLlmsFullTxt(
  catalog: readonly Tool[] = tools,
  origin = siteOrigin,
): string {
  return buildGeneratedFullTxt(catalog, origin, { datasetLastVerified });
}

export { buildWebManifest };
