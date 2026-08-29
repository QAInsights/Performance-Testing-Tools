import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';

describe('generated public content', () => {
  it('contains every tool in both LLM catalogs', () => {
    expect(existsSync('public/llms.txt')).toBe(true);
    expect(existsSync('public/llms-full.txt')).toBe(true);
    const concise = readFileSync('public/llms.txt', 'utf8');
    const full = readFileSync('public/llms-full.txt', 'utf8');
    expect(concise).toContain('How to choose a load testing tool');
    expect(concise).toContain('Canonical compare pairs');
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
});
