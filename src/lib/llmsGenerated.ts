import { datasetLastVerified, tools, type Tool } from '../data/tools';
import { siteOrigin } from '../config/site';
import {
  allAlternativesHubs,
  allComparisonSpecs,
  alternativesHubForTool,
  comparisonsForTool,
  resolveComparison,
} from './comparisonContent';
import { seoYear } from './pageMeta';
import { answerBoxSplit, methodologyMarkdown } from './markdownMirror';
import { absoluteUrl } from './urls';
import { notBestFor, bestFor } from './toolEntity';
import { curatorPerson, curator } from './methodology';

const join = (values: readonly string[], fallback = 'n/a') =>
  values.length ? values.join(', ') : fallback;

const categoryPath = (category: string) =>
  `categories/${category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;

const toolUrl = (slug: string, origin: string) =>
  absoluteUrl(`tools/${slug}`, origin);

const markdownUrl = (slug: string, origin: string) =>
  absoluteUrl(`tools/${slug}.md`, origin);

const pickReason = (tool: Tool) => {
  if (tool.personalPick && tool.generalPick) {
    return 'personal and general pick for broad real-world fit';
  }
  if (tool.personalPick) return 'personal pick for practical workflows';
  if (tool.generalPick) return 'general pick for teams evaluating defaults';
  return tool.description;
};

const whenNot = (tool: Tool) => {
  if (tool.status === 'Discontinued') {
    return tool.successor
      ? `Do not start new projects on it; prefer ${tool.successor}.`
      : 'Do not start new projects on it; choose an active alternative.';
  }
  if (tool.category === 'Micro-benchmark CLI') {
    return 'Not ideal as a full enterprise suite replacement or multi-protocol business-flow platform.';
  }
  if (tool.deployment === 'Cloud') {
    return 'Less ideal when you must keep all load generation fully on-premises with no vendor path.';
  }
  if (tool.license === 'Commercial') {
    return 'Less ideal when you require a fully open-source stack with zero commercial licensing.';
  }
  return 'Less ideal when required protocols or team languages are outside its listed strengths.';
};

const whoFor = (tool: Tool) => {
  if (tool.category === 'Micro-benchmark CLI') {
    return 'Developers running quick HTTP/protocol benchmarks';
  }
  if (tool.category === 'Cloud Load Testing') {
    return 'Teams wanting managed cloud load generation';
  }
  if (tool.category === 'Enterprise Suite') {
    return 'Enterprise performance engineering organizations';
  }
  return 'Engineers choosing load and performance testing tooling';
};

const matrixLines = (
  title: string,
  predicate: (tool: Tool) => boolean,
  catalog: readonly Tool[],
  origin: string,
) =>
  [
    `### ${title}`,
    ...catalog
      .filter(predicate)
      .filter((tool) => tool.status === 'Active')
      .slice(0, 12)
      .map(
        (tool) =>
          `- [${tool.name}](${toolUrl(tool.slug, origin)}) ${tool.license}; ${tool.deployment}`,
      ),
    '',
  ].join('\n');

const comparisonBlock = (
  spec: ReturnType<typeof allComparisonSpecs>[number],
  origin: string,
) =>
  [
    `### ${spec.leftLabel} vs ${spec.rightLabel}`,
    spec.answerBox,
    `Verdict: ${spec.verdict}`,
    'Decisions:',
    ...spec.decisions.map((decision) => `- ${decision}`),
    `Page: ${absoluteUrl(`vs/${spec.pairPath}`, origin)}`,
    '',
  ].join('\n');

