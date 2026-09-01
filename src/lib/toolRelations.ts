import type { Tool } from '../data/tools';
import { staticVsPath } from '../data/comparisons';
import { PROTOCOL_LANDINGS, LANGUAGE_LANDINGS } from '../data/landings';
import { siteUrl } from './urls';

export interface RelatedToolLink {
  slug: string;
  name: string;
  vendor: string;
  href: string;
}

export interface SimilarToolLink extends RelatedToolLink {
  reasons: string[];
}

export interface ComparePairLink {
  label: string;
  href: string;
  slugs: string[];
  staticPage: boolean;
}

export interface FilterChip {
  label: string;
  href: string;
  kind: 'language' | 'protocol';
}

export function sameCategoryTools(
  tool: Tool,
  catalog: readonly Tool[],
  limit = 4,
): RelatedToolLink[] {
  return catalog
    .filter(
      (item) => item.slug !== tool.slug && item.category === tool.category,
    )
    .sort((a, b) => {
      const score = (item: Tool) =>
        (item.generalPick ? 2 : 0) +
        (item.personalPick ? 1 : 0) +
        (item.status === 'Active' ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      vendor: item.vendor,
      href: siteUrl(`tools/${item.slug}`),
    }));
}

export function similarTools(
  tool: Tool,
  catalog: readonly Tool[],
  limit = 4,
): SimilarToolLink[] {
  return catalog
    .filter((candidate) => candidate.slug !== tool.slug)
    .map((candidate) => {
      const sharedProtocols = candidate.protocols.filter((protocol) =>
        tool.protocols.includes(protocol),
      );
      const sharedLanguages = candidate.scriptingLanguages.filter((language) =>
        tool.scriptingLanguages.includes(language),
      );
      const sameCategory = candidate.category === tool.category;
      const sameDeployment = candidate.deployment === tool.deployment;
      const sameLicense = candidate.license === tool.license;
      const score =
        (sameCategory ? 4 : 0) +
        Math.min(sharedProtocols.length, 3) +
        Math.min(sharedLanguages.length * 2, 4) +
        (sameDeployment ? 1 : 0) +
        (sameLicense ? 1 : 0);
      if (score === 0) return undefined;

      const reasons: string[] = [];
      if (sameCategory) reasons.push('same category');
      if (sharedProtocols.length > 0) {
        reasons.push(
          `${Math.min(sharedProtocols.length, 3)} shared protocol${
            Math.min(sharedProtocols.length, 3) === 1 ? '' : 's'
          }`,
        );
      }
      if (sharedLanguages.length > 0) {
        reasons.push(
          `${Math.min(sharedLanguages.length, 2)} shared language${
            Math.min(sharedLanguages.length, 2) === 1 ? '' : 's'
          }`,
        );
      }
      if (sameDeployment) reasons.push('same deployment');
      if (sameLicense) reasons.push('same license');

      return {
        slug: candidate.slug,
        name: candidate.name,
        vendor: candidate.vendor,
        href: siteUrl(`tools/${candidate.slug}`),
        reasons,
        score,
        active: candidate.status === 'Active',
      };
    })
    .filter((candidate): candidate is NonNullable<typeof candidate> =>
      Boolean(candidate),
    )
    .sort(
      (left, right) =>
        right.score - left.score ||
        Number(right.active) - Number(left.active) ||
        left.name.localeCompare(right.name),
    )
    .slice(0, limit)
    .map((candidate) => ({
      slug: candidate.slug,
      name: candidate.name,
      vendor: candidate.vendor,
      href: candidate.href,
      reasons: candidate.reasons,
    }));
}

export function compareWithLinks(
  tool: Tool,
  catalog: readonly Tool[],
  limit = 3,
): ComparePairLink[] {
  const peers = catalog
    .filter(
      (item) =>
        item.slug !== tool.slug &&
        item.status !== 'Discontinued' &&
        (item.category === tool.category ||
          item.generalPick ||
          item.personalPick),
    )
    .sort((a, b) => {
      const score = (item: Tool) =>
        (item.category === tool.category ? 3 : 0) +
        (item.generalPick ? 2 : 0) +
        (item.personalPick ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    })
    .slice(0, limit);

  return peers.map((peer) => {
    const slugs = [tool.slug, peer.slug].sort();
    const vs = staticVsPath(tool.slug, peer.slug);
    return {
      label: `${tool.name} vs ${peer.name}`,
      href: vs ? siteUrl(vs) : siteUrl(`compare?tools=${slugs.join(',')}`),
      slugs,
      staticPage: Boolean(vs),
    };
  });
}

export function languageChips(tool: Tool, limit = 4): FilterChip[] {
  return tool.scriptingLanguages.slice(0, limit).map((language) => {
    const landing = LANGUAGE_LANDINGS.find(
      (item) => item.slug === language.toLowerCase(),
    );
    return {
      label: language,
      kind: 'language' as const,
      href: landing
        ? siteUrl(`languages/${landing.slug}`)
        : siteUrl(`?language=${encodeURIComponent(language)}`),
    };
  });
}

export function protocolChips(tool: Tool, limit = 6): FilterChip[] {
  return tool.protocols.slice(0, limit).map((protocol) => {
    const key =
      protocol.toLowerCase() === 'https' ? 'http' : protocol.toLowerCase();
    const landing = PROTOCOL_LANDINGS.find((item) => item.slug === key);
    return {
      label: protocol,
      kind: 'protocol' as const,
      href: landing
        ? siteUrl(`protocols/${landing.slug}`)
        : siteUrl(`?protocol=${encodeURIComponent(protocol)}`),
    };
  });
}
