import { datasetLastVerified, type Tool } from '../data/tools';
import type { EnrichmentEntry } from './enrichmentData';
import {
  alternativesHubForTool,
  comparisonsForTool,
  resolveComparison,
  type SpecRow,
} from './comparisonContent';
import { toolSentence } from './derivedComparisons';
import { buildToolFaq } from './toolFaq';
import { architectureLine, bestFor, notBestFor } from './toolEntity';
import { absoluteUrl } from './urls';
import { correctionsUrl, curator, methodologyPoints } from './methodology';
import type { AlternativesHub, ComparisonSpec } from '../data/comparisons';

const line = (value: string) => value.trim();
const list = (values: readonly string[], empty = 'None (CLI-driven)') =>
  values.length ? values.join(', ') : empty;
const firstSentence = (value: string) =>
  value.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || value.trim();
export const answerBoxSplit = (value: string): string | undefined => {
  const sentences = value.trim().match(/[^.!?]+[.!?](?=\s|$)/g) || [];
  const finalSentence = sentences.at(-1)?.trim();
  return finalSentence?.startsWith('The practical split is ')
    ? finalSentence
    : undefined;
};
const footer = (origin: string) =>
  `---\nCurated by ${curator} · methodology: ${absoluteUrl('about#methodology', origin)} · corrections: ${correctionsUrl}`;

export function toolMarkdown(
  tool: Tool,
  catalog: readonly Tool[],
  origin: string,
  enrichment?: EnrichmentEntry,
): string {
  const compareLines = comparisonsForTool(tool.slug, catalog).flatMap(
    (spec) => {
      const resolved = resolveComparison(spec, catalog);
      if (!resolved) return [];
      return [
        `- [${spec.leftLabel} vs ${spec.rightLabel}](${absoluteUrl(`vs/${spec.pairPath}`, origin)}) — ${answerBoxSplit(spec.answerBox) || firstSentence(spec.decisions[0])}`,
      ];
    },
  );
  const hub = alternativesHubForTool(tool.slug, catalog);
  const faq = buildToolFaq(tool, catalog);
  const latest = enrichment?.latestRelease;
  const latestLine =
    latest?.version || latest?.date
      ? `- Latest release: ${latest.version || 'Not recorded'} (${latest.date || 'date not recorded'})`
      : '';
  const verifiedDate = (enrichment?.fetchedAt || datasetLastVerified).slice(
    0,
    10,
  );
  const pricing = enrichment?.pricing || tool.pricingModel;
  const lines = [
    `# ${tool.name}`,
    '',
    `> ${toolSentence(tool)}`,
    '',
    `- Canonical: ${absoluteUrl(`tools/${tool.slug}`, origin)}`,
    `- Official: ${tool.url}`,
    tool.repoUrl ? `- Source: ${tool.repoUrl}` : '',
    `- Vendor: ${tool.vendor}`,
    `- Category: ${tool.category}`,
    `- License: ${tool.license} — ${tool.pricingModel}`,
    `- Deployment: ${tool.deployment}`,
    `- Status: ${tool.status}${tool.successor ? ` (successor: ${tool.successor})` : ''}`,
    `- Scripting: ${list(tool.scriptingLanguages)}`,
    `- Protocols: ${list(tool.protocols, 'None recorded')}`,
    `- OS support: ${list(tool.osSupport, 'None recorded')}`,
    `- First released: ${tool.firstReleased ?? 'Not recorded'}`,
    latestLine,
    `- Last verified: ${verifiedDate}`,
    '',
    '## What it is',
    line(tool.longDescription),
    '',
    '## Choose it when',
    ...bestFor(tool).map((item) => `- ${item}`),
    '',
    '## Look elsewhere when',
    ...notBestFor(tool).map((item) => `- ${item}`),
    '',
    '## Architecture',
    architectureLine(tool),
    '',
    '## Pricing',
    pricing,
    '',
    '## Compare',
    ...compareLines,
    ...(hub
      ? [
          `- [${hub.headline}](${absoluteUrl(`alternatives/${hub.toolSlug}`, origin)})`,
        ]
      : []),
    '',
    '## FAQ',
    ...faq.flatMap((item) => [`### ${item.question}`, item.answer, '']),
    footer(origin),
  ];
  return lines
    .filter((item, index) => item !== '' || lines[index - 1] !== '')
    .join('\n');
}

export function comparisonMarkdown(
  spec: ComparisonSpec,
  left: Tool,
  right: Tool,
  rows: readonly SpecRow[],
  origin: string,
): string {
  const table = rows.map(
    (row) => `| ${row.field} | ${row.left} | ${row.right} |`,
  );
  return [
    `# ${spec.leftLabel} vs ${spec.rightLabel}`,
    '',
    `> ${spec.answerBox}`,
    '',
    `- Canonical: ${absoluteUrl(`vs/${spec.pairPath}`, origin)}`,
    `- Compared: [${left.name}](${absoluteUrl(`tools/${left.slug}`, origin)}) · [${right.name}](${absoluteUrl(`tools/${right.slug}`, origin)})`,
    '',
    '## Verdict',
    spec.verdict,
    '',
    '## Specs',
    `| Field | ${spec.leftLabel} | ${spec.rightLabel} |`,
    '| --- | --- | --- |',
    ...table,
    '',
    '## How to choose',
    ...spec.decisions.map((item) => `- ${item}`),
    '',
    footer(origin),
  ].join('\n');
}

export function alternativesMarkdown(
  hub: AlternativesHub,
  tool: Tool,
  peers: readonly Tool[],
  origin: string,
): string {
  return [
    `# ${hub.headline}`,
    '',
    `> ${hub.intro}`,
    '',
    `- Canonical: ${absoluteUrl(`alternatives/${hub.toolSlug}`, origin)}`,
    `- Baseline: [${tool.name}](${absoluteUrl(`tools/${tool.slug}`, origin)})`,
    '',
    `## Stay with ${tool.name} when`,
    ...hub.whenToStay.map((item) => `- ${item}`),
    '',
    '## Switch when',
    ...hub.whenToSwitch.map((item) => `- ${item}`),
    '',
    '## Alternatives',
    ...peers.map(
      (peer) =>
        `- [${peer.name}](${absoluteUrl(`tools/${peer.slug}`, origin)}) — ${peer.license}, ${peer.deployment}, ${peer.category}; ${peer.pricingModel}`,
    ),
    '',
    footer(origin),
  ].join('\n');
}

export function methodologyMarkdown(): string {
  return [
    `## Methodology`,
    ...methodologyPoints.map((point) => `- ${point}`),
    `- Dataset last verified: ${datasetLastVerified}`,
    `- Corrections: ${correctionsUrl}`,
  ].join('\n');
}
