import { allLandings, type LandingPage } from '../data/landings';
import type { Tool } from '../data/tools';

export function filterToolsForLanding(
  landing: LandingPage,
  catalog: readonly Tool[],
): Tool[] {
  const { match } = landing;
  return catalog
    .filter((tool) => {
      if (match.protocol) {
        const ok = tool.protocols.some(
          (item) => item.toLowerCase() === match.protocol!.toLowerCase(),
        );
        // HTTP landing also includes HTTPS
        const httpFamily =
          match.protocol.toLowerCase() === 'http' &&
          tool.protocols.some((item) =>
            ['http', 'https'].includes(item.toLowerCase()),
          );
        if (!ok && !httpFamily) return false;
      }
      if (match.language) {
        const ok = tool.scriptingLanguages.some(
          (item) => item.toLowerCase() === match.language!.toLowerCase(),
        );
        if (!ok) return false;
      }
      if (match.deployment && tool.deployment !== match.deployment)
        return false;
      if (match.openSource && tool.license !== 'Open Source') return false;
      if (match.discontinued && tool.status !== 'Discontinued') return false;
      if (match.openSource && tool.status === 'Discontinued') return false;
      return true;
    })
    .sort((a, b) => {
      const score = (tool: Tool) =>
        (tool.generalPick ? 2 : 0) +
        (tool.personalPick ? 1 : 0) +
        (tool.status === 'Active' ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    });
}

export function landingsByKind(kind: LandingPage['kind']): LandingPage[] {
  return allLandings().filter((item) => item.kind === kind);
}

export function landingPath(landing: LandingPage): string {
  if (landing.kind === 'protocol') return `protocols/${landing.slug}`;
  if (landing.kind === 'language') return `languages/${landing.slug}`;
  if (landing.kind === 'deployment') return `deployment/${landing.slug}`;
  return `guides/${landing.slug}`;
}
