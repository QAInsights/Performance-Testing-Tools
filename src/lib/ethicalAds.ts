export const ETHICAL_ADS_CLIENT_SRC =
  'https://media.ethicalads.io/media/client/ethicalads.min.js';
export const DEFAULT_ETHICAL_ADS_PUBLISHER = 'qainsightscom';
export const ETHICAL_ADS_CAMPAIGN_TYPES = 'paid|publisher-house';
export const MAX_AD_KEYWORDS = 8;
export const SITE_AD_KEYWORDS = [
  'performance-testing',
  'load-testing',
  'performance-engineering',
] as const;

export interface FloatingAdPlacement {
  id: string;
  type: 'image' | 'text';
  style: 'stickybox' | 'fixedfooter';
}

/** Viewports matching this query get the corner image ad; narrower ones get the text footer. */
export const FLOATING_AD_WIDE_QUERY = '(min-width: 1301px)';
export const FLOATING_AD_PLACEMENTS: {
  wide: FloatingAdPlacement;
  narrow: FloatingAdPlacement;
} = {
  wide: { id: 'float-stickybox', type: 'image', style: 'stickybox' },
  narrow: { id: 'float-footer', type: 'text', style: 'fixedfooter' },
};

const PUBLISHER_ID = /^[a-z0-9][a-z0-9_-]*$/i;

export function ethicalAdsPublisher(
  value: string | undefined | null,
): string | null {
  const id = value?.trim() ?? '';
  return PUBLISHER_ID.test(id) ? id : null;
}

/** Unset uses the default publisher; "off" or an empty/invalid value disables ads. */
export function resolveEthicalAdsPublisher(
  override: string | undefined,
): string | null {
  if (override === undefined) return DEFAULT_ETHICAL_ADS_PUBLISHER;
  if (override.trim().toLowerCase() === 'off') return null;
  return ethicalAdsPublisher(override);
}

/** Slugifies, dedupes and caps keywords, joined with "|" for data-ea-keywords. */
export function adKeywords(
  values: ReadonlyArray<string | undefined | null>,
): string {
  const keywords = new Set<string>();
  for (const value of values) {
    const keyword = (value ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (keyword) keywords.add(keyword);
    if (keywords.size === MAX_AD_KEYWORDS) break;
  }
  return [...keywords].join('|');
}
