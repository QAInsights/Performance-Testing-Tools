import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import { siteNoIndex } from '../config/site';

describe('generated public content', () => {
  it('contains every tool in both LLM catalogs', () => {
    expect(existsSync('public/llms.txt')).toBe(true);
    expect(existsSync('public/llms-full.txt')).toBe(true);
    const concise = readFileSync('public/llms.txt', 'utf8');
    const full = readFileSync('public/llms-full.txt', 'utf8');
    for (const tool of tools) {
      expect(concise).toContain(tool.name);
      expect(full).toContain(`## ${tool.name}`);
    }
  });

  it('uses indexable robots directives for the default build', () => {
    expect(siteNoIndex).toBe(false);
    expect(readFileSync('public/robots.txt', 'utf8')).toContain('Allow: /');
    expect(readFileSync('public/robots.txt', 'utf8')).not.toContain(
      'Disallow: /',
    );
  });

  it('uses the canonical origin in generated robots metadata', () => {
    expect(readFileSync('public/robots.txt', 'utf8')).toContain(
      'Sitemap: https://perf.jmeter.ai/sitemap-index.xml',
    );
  });
});
