import { datasetLastVerified, tools, type Category, type Tool } from '../data/tools';

/** Calendar year used in SEO titles (refresh when the strategy year rolls). */
export const seoYear = 2026;

export const siteName = 'Performance Testing Tools';

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
  return `${tool.name} Review, Pricing, License & Specs · ${siteName}`;
}

export function toolDescription(tool: Tool): string {
  const parts = [
    tool.description.replace(/\.$/, ''),
    `License: ${tool.license}`,
    `deployment: ${tool.deployment.toLowerCase()}`,
    `status: ${tool.status.toLowerCase()}`,
  ];
  if (tool.scriptingLanguages.length) {
    parts.push(`scripting: ${tool.scriptingLanguages.join(', ')}`);
  }
  return `${parts.join('. ')}.`;
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
