import {
  datasetLastVerified,
  tools,
  type Category,
  type Deployment,
  type License,
  type Tool,
} from '../data/tools';

/** Calendar year used in SEO titles (refresh when the strategy year rolls). */
export const seoYear = 2026;

export const siteName = 'Performance Testing Tools';

const LICENSE_WORD: Record<License, string> = {
  'Open Source': 'Open source',
  Commercial: 'Commercial',
  Freemium: 'Freemium',
};

const DEPLOYMENT_PHRASE: Record<Deployment, string> = {
  'Self-hosted': 'self-hosted',
  Cloud: 'cloud-hosted',
  Hybrid: 'self-hosted or cloud',
};

const META_DESCRIPTION_LIMIT = 158;

export function clampMetaDescription(text: string): string {
  if (text.length <= META_DESCRIPTION_LIMIT) return text;
  const cut = text.slice(0, META_DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`;
}

export function toolCount(catalog: readonly Tool[] = tools): number {
  return catalog.length;
}

export function homeTitle(catalog: readonly Tool[] = tools): string {
  return `${toolCount(catalog)} Performance Testing Tools Compared (${seoYear}) · Directory`;
}

export function homeDescription(catalog: readonly Tool[] = tools): string {
  return `Compare ${toolCount(catalog)} load, protocol, cloud, and enterprise performance testing tools. Curated specs, licenses, lifecycle status, and pick signals. Last verified ${datasetLastVerified}.`;
}

export function toolTitle(tool: Tool): string {
  if (tool.status === 'Discontinued') {
    return `${tool.name}: discontinued, and what to use instead (${seoYear})`;
  }
  return `${tool.name}: pricing, license & alternatives (${seoYear})`;
}

export function toolDescription(tool: Tool): string {
  const head = tool.description.trim().replace(/\.$/, '');
  if (head.length + 1 > META_DESCRIPTION_LIMIT) {
    return clampMetaDescription(head);
  }

  const successor =
    tool.successor && !/^no verified/i.test(tool.successor)
      ? tool.successor
      : undefined;
  const clauses = [
    tool.status === 'Discontinued'
      ? successor
        ? ` Discontinued; successor: ${successor}.`
        : ' Discontinued.'
      : '',
    ` ${LICENSE_WORD[tool.license]}, ${DEPLOYMENT_PHRASE[tool.deployment]}.`,
    ` Pricing, protocols and alternatives, verified ${datasetLastVerified}.`,
  ].filter(Boolean);

  return clauses.reduce(
    (out, clause) =>
      out.length + clause.length <= META_DESCRIPTION_LIMIT ? out + clause : out,
    `${head}.`,
  );
}

export function categoryTitle(category: Category): string {
  return `Best ${category} Tools (${seoYear}) · Curated Directory`;
}

export function categoryDescription(
  category: Category,
  catalog: readonly Tool[] = tools,
): string {
  const count = catalog.filter((tool) => tool.category === category).length;
  return `Browse ${count} curated ${category.toLowerCase()} tools with licenses, protocols, deployment models, and lifecycle status. Updated ${datasetLastVerified}.`;
}

export function categoryIntro(category: Category): string {
  return `A focused signal view of ${category.toLowerCase()} tools. Compare licenses, deployment models, protocols, and status before you shortlist.`;
}

export function compareTitle(toolNames: string[] = []): string {
  if (toolNames.length >= 2) {
    return `${toolNames.join(' vs ')} Spec Comparison · ${siteName}`;
  }
  return `Test Rig · Spec Comparison · ${siteName}`;
}

export function compareDescription(toolNames: string[] = []): string {
  if (toolNames.length >= 2) {
    return `Side-by-side comparison of ${toolNames.join(', ')}: license, deployment, protocols, scripting languages, status, and pricing model.`;
  }
  return `Compare up to three performance testing tools side by side. Select tools from the directory to populate the Test Rig.`;
}

export function aboutTitle(): string {
  return `About · ${siteName}`;
}

export function aboutDescription(catalog: readonly Tool[] = tools): string {
  return `How the ${siteName} directory is curated: ${toolCount(catalog)} tools, personal and general picks, lifecycle truth, and evidence-backed enrichment from QAInsights.`;
}
