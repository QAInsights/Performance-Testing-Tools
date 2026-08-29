import {
  ALTERNATIVES_HUBS,
  TIER_A_COMPARISONS,
  comparisonForTools,
  staticVsPath,
  type AlternativesHub,
  type ComparisonSpec,
} from '../data/comparisons';
import type { Tool } from '../data/tools';
import {
  derivedAlternativesHubs,
  derivedComparisons,
} from './derivedComparisons';

export interface SpecRow {
  field: string;
  left: string;
  right: string;
  different: boolean;
}

const fmtList = (values: string[]) =>
  values.length ? values.join(', ') : 'Not recorded';

export function buildSpecRows(left: Tool, right: Tool): SpecRow[] {
  const pairs: Array<[string, string, string]> = [
    ['Vendor', left.vendor, right.vendor],
    ['Category', left.category, right.category],
    ['License', left.license, right.license],
    ['Deployment', left.deployment, right.deployment],
    ['Status', left.status, right.status],
    [
      'First released',
      left.firstReleased ? String(left.firstReleased) : 'Not recorded',
      right.firstReleased ? String(right.firstReleased) : 'Not recorded',
    ],
    ['Pricing', left.pricingModel, right.pricingModel],
    [
      'Scripting',
      fmtList(left.scriptingLanguages),
      fmtList(right.scriptingLanguages),
    ],
    ['Protocols', fmtList(left.protocols), fmtList(right.protocols)],
    ['OS support', fmtList(left.osSupport), fmtList(right.osSupport)],
  ];
  return pairs.map(([field, l, r]) => ({
    field,
    left: l,
    right: r,
    different: l !== r,
  }));
}

export function resolveComparison(
  spec: ComparisonSpec,
  catalog: readonly Tool[],
): { left: Tool; right: Tool; rows: SpecRow[] } | null {
  const left = catalog.find((tool) => tool.slug === spec.leftSlug);
  const right = catalog.find((tool) => tool.slug === spec.rightSlug);
  if (!left || !right) return null;
  return { left, right, rows: buildSpecRows(left, right) };
}

export function allComparisonSpecs(catalog: readonly Tool[]): ComparisonSpec[] {
  const specs = [...TIER_A_COMPARISONS, ...derivedComparisons(catalog)];
  const seen = new Set<string>();
  for (const spec of specs) {
    if (seen.has(spec.pairPath)) {
      throw new Error(`Duplicate comparison path: ${spec.pairPath}`);
    }
    seen.add(spec.pairPath);
  }
  return specs;
}

export function allAlternativesHubs(
  catalog: readonly Tool[],
): AlternativesHub[] {
  const hubs = [
    ...ALTERNATIVES_HUBS,
    ...derivedAlternativesHubs(catalog, ALTERNATIVES_HUBS),
  ];
  const seen = new Set<string>();
  for (const hub of hubs) {
    if (seen.has(hub.toolSlug)) {
      throw new Error(`Duplicate alternatives hub: ${hub.toolSlug}`);
    }
    seen.add(hub.toolSlug);
  }
  return hubs;
}

export function comparisonsForTool(
  toolSlug: string,
  catalog: readonly Tool[],
): ComparisonSpec[] {
  return allComparisonSpecs(catalog).filter(
    (spec) => spec.leftSlug === toolSlug || spec.rightSlug === toolSlug,
  );
}

export function alternativesHubForTool(
  toolSlug: string,
  catalog: readonly Tool[],
): AlternativesHub | undefined {
  return allAlternativesHubs(catalog).find((hub) => hub.toolSlug === toolSlug);
}

export function alternativesForHub(
  hub: AlternativesHub,
  catalog: readonly Tool[],
  limit = 12,
): Tool[] {
  const base = catalog.find((tool) => tool.slug === hub.toolSlug);
  if (!base) return [];
  return catalog
    .filter(
      (tool) =>
        tool.slug !== base.slug &&
        tool.status === 'Active' &&
        (tool.category === base.category ||
          tool.generalPick ||
          tool.personalPick ||
          tool.license === 'Open Source'),
    )
    .sort((a, b) => {
      const score = (tool: Tool) =>
        (tool.category === base.category ? 4 : 0) +
        (tool.generalPick ? 2 : 0) +
        (tool.personalPick ? 1 : 0) +
        (tool.license === base.license ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function allComparisonPaths(): string[] {
  return TIER_A_COMPARISONS.map((item) => item.pairPath);
}

export function allAlternativeSlugs(): string[] {
  return ALTERNATIVES_HUBS.map((item) => item.toolSlug);
}

/** Prefer static vs URL when Tier-A pair exists. */
export function preferredCompareHref(
  leftSlug: string,
  rightSlug: string,
  fallbackQuery = true,
): string {
  const staticPath = staticVsPath(leftSlug, rightSlug);
  if (staticPath) return staticPath;
  if (!fallbackQuery) return '';
  const slugs = [leftSlug, rightSlug].sort().join(',');
  return `compare?tools=${slugs}`;
}

export { comparisonForTools, TIER_A_COMPARISONS, ALTERNATIVES_HUBS };