export function buildLlmsTxt(
  catalog: readonly Tool[] = tools,
  origin = siteOrigin,
  options: { datasetLastVerified?: string; seoYear?: number } = {},
): string {
  const verified = options.datasetLastVerified ?? datasetLastVerified;
  const year = options.seoYear ?? seoYear;
  const categories = [...new Set(catalog.map((tool) => tool.category))];
  const topPicks = catalog.filter(
    (tool) => tool.personalPick || tool.generalPick,
  );
  const comparisons = allComparisonSpecs(catalog)
    .map((spec) => {
      const resolved = resolveComparison(spec, catalog);
      if (!resolved) return '';
      const summary =
        spec.tier === 'B'
          ? answerBoxSplit(spec.answerBox) || spec.answerBox
          : spec.answerBox;
      return `- [${spec.leftLabel} vs ${spec.rightLabel}](${absoluteUrl(`vs/${spec.pairPath}`, origin)}) ${summary}`;
    })
    .filter(Boolean)
    .join('\n');
  const hubs = allAlternativesHubs(catalog)
    .map(
      (hub) =>
        `- [${hub.headline}](${absoluteUrl(`alternatives/${hub.toolSlug}`, origin)}) ${hub.intro}`,
    )
    .join('\n');

  const pickMatrices = [
    '## Pick matrices',
    '',
    matrixLines(
      'Open source (active)',
      (tool) => tool.license === 'Open Source',
      catalog,
      origin,
    ),
    matrixLines(
      'Commercial / freemium (active)',
      (tool) => tool.license !== 'Open Source',
      catalog,
      origin,
    ),
    matrixLines(
      'CLI micro-benchmarks',
      (tool) => tool.category === 'Micro-benchmark CLI',
      catalog,
      origin,
    ),
    matrixLines(
      'GUI-friendly or enterprise suites',
      (tool) =>
        tool.category === 'Enterprise Suite' || tool.tags.includes('gui'),
      catalog,
      origin,
    ),
    matrixLines(
      'Cloud load testing',
      (tool) =>
        tool.deployment === 'Cloud' || tool.category === 'Cloud Load Testing',
      catalog,
      origin,
    ),
    matrixLines(
      'Self-hosted engines',
      (tool) => tool.deployment === 'Self-hosted',
      catalog,
      origin,
    ),
  ].join('\n');

  const catalogLines = catalog
    .map(
      (tool) =>
        `- [${tool.name}](${toolUrl(tool.slug, origin)}) ${tool.description} License: ${tool.license}; deployment: ${tool.deployment}; status: ${tool.status}.`,
    )
    .join('\n');
  return [
    '# Performance Testing Tools',
    '',
    `A decision-ready, curated directory of ${catalog.length} performance testing tools (${year}) from ${curator}, curated by ${curatorPerson.name}.`,
    `Canonical site: ${origin}`,
    '',
    '## How to choose a load testing tool',
    '',
    '1. Start from **protocol coverage** (HTTP, gRPC, browser, legacy), not brand familiarity.',
    '2. Match **authoring model** to the team: GUI/recorder, code-first (JS/Python/Java/Scala), or pure CLI.',
    '3. Decide **cloud vs self-hosted** for load generation, data residency, and cost predictability.',
    '4. Check **lifecycle status**. Discontinued tools stay listed here with successors when known.',
    '5. Shortlist 2-3 options and compare specs in the Test Rig before a proof-of-concept.',
    '',
    pickMatrices,
    '## Top picks',
    '',
    ...topPicks.map(
      (tool) =>
        `- [${tool.name}](${toolUrl(tool.slug, origin)}) ${pickReason(tool)}`,
    ),
    '',
    '## Comparisons',
    '',
    comparisons,
    '## Alternatives hubs',
    '',
    hubs,
    '',
    methodologyMarkdown().replace(
      `- Dataset last verified: ${datasetLastVerified}`,
      `- Dataset last verified: ${verified}`,
    ),
    '',
    '## Full tool index',
    '',
    catalogLines,
    '',
    '## More',
    '',
    `- Full catalog with answer cards: ${absoluteUrl('llms-full.txt', origin)}`,
    `- Sitemap: ${absoluteUrl('sitemap-index.xml', origin)}`,
    `- Directory home: ${origin.replace(/\/$/, '')}/`,
    ...categories.map(
      (category) =>
        `- ${category}: ${absoluteUrl(categoryPath(category), origin)}`,
    ),
    `- Dataset last verified: ${verified}`,
    '',
  ].join('\n');
}

export function buildLlmsFullTxt(
  catalog: readonly Tool[] = tools,
  origin = siteOrigin,
  options: { datasetLastVerified?: string } = {},
): string {
  const verified = options.datasetLastVerified ?? datasetLastVerified;
  const comparisons = allComparisonSpecs(catalog)
    .filter((spec) => resolveComparison(spec, catalog))
    .map((spec) => comparisonBlock(spec, origin))
    .join('\n');
  const cards = catalog
    .map((tool) => {
      const hub = alternativesHubForTool(tool.slug, catalog);
      const comparisons = comparisonsForTool(tool.slug, catalog);
      return [
        `## ${tool.name}`,
        `- Directory: ${toolUrl(tool.slug, origin)}`,
        `- Official: ${tool.url}`,
        `- Vendor: ${tool.vendor}`,
        `- License: ${tool.license}`,
        `- Deployment: ${tool.deployment}`,
        `- Status: ${tool.status}${tool.successor ? ` (successor: ${tool.successor})` : ''}`,
        `- Category: ${tool.category}`,
        `- Protocols: ${join(tool.protocols)}`,
        `- Scripting: ${join(tool.scriptingLanguages)}`,
        `- Who: ${whoFor(tool)}`,
        `- What: ${tool.description}`,
        `- When not: ${whenNot(tool)}`,
        `- Longer: ${tool.longDescription}`,
        `- Choose when: ${bestFor(tool).join('; ')}`,
        `- Avoid when: ${notBestFor(tool).join('; ')}`,
        `- Compare: ${comparisons.map((spec) => absoluteUrl(`vs/${spec.pairPath}`, origin)).join(', ') || 'None recorded'}`,
        `- Alternatives: ${hub ? absoluteUrl(`alternatives/${hub.toolSlug}`, origin) : 'None recorded'}`,
        `- Markdown: ${markdownUrl(tool.slug, origin)}`,
        '',
      ].join('\n');
    })
    .join('\n');
  return [
    '# Performance Testing Tools Full Catalog',
    '',
    `Answer cards for ${catalog.length} tools. Last verified ${verified}.`,
    `Concise decision pack: ${absoluteUrl('llms.txt', origin)}`,
    '',
    '## Comparisons',
    '',
    comparisons,
    cards,
  ].join('\n');
}
