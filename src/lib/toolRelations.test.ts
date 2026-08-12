import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  compareWithLinks,
  languageChips,
  protocolChips,
  sameCategoryTools,
} from './toolRelations';

describe('tool relation links', () => {
  it('builds same-category and compare links', () => {
    const tool = tools.find((item) => item.slug === 'apache-jmeter')!;
    const similar = sameCategoryTools(tool, tools, 3);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar.every((item) => item.href.includes('/tools/'))).toBe(true);

    const compares = compareWithLinks(tool, tools, 3);
    expect(compares.length).toBeGreaterThan(0);
    expect(compares[0].href).toMatch(/\/(vs\/|compare\?tools=)/);
    expect(compares[0].slugs).toContain('apache-jmeter');
  });

  it('builds filter chips for languages and protocols', () => {
    const tool = tools.find((item) => item.slug === 'apache-jmeter')!;
    expect(languageChips(tool)[0].href).toMatch(/languages\/|language=/);
    expect(protocolChips(tool)[0].href).toMatch(/protocols\/|protocol=/);
  });
});
