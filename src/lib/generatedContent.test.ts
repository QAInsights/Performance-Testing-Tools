import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  allAlternativesHubs,
  allComparisonSpecs,
  alternativesForHub,
  resolveComparison,
} from './comparisonContent';
import { hubPeers } from './derivedComparisons';
import {
  alternativesMarkdown,
  comparisonMarkdown,
  toolMarkdown,
} from './markdownMirror';
import { buildLlmsFullTxt, buildLlmsTxt } from './llmsContent';
import { siteOrigin } from '../config/site';
import { curatorPerson } from './methodology';

describe('generated public content', () => {
  it('contains every tool in both LLM catalogs', () => {
    expect(existsSync('public/llms.txt')).toBe(true);
    expect(existsSync('public/llms-full.txt')).toBe(true);
    const concise = readFileSync('public/llms.txt', 'utf8');
    const full = readFileSync('public/llms-full.txt', 'utf8');
    expect(concise).toContain('How to choose a load testing tool');
    expect(concise).toContain('## Comparisons');
    expect(concise).toContain('## Methodology');
    expect(full).toContain('When not:');
    for (const tool of tools) {
      expect(concise).toContain(tool.name);
      expect(full).toContain(`## ${tool.name}`);
    }
  });

  it('publishes a well-known llms.txt copy', () => {
    expect(existsSync('public/.well-known/llms.txt')).toBe(true);
    expect(readFileSync('public/.well-known/llms.txt', 'utf8')).toContain(
      'How to choose a load testing tool',
    );
  });

  it('generates a root-scoped web manifest for the default base', () => {
    const manifest = JSON.parse(
      readFileSync('public/manifest.webmanifest', 'utf8'),
    );
    expect(manifest.start_url).toBe('/');
    expect(manifest.scope).toBe('/');
    expect(manifest.icons[0].src).toBe('/icons/icon-192.png');
  });

  it('publishes an open tools.json catalog for agents', () => {
    expect(existsSync('public/tools.json')).toBe(true);
    const catalog = JSON.parse(readFileSync('public/tools.json', 'utf8'));
    expect(catalog.count).toBe(tools.length);
    expect(catalog.tools).toHaveLength(tools.length);
    expect(existsSync('public/tools/apache-jmeter.json')).toBe(true);
  });

  it('uses indexable robots directives for the default build', () => {
    expect(readFileSync('public/robots.txt', 'utf8')).toBe(
      '# Performance Testing Tools — https://perf.jmeter.ai\n# Machine-readable catalog: https://perf.jmeter.ai/llms.txt\n# Full catalog: https://perf.jmeter.ai/llms-full.txt\n# Structured data: https://perf.jmeter.ai/tools.json\n\nUser-agent: *\nAllow: /\n\n# Answer engines and AI crawlers are explicitly welcome.\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-User\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: Applebot-Extended\nAllow: /\n\nUser-agent: CCBot\nAllow: /\n\nSitemap: https://perf.jmeter.ai/sitemap-index.xml\n',
    );
  });

  it('builds complete markdown mirrors without placeholder artifacts', () => {
    const invalid = (body: string) =>
      expect(body).not.toMatch(/undefined|NaN|\n-\s*$/m);
    for (const tool of tools) {
      const body = toolMarkdown(tool, tools, siteOrigin);
      expect(body).toMatch(/^# /);
      expect(body).toContain(
        `Canonical: https://perf.jmeter.ai/tools/${tool.slug}/`,
      );
      expect(body).toMatch(/^- Last verified: \d{4}-\d{2}-\d{2}$/m);
      expect(body).not.toMatch(/^- Last verified: .*T.*$/m);
      expect(body).toContain(
        `Curated by ${curatorPerson.name} (QAInsights) · methodology:`,
      );
      expect(body.trim()).not.toBe('');
      invalid(body);
    }
    for (const spec of allComparisonSpecs(tools)) {
      const resolved = resolveComparison(spec, tools);
      expect(resolved).toBeTruthy();
      const body = comparisonMarkdown(
        spec,
        resolved!.left,
        resolved!.right,
        resolved!.rows,
        siteOrigin,
      );
      expect(body).toMatch(/^# /);
      expect(body).toContain(
        `Canonical: https://perf.jmeter.ai/vs/${spec.pairPath}/`,
      );
      invalid(body);
    }
    for (const hub of allAlternativesHubs(tools)) {
      const tool = tools.find((item) => item.slug === hub.toolSlug)!;
      const peers =
        hub.tier === 'B'
          ? hubPeers(tool, tools)
          : alternativesForHub(hub, tools);
      const body = alternativesMarkdown(hub, tool, peers, siteOrigin);
      expect(body).toMatch(/^# /);
      expect(body).toContain(
        `Canonical: https://perf.jmeter.ai/alternatives/${hub.toolSlug}/`,
      );
      invalid(body);
    }
  });

  it('keeps markdown mirror counts aligned with the HTML routes', () => {
    expect(tools).toHaveLength(78);
    expect(allComparisonSpecs(tools)).toHaveLength(56);
    expect(allAlternativesHubs(tools)).toHaveLength(46);
  });

  it('publishes every static comparison and methodology in llms.txt', () => {
    const text = buildLlmsTxt(tools, siteOrigin);
    for (const spec of allComparisonSpecs(tools)) {
      expect(text).toContain(`- [${spec.leftLabel} vs ${spec.rightLabel}](`);
    }
    expect(text).toContain('## Methodology');
    expect(text).toContain(`curated by ${curatorPerson.name}.`);
    const full = buildLlmsFullTxt(tools, siteOrigin);
    expect(full).toContain('## Comparisons');
    expect(full).toContain('### JMeter vs k6');
    expect(full).toContain('Verdict:');
  });

  it('renders methodology on the about page', () => {
    expect(readFileSync('src/pages/about.astro', 'utf8')).toContain(
      'How this directory is maintained',
    );
    expect(readFileSync('src/pages/about.astro', 'utf8')).toContain(
      'methodologyPoints.map',
    );
  });
});
