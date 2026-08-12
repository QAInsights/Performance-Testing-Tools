import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildWebManifest,
  CANONICAL_COMPARE_PAIRS,
} from './llmsContent';

describe('llms content builders', () => {
  it('builds a decision-ready llms.txt', () => {
    const text = buildLlmsTxt(tools, 'https://perf.jmeter.ai');
    expect(text).toContain('How to choose a load testing tool');
    expect(text).toContain('Pick matrices');
    expect(text).toContain('Top picks');
    expect(text).toContain('Canonical compare pairs');
    expect(text).toContain('llms-full.txt');
    expect(text).toContain('sitemap-index.xml');
    for (const tool of tools) {
      expect(text).toContain(tool.name);
    }
    for (const [a, b] of CANONICAL_COMPARE_PAIRS) {
      expect(text).toContain(a);
      expect(text).toContain(b);
    }
  });

  it('builds per-tool answer cards in llms-full.txt', () => {
    const text = buildLlmsFullTxt(tools, 'https://perf.jmeter.ai');
    expect(text).toContain('When not:');
    expect(text).toContain('## Apache JMeter');
    expect(text).toContain('Who:');
  });

  it('builds a root-relative web manifest by default', () => {
    const root = JSON.parse(buildWebManifest('/'));
    expect(root.start_url).toBe('/');
    expect(root.scope).toBe('/');
    expect(root.icons[0].src).toBe('/icons/icon-192.png');

    const pages = JSON.parse(buildWebManifest('/Performance-Testing-Tools'));
    expect(pages.start_url).toBe('/Performance-Testing-Tools/');
    expect(pages.icons[0].src).toBe(
      '/Performance-Testing-Tools/icons/icon-192.png',
    );
  });
});
