export const CANONICAL_COMPARE_PAIRS: Array<[string, string]>;

export function buildLlmsTxt(
  catalog: readonly unknown[],
  origin: string,
  options?: { datasetLastVerified?: string; seoYear?: number },
): string;

export function buildLlmsFullTxt(
  catalog: readonly unknown[],
  origin: string,
  options?: { datasetLastVerified?: string },
): string;

export function buildWebManifest(basePath?: string): string;
