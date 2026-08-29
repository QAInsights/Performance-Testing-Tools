import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  aboutTitle,
  categoryTitle,
  compareTitle,
  homeDescription,
  homeTitle,
  seoYear,
  toolDescription,
  toolTitle,
} from './pageMeta';

describe('page meta builders', () => {
  it('builds a home title with count and year', () => {
    expect(homeTitle()).toBe(
      `${tools.length} Performance Testing Tools Compared (${seoYear}) · Directory`,
    );
    expect(homeDescription()).toMatch(/Compare \d+ load/);
    expect(homeDescription()).not.toBe(
      'A curated directory of performance testing tools.',
    );
  });

  it('builds tool titles and richer descriptions', () => {
    const jmeter = tools.find((tool) => tool.slug === 'apache-jmeter')!;
    const discontinued = tools.find((tool) => tool.status === 'Discontinued')!;
    expect(toolTitle(jmeter)).toBe(
      'Apache JMeter: pricing, license & alternatives (2026)',
    );
    expect(toolTitle(discontinued)).toBe(
      `${discontinued.name}: discontinued, and what to use instead (${seoYear})`,
    );
    expect(toolDescription(jmeter)).not.toContain('License:');
    expect(toolDescription(jmeter).length).toBeLessThanOrEqual(158);
    for (const tool of tools) {
      expect(toolDescription(tool).length, tool.name).toBeLessThanOrEqual(158);
    }
  });

  it('builds category and compare titles', () => {
    expect(categoryTitle('Load Testing')).toBe(
      `Best Load Testing Tools (${seoYear}) · Curated Directory`,
    );
    expect(compareTitle(['JMeter', 'k6'])).toBe(
      'JMeter vs k6 Spec Comparison · Performance Testing Tools',
    );
    expect(compareTitle()).toMatch(/Test Rig/);
    expect(aboutTitle()).toMatch(/^About ·/);
  });
});
