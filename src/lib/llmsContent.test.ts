import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildWebManifest,
} from './llmsContent';

describe('llms content builders', () => {
  it('builds a decision-ready llms.txt', () => {
    const text = buildLlmsTxt(tools, 'https://perf.jmeter.ai');
    expect(text).toContain('How to choose a load testing tool');
    expect(text).toContain('Pick matrices');
    expect(text).toContain('Top picks');
    expect(text).toContain('## Comparisons');
    expect(text).toContain('## Methodology');
    expect(text).toContain('llms-full.txt');
    expect(text).toContain('sitemap-index.xml');
    expect(text).toContain('https://perf.jmeter.ai/tools/apache-jmeter/');
    expect(text).toContain(
      'https://perf.jmeter.ai/vs/apache-jmeter-vs-gatling/',
    );
    expect(text).toContain('https://perf.jmeter.ai/llms-full.txt');
    expect(text).toContain('https://perf.jmeter.ai/sitemap-index.xml');
    for (const tool of tools) {
      expect(text).toContain(tool.name);
    }
  });

  it('builds per-tool answer cards in llms-full.txt', () => {
    const text = buildLlmsFullTxt(tools, 'https://perf.jmeter.ai');
    expect(text).toContain('When not:');
    expect(text).toContain('## Apache JMeter');
    expect(text).toContain('Who:');
    expect(text).toContain('- Choose when:');
    expect(text).toContain(
      '- Markdown: https://perf.jmeter.ai/tools/apache-jmeter.md',
    );
  });

  it('builds a root-relative web manifest by default', () => {
    const root = JSON.parse(buildWebManifest('/'));
    expect(root.start_url).toBe('/');
    expect(root.scope).toBe('/');
    expect(root.icons[0].src).toBe('/icons/icon-192.png');

    const subPath = JSON.parse(buildWebManifest('/foo'));
    expect(subPath.start_url).toBe('/foo/');
    expect(subPath.icons[0].src).toBe('/foo/icons/icon-192.png');
  });
});
